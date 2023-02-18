module Logic.App.Stack.Stack exposing (..)

import Array exposing (Array)
import List.Extra as List
import Logic.App.Types exposing (ApplyToStackResult(..), Iota(..), Mishap(..), PatternType)
import Logic.App.Utils.Utils exposing (unshift)


applyPatternsToStackStopAtError : Array Iota -> List PatternType -> ( Array Iota, Array ApplyToStackResult, Bool )
applyPatternsToStackStopAtError stack patterns =
    applyPatternsToStackLoop ( stack, Array.empty ) patterns False True


applyPatternsToStack : Array Iota -> List PatternType -> ( Array Iota, Array ApplyToStackResult )
applyPatternsToStack stack patterns =
    case applyPatternsToStackLoop ( stack, Array.empty ) patterns False False of
        ( newStack, resultArray, _ ) ->
            ( newStack, resultArray )


applyPatternsToStackLoop : ( Array Iota, Array ApplyToStackResult ) -> List PatternType -> Bool -> Bool -> ( Array Iota, Array ApplyToStackResult, Bool )
applyPatternsToStackLoop stackResultTuple patterns considerThis stopAtError =
    let
        stack =
            Tuple.first stackResultTuple

        resultArray =
            Tuple.second stackResultTuple
    in
    case List.head patterns of
        Nothing ->
            ( stack, resultArray, False )

        Just pattern ->
            if considerThis then
                applyPatternsToStackLoop
                    ( addEscapedPatternIotaToStack stack pattern, unshift Considered resultArray )
                    (Maybe.withDefault [] <| List.tail patterns)
                    False
                    stopAtError

            else
                case applyPatternToStack stack pattern of
                    ( newStack, result, considerNext ) ->
                        if not stopAtError || (stopAtError && result /= Failed) then
                            applyPatternsToStackLoop
                                ( newStack, unshift result resultArray )
                                (Maybe.withDefault [] <| List.tail patterns)
                                considerNext
                                stopAtError

                        else
                            ( newStack, unshift result resultArray, True )



applyPatternToStack : Array Iota -> PatternType -> ( Array Iota, ApplyToStackResult, Bool )
applyPatternToStack stack pattern =
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
                ( stack, Succeeded, True )

            else if pattern.internalName == "close_paren" then
                if pattern.internalName == "close_paren" && (numberOfCloseParen + 1) >= numberOfOpenParen then
                    ( Array.map
                        (\iota ->
                            case iota of
                                OpenParenthesis l ->
                                    IotaList l

                                otherIota ->
                                    otherIota
                        )
                        stack
                    , Succeeded
                    , False
                    )

                else
                    ( addToIntroList, Considered, False )

            else if pattern.internalName == "open_paren" then
                ( addToIntroList, Considered, False )

            else
                ( addToIntroList, Considered, False )

        _ ->
            if pattern.internalName == "escape" then
                ( stack, Succeeded, True )

            else if pattern.internalName == "close_paren" then
                ( unshift (Garbage CatastrophicFailure) stack, Failed, False )
                --temporary

            else
                case pattern.action stack of
                    ( newStack, True ) ->
                        ( newStack, Succeeded, False )

                    ( newStack, False ) ->
                        ( newStack, Failed, False )


addEscapedPatternIotaToStack : Array Iota -> PatternType -> Array Iota
addEscapedPatternIotaToStack stack pattern =
    case Array.get 0 stack of
        Just (OpenParenthesis list) ->
            Array.set 0 (OpenParenthesis (unshift (Pattern pattern True) list)) stack

        _ ->
            unshift (Pattern pattern True) stack
