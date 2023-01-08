module Logic.App.Stack.Stack exposing (..)

import Array exposing (Array)
import List.Extra as List
import Logic.App.Types exposing (Iota(..), Mishap(..), PatternType)
import Logic.App.Utils.Utils exposing (unshift)



-- untested; might not work properly


applyPatternsToStack : Array Iota -> List PatternType -> Bool -> Array Iota
applyPatternsToStack stack patterns escapeThis =
    case List.head patterns of
        Nothing ->
            stack

        Just pattern ->
            if escapeThis then
                applyPatternsToStack (addPatternIotatoStack stack pattern) (Maybe.withDefault [] <| List.tail patterns) False

            else
                let
                    stackEscapeTuple =
                        applyPatternToStack stack pattern

                    newStack =
                        Tuple.first <| stackEscapeTuple

                    escapeNext =
                        Tuple.second <| stackEscapeTuple
                in
                applyPatternsToStack newStack (Maybe.withDefault [] <| List.tail patterns) escapeNext


applyPatternToStack : Array Iota -> PatternType -> ( Array Iota, Bool )
applyPatternToStack stack pattern =
    case Array.get 0 stack of
        Just (OpenParenthesis list) ->
            let
                numberOfCloseParen =
                    Array.length
                        (Array.filter
                            (\iota ->
                                case iota of
                                    Pattern pat ->
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
                                        Pattern pat ->
                                            pat.internalName == "open_paren"

                                        _ ->
                                            False
                                )
                                list
                            )

                addToIntroList =
                    Array.set 0 (OpenParenthesis (unshift (Pattern pattern) list)) stack
            in
            if pattern.internalName == "escape" then
                ( stack, True )

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
                    , False
                    )

                else
                    ( addToIntroList, False )

            else
                ( addToIntroList, False )

        _ ->
            if pattern.internalName == "escape" then
                ( stack, True )

            else if pattern.internalName == "close_paren" then
                ( unshift (Garbage CatastrophicFailure) stack, False )
                --temporary

            else
                ( pattern.action stack, False )


addPatternIotatoStack : Array Iota -> PatternType -> Array Iota
addPatternIotatoStack stack pattern =
    case Array.get 0 stack of
        Just (OpenParenthesis list) ->
            Array.set 0 (OpenParenthesis (unshift (Pattern pattern) list)) stack

        _ ->
            unshift (Pattern pattern) stack
