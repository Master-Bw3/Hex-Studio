module Logic.App.Stack.Stack exposing (..)

import Array exposing (Array)
import List.Extra as List
import Logic.App.Types exposing (ActionResult, ApplyToStackResult(..), CastingContext, Iota(..), Mishap(..), Pattern)
import Logic.App.Utils.Utils exposing (isJust, unshift)
import Logic.App.Types exposing (IotaType(..))


applyToStackStopAtErrorOrHalt : Array Iota -> CastingContext -> Array Iota -> { stack : Array Iota, resultArray : Array ApplyToStackResult, ctx : CastingContext, error : Bool, halted : Bool }
applyToStackStopAtErrorOrHalt stack ctx iotas =
    applyToStackLoop ( stack, Array.empty ) ctx (Array.toList iotas) False True


applyPatternsToStack : Array Iota -> CastingContext -> List Pattern -> { stack : Array Iota, resultArray : Array ApplyToStackResult, ctx : CastingContext, error : Bool, halted : Bool }
applyPatternsToStack stack ctx patterns =
    let
        patternIotas =
            List.map (\pattern -> PatternIota pattern False) patterns
    in
    applyToStackLoop ( stack, Array.empty ) ctx patternIotas False False


applyToStackLoop : ( Array Iota, Array ApplyToStackResult ) -> CastingContext -> List Iota -> Bool -> Bool -> { stack : Array Iota, resultArray : Array ApplyToStackResult, ctx : CastingContext, error : Bool, halted : Bool }
applyToStackLoop stackResultTuple ctx patterns considerThis stopAtErrorOrHalt =
    let
        stack =
            Tuple.first stackResultTuple

        resultArray =
            Tuple.second stackResultTuple

        introspection =
            case Array.get 0 stack of
                Just (OpenParenthesis _) ->
                    True

                _ ->
                    False
    in
    case List.head patterns of
        Nothing ->
            { stack = stack, resultArray = resultArray, ctx = ctx, error = False, halted = False }

        Just (PatternIota pattern _) ->
            if considerThis then
                applyToStackLoop
                    ( addEscapedIotaToStack stack (PatternIota pattern True), unshift Considered resultArray )
                    ctx
                    (Maybe.withDefault [] <| List.tail patterns)
                    False
                    stopAtErrorOrHalt

            else if pattern.internalName == "halt" && stopAtErrorOrHalt then
                { stack = stack, resultArray = resultArray, ctx = ctx, error = False, halted = True }

            else
                let
                    applyResult =
                        applyPatternToStack stack ctx pattern
                in
                if not stopAtErrorOrHalt || (stopAtErrorOrHalt && applyResult.result /= Failed) then
                    applyToStackLoop
                        ( applyResult.stack, unshift applyResult.result resultArray )
                        applyResult.ctx
                        (Maybe.withDefault [] <| List.tail patterns)
                        applyResult.considerNext
                        stopAtErrorOrHalt

                else
                    let
                        _ =
                            Debug.log "error" pattern
                    in
                    Debug.log "error" { stack = applyResult.stack, resultArray = unshift applyResult.result resultArray, ctx = applyResult.ctx, error = True, halted = False }

        Just iota ->
            if considerThis || introspection then
                applyToStackLoop
                    ( addEscapedIotaToStack stack iota, unshift Considered resultArray )
                    ctx
                    (Maybe.withDefault [] <| List.tail patterns)
                    False
                    stopAtErrorOrHalt

            else
                Debug.log "error" { stack = stack, resultArray = resultArray, ctx = ctx, error = True, halted = False }


applyPatternToStack : Array Iota -> CastingContext -> Pattern -> { stack : Array Iota, result : ApplyToStackResult, ctx : CastingContext, considerNext : Bool }
applyPatternToStack stack ctx pattern =
    case Array.get 0 stack of
        Just (OpenParenthesis list) ->
            let
                numberOfCloseParen =
                    Array.length
                        (Array.filter
                            (\iota ->
                                case iota of
                                    PatternIota pat False ->
                                        pat.internalName == "close_paren"

                                    _ ->
                                        False
                            )
                            list
                        )

                numberOfOpenParen =
                    (+) 1 <|
                        Array.length
                            (Array.filter
                                (\iota ->
                                    case iota of
                                        PatternIota pat False ->
                                            pat.internalName == "open_paren"

                                        _ ->
                                            False
                                )
                                list
                            )

                addToIntroList =
                    Array.set 0 (OpenParenthesis (Array.push (PatternIota pattern False) list)) stack
            in
            if pattern.internalName == "escape" then
                { stack = stack, result = Succeeded, ctx = ctx, considerNext = True }

            else if pattern.internalName == "close_paren" then
                if pattern.internalName == "close_paren" && (numberOfCloseParen + 1) >= numberOfOpenParen then
                    { stack =
                        Array.map
                            (\iota ->
                                case iota of
                                    OpenParenthesis l ->
                                        IotaList l

                                    otherIota ->
                                        otherIota
                            )
                            stack
                    , result = Succeeded
                    , ctx = ctx
                    , considerNext = False
                    }

                else
                    { stack = addToIntroList, result = Considered, ctx = ctx, considerNext = False }

            else if pattern.internalName == "open_paren" then
                { stack = addToIntroList, result = Considered, ctx = ctx, considerNext = False }

            else
                { stack = addToIntroList, result = Considered, ctx = ctx, considerNext = False }

        _ ->
            if pattern.internalName == "escape" then
                { stack = stack, result = Succeeded, ctx = ctx, considerNext = True }

            else if pattern.internalName == "close_paren" then
                { stack = unshift (PatternIota pattern False) stack, result = Failed, ctx = ctx, considerNext = False }

            else
                let
                    actionResult =
                        let
                            preActionResult =
                                pattern.action stack ctx
                        in
                        if preActionResult.success == True && isJust pattern.selectedOutput then
                            { preActionResult | stack = unshift (Tuple.second <| Maybe.withDefault (NullType, Null) pattern.selectedOutput) preActionResult.stack }

                        else
                            preActionResult
                in
                if actionResult.success == True then
                    { stack = actionResult.stack, result = Succeeded, ctx = actionResult.ctx, considerNext = False }

                else
                    { stack = actionResult.stack, result = Failed, ctx = actionResult.ctx, considerNext = False }


addEscapedIotaToStack : Array Iota -> Iota -> Array Iota
addEscapedIotaToStack stack iota =
    case Array.get 0 stack of
        Just (OpenParenthesis list) ->
            Array.set 0 (OpenParenthesis (Array.push iota list)) stack

        _ ->
            unshift iota stack
