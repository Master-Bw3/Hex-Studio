module Logic.App.Patterns.Stack exposing (..)

import Array exposing (Array)
import FontAwesome.Attributes exposing (stack)
import Html.Attributes exposing (action)
import Logic.App.Patterns.OperatorUtils exposing (action1Input, action2Inputs, action3Inputs, getAny, getInteger)
import Logic.App.Types exposing (Iota(..), Mishap(..))
import Logic.App.Utils.Utils exposing (removeFromArray, unshift)
import Settings.Theme exposing (accent1)


swap : Array Iota -> Array Iota
swap stack =
    let
        action iota1 iota2 =
            Array.fromList
                [ iota1
                , iota2
                ]
    in
    action2Inputs stack getAny getAny action


rotate : Array Iota -> Array Iota
rotate stack =
    let
        action iota1 iota2 iota3 =
            Array.fromList
                [ iota1
                , iota3
                , iota2
                ]
    in
    action3Inputs stack getAny getAny getAny action


rotateReverse : Array Iota -> Array Iota
rotateReverse stack =
    let
        action iota1 iota2 iota3 =
            Array.fromList
                [ iota2
                , iota1
                , iota3
                ]
    in
    action3Inputs stack getAny getAny getAny action


duplicate : Array Iota -> Array Iota
duplicate stack =
    let
        action iota =
            Array.fromList
                [ iota
                , iota
                ]
    in
    action1Input stack getAny action


over : Array Iota -> Array Iota
over stack =
    let
        action iota1 iota2 =
            Array.fromList
                [ iota1
                , iota2
                , iota1
                ]
    in
    action2Inputs stack getAny getAny action


tuck : Array Iota -> Array Iota
tuck stack =
    let
        action iota1 iota2 =
            Array.fromList
                [ iota2
                , iota1
                , iota2
                ]
    in
    action2Inputs stack getAny getAny action


dup2 : Array Iota -> Array Iota
dup2 stack =
    let
        action iota1 iota2 =
            Array.fromList
                [ iota2
                , iota1
                , iota2
                , iota1
                ]
    in
    action2Inputs stack getAny getAny action


stackLength : Array Iota -> Array Iota
stackLength stack =
    unshift (Number (toFloat <| Array.length stack)) stack


duplicateN : Array Iota -> Array Iota
duplicateN stack =
    let
        action iota1 iota2 =
            case iota2 of
                Number number ->
                    Array.fromList <| List.repeat (round number) iota1

                _ ->
                    Array.fromList [ Garbage CatastrophicFailure ]
    in
    action2Inputs stack getAny getInteger action


fisherman : Array Iota -> Array Iota
fisherman stack =
    let
        maybeIota =
            Array.get 0 stack

        newStack =
            Array.slice 1 (Array.length stack) stack
    in
    case maybeIota of
        Nothing ->
            Array.append (Array.fromList [ Garbage NotEnoughIotas, Garbage NotEnoughIotas ]) newStack

        Just iota ->
            case getInteger <| iota of
                Nothing ->
                    unshift (Garbage IncorrectIota) newStack

                _ ->
                    case iota of
                        Number number ->
                            let
                                newNewStack =
                                    removeFromArray (round number - 1) (round number) newStack

                                maybeCaughtIota =
                                    Array.get (round number - 1) newStack
                            in
                            case maybeCaughtIota of
                                Nothing ->
                                    unshift (Garbage NotEnoughIotas) stack

                                Just caughtIota ->
                                    unshift caughtIota newNewStack

                        _ ->
                            Array.fromList [ Garbage CatastrophicFailure ]


fishermanCopy : Array Iota -> Array Iota
fishermanCopy stack =
    let
        maybeIota =
            Array.get 0 stack

        newStack =
            Array.slice 1 (Array.length stack) stack
    in
    case maybeIota of
        Nothing ->
            Array.append (Array.fromList [ Garbage NotEnoughIotas, Garbage NotEnoughIotas ]) newStack

        Just iota ->
            case getInteger <| iota of
                Nothing ->
                    unshift (Garbage IncorrectIota) newStack

                _ ->
                    case iota of
                        Number number ->
                            let
                                maybeCaughtIota =
                                    Array.get (round number) newStack
                            in
                            case maybeCaughtIota of
                                Nothing ->
                                    unshift (Garbage NotEnoughIotas) stack

                                Just caughtIota ->
                                    unshift caughtIota newStack

                        _ ->
                            Array.fromList [ Garbage CatastrophicFailure ]


