module Logic.App.Stack.Stack exposing (..)

import Array exposing (Array)
import List.Extra as List
import Logic.App.Types exposing (ActionResult, ApplyToStackResult(..), CastingContext, Iota(..), Mishap(..), PatternType)
import Logic.App.Utils.Utils exposing (unshift)


applyPatternsToStackStopAtErrorOrHalt : Array Iota -> CastingContext -> List PatternType -> {stack : Array Iota, resultArray : Array ApplyToStackResult, ctx : CastingContext, error : Bool }
applyPatternsToStackStopAtErrorOrHalt stack ctx patterns =
    applyPatternsToStackLoop ( stack, Array.empty ) ctx patterns False True


applyPatternsToStack : Array Iota -> CastingContext -> List PatternType -> {stack : Array Iota, resultArray : Array ApplyToStackResult, ctx : CastingContext, error : Bool }
applyPatternsToStack stack ctx patterns =
    applyPatternsToStackLoop ( stack, Array.empty ) ctx patterns False False

applyPatternsToStackLoop : ( Array Iota, Array ApplyToStackResult ) -> CastingContext -> List PatternType -> Bool -> Bool -> {stack : Array Iota, resultArray : Array ApplyToStackResult, ctx : CastingContext, error : Bool }
applyPatternsToStackLoop stackResultTuple ctx patterns considerThis stopAtErrorOrHalt =
    let
        stack =
            Tuple.first stackResultTuple

        resultArray =
            Tuple.second stackResultTuple
    in
    case List.head patterns of
        Nothing ->
            {stack = stack, resultArray = resultArray, ctx = ctx, error = False }

        Just pattern ->
            if considerThis then
                applyPatternsToStackLoop
                    ( addEscapedPatternIotaToStack stack pattern, unshift Considered resultArray )
                    ctx
                    (Maybe.withDefault [] <| List.tail patterns)
                    False
                    stopAtErrorOrHalt

            else if pattern.internalName == "halt" && stopAtErrorOrHalt then
                {stack = stack, resultArray = resultArray, ctx = ctx, error = False }

            else
                let
                    applyResult =
                        applyPatternToStack stack ctx pattern
                in
                if not stopAtErrorOrHalt || (stopAtErrorOrHalt && applyResult.result /= Failed) then
                    applyPatternsToStackLoop
                        ( applyResult.stack, unshift applyResult.result resultArray )
                        applyResult.ctx
                        (Maybe.withDefault [] <| List.tail patterns)
                        applyResult.considerNext
                        stopAtErrorOrHalt

                else
                {stack = applyResult.stack, resultArray = unshift applyResult.result resultArray, ctx = applyResult.ctx, error = True }


applyPatternToStack : Array Iota -> CastingContext -> PatternType -> { stack : Array Iota, result : ApplyToStackResult, ctx : CastingContext, considerNext : Bool }
applyPatternToStack stack ctx pattern =
    case Array.get 0 stack of
        Just (OpenParenthesis list) ->
            let
                numberOfCloseParen =
                    Array.length
                        (Array.filter
                            (\iota ->
                                case iota of
                                    Pattern pat False ->
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
                                        Pattern pat False ->
                                            pat.internalName == "open_paren"

                                        _ ->
                                            False
                                )
                                list
                            )

                addToIntroList =
                    Array.set 0 (OpenParenthesis (unshift (Pattern pattern False) list)) stack
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
                { stack = unshift (Pattern pattern False) stack, result = Failed, ctx = ctx, considerNext = False }

            else
                let
                    actionresult =
                        pattern.action stack ctx
                in
                if actionresult.success == True then
                    { stack = actionresult.stack, result = Succeeded, ctx = actionresult.ctx, considerNext = False }

                else
                    { stack = actionresult.stack, result = Failed, ctx = actionresult.ctx, considerNext = False }


addEscapedPatternIotaToStack : Array Iota -> PatternType -> Array Iota
addEscapedPatternIotaToStack stack pattern =
    case Array.get 0 stack of
        Just (OpenParenthesis list) ->
            Array.set 0 (OpenParenthesis (unshift (Pattern pattern True) list)) stack

        _ ->
            unshift (Pattern pattern True) stack
