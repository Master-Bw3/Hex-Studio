module Logic.App.Patterns.Stack exposing (..)

import Array exposing (Array)
import FontAwesome.Attributes exposing (stack)
import Html.Attributes exposing (action)
import Logic.App.Patterns.OperatorUtils exposing (action1Input, action2Inputs, action3Inputs, actionNoInput, getAny, getInteger)
import Logic.App.Types exposing (ActionResult, CastingContext, Iota(..), Mishap(..))
import Logic.App.Utils.Utils exposing (removeFromArray, unshift)


swap : Array Iota -> CastingContext -> ActionResult
swap stack ctx =
    let
        action iota1 iota2 _ =
            ( Array.fromList
                [ iota1
                , iota2
                ]
            , ctx
            )
    in
    action2Inputs stack ctx getAny getAny action


rotate : Array Iota -> CastingContext -> ActionResult
rotate stack ctx =
    let
        action iota1 iota2 iota3 _ =
            ( Array.fromList
                [ iota1
                , iota3
                , iota2
                ]
            , ctx
            )
    in
    action3Inputs stack ctx getAny getAny getAny action


rotateReverse : Array Iota -> CastingContext -> ActionResult
rotateReverse stack ctx =
    let
        action iota1 iota2 iota3 _ =
            ( Array.fromList
                [ iota2
                , iota1
                , iota3
                ]
            , ctx
            )
    in
    action3Inputs stack ctx getAny getAny getAny action


duplicate : Array Iota -> CastingContext -> ActionResult
duplicate stack ctx =
    let
        action iota _ =
            ( Array.fromList
                [ iota
                , iota
                ]
            , ctx
            )
    in
    action1Input stack ctx getAny action


over : Array Iota -> CastingContext -> ActionResult
over stack ctx =
    let
        action iota1 iota2 _ =
            ( Array.fromList
                [ iota1
                , iota2
                , iota1
                ]
            , ctx
            )
    in
    action2Inputs stack ctx getAny getAny action


tuck : Array Iota -> CastingContext -> ActionResult
tuck stack ctx =
    let
        action iota1 iota2 _ =
            ( Array.fromList
                [ iota2
                , iota1
                , iota2
                ]
            , ctx
            )
    in
    action2Inputs stack ctx getAny getAny action


dup2 : Array Iota -> CastingContext -> ActionResult
dup2 stack ctx =
    let
        action iota1 iota2 _ =
            ( Array.fromList
                [ iota2
                , iota1
                , iota2
                , iota1
                ]
            , ctx
            )
    in
    action2Inputs stack ctx getAny getAny action


stackLength : Array Iota -> CastingContext -> ActionResult
stackLength stack ctx =
    actionNoInput stack ctx (\_ -> ( unshift (Number (toFloat <| Array.length stack)) stack, ctx ))


duplicateN : Array Iota -> CastingContext -> ActionResult
duplicateN stack ctx =
    let
        action iota1 iota2 _ =
            ( case iota2 of
                Number number ->
                    Array.fromList <| List.repeat (round number) iota1

                _ ->
                    Array.fromList [ Garbage CatastrophicFailure ]
            , ctx
            )
    in
    action2Inputs stack ctx getAny getInteger action


fisherman : Array Iota -> CastingContext -> ActionResult
fisherman stack ctx =
    let
        maybeIota =
            Array.get 0 stack

        newStack =
            Array.slice 1 (Array.length stack) stack
    in
    case maybeIota of
        Nothing ->
            { stack = Array.append (Array.fromList [ Garbage NotEnoughIotas, Garbage NotEnoughIotas ]) newStack, ctx = ctx, success = False }

        Just iota ->
            case getInteger <| iota of
                Nothing ->
                    { stack = unshift (Garbage IncorrectIota) newStack, ctx = ctx, success = False }

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
                                    { stack = unshift (Garbage NotEnoughIotas) stack, ctx = ctx, success = False }

                                Just caughtIota ->
                                    { stack = unshift caughtIota newNewStack, ctx = ctx, success = True }

                        _ ->
                            { stack = Array.fromList [ Garbage CatastrophicFailure ], ctx = ctx, success = False }


fishermanCopy : Array Iota -> CastingContext -> ActionResult
fishermanCopy stack ctx =
    let
        maybeIota =
            Array.get 0 stack

        newStack =
            Array.slice 1 (Array.length stack) stack
    in
    case maybeIota of
        Nothing ->
            { stack = Array.append (Array.fromList [ Garbage NotEnoughIotas, Garbage NotEnoughIotas ]) newStack, ctx = ctx, success = False }

        Just iota ->
            case getInteger <| iota of
                Nothing ->
                    { stack = unshift (Garbage IncorrectIota) newStack, ctx = ctx, success = False }

                _ ->
                    case iota of
                        Number number ->
                            let
                                maybeCaughtIota =
                                    Array.get (round number) newStack
                            in
                            case maybeCaughtIota of
                                Nothing ->
                                    { stack = unshift (Garbage NotEnoughIotas) stack, ctx = ctx, success = False }

                                Just caughtIota ->
                                    { stack = unshift caughtIota newStack, ctx = ctx, success = True }

                        _ ->
                            { stack = Array.fromList [ Garbage CatastrophicFailure ], ctx = ctx, success = False }
