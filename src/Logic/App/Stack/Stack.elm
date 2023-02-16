module Logic.App.Stack.Stack exposing (..)

import Array exposing (Array)
import List.Extra as List
import Logic.App.Types exposing (ApplyToStackResult(..), Iota(..), Mishap(..), PatternType)
import Logic.App.Utils.Utils exposing (unshift)



-- untested; might not work properly


applyPatternsToStack : ( Array Iota, Array ApplyToStackResult ) -> List PatternType -> Bool -> ( Array Iota, Array ApplyToStackResult )
applyPatternsToStack stackResultTuple patterns considerThis =
    let
        stack =
            Tuple.first stackResultTuple

        resultArray =
            Tuple.second stackResultTuple
    in
    case List.head patterns of
        Nothing ->
            stackResultTuple

        Just pattern ->
            if considerThis then
                applyPatternsToStack
                    ( addEscapedPatternIotaToStack stack pattern, unshift Considered resultArray )
                    (Maybe.withDefault [] <| List.tail patterns)
                    False

            else
                case applyPatternToStack stack pattern of
                    ( newStack, result, considerNext ) ->
                        applyPatternsToStack
                            ( newStack, unshift result resultArray )
                            (Maybe.withDefault [] <| List.tail patterns)
                            considerNext


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
                ( pattern.action stack, Succeeded, False )


addEscapedPatternIotaToStack : Array Iota -> PatternType -> Array Iota
addEscapedPatternIotaToStack stack pattern =
    case Array.get 0 stack of
        Just (OpenParenthesis list) ->
            Array.set 0 (OpenParenthesis (unshift (Pattern pattern True) list)) stack

        _ ->
            unshift (Pattern pattern True) stack
