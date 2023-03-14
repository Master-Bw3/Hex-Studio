module Logic.App.Patterns.Lists exposing (..)

import Array exposing (Array)
import Array.Extra as Array
import Logic.App.Patterns.OperatorUtils exposing (action1Input, action2Inputs, action3Inputs, checkEquality, getAny, getInteger, getIotaList, getNumber, getPositiveInteger)
import Logic.App.Types exposing (ActionResult, CastingContext, Iota(..), Mishap(..))
import Logic.App.Utils.Utils exposing (removeFromArray, unshift)


singleton : Array Iota -> CastingContext -> ActionResult
singleton stack ctx =
    let
        action iota _ =
            ( IotaList (Array.repeat 1 iota)
                |> Array.repeat 1
            , ctx
            )
    in
    action1Input stack ctx getAny action


append : Array Iota -> CastingContext -> ActionResult
append stack ctx =
    let
        action listIota iota _ =
            ( case listIota of
                IotaList list ->
                    IotaList (Array.push iota list)
                        |> Array.repeat 1

                _ ->
                    Garbage CatastrophicFailure
                        |> Array.repeat 1
            , ctx
            )
    in
    action2Inputs stack ctx getIotaList getAny action


concat : Array Iota -> CastingContext -> ActionResult
concat stack ctx =
    let
        action iota1 iota2 _ =
            ( case ( iota1, iota2 ) of
                ( IotaList list1, IotaList list2 ) ->
                    IotaList (Array.append list1 list2)
                        |> Array.repeat 1

                _ ->
                    Garbage CatastrophicFailure
                        |> Array.repeat 1
            , ctx
            )
    in
    action2Inputs stack ctx getIotaList getIotaList action


index : Array Iota -> CastingContext -> ActionResult
index stack ctx =
    let
        action iota1 iota2 _ =
            ( case ( iota1, iota2 ) of
                ( IotaList list1, Number number ) ->
                    Maybe.withDefault Null (Array.get (round number) list1)
                        |> Array.repeat 1

                _ ->
                    Garbage CatastrophicFailure
                        |> Array.repeat 1
            , ctx
            )
    in
    action2Inputs stack ctx getIotaList getNumber action


listSize : Array Iota -> CastingContext -> ActionResult
listSize stack ctx =
    let
        action iota _ =
            ( case iota of
                IotaList list ->
                    Number (toFloat (Array.length list))
                        |> Array.repeat 1

                _ ->
                    Garbage CatastrophicFailure
                        |> Array.repeat 1
            , ctx
            )
    in
    action1Input stack ctx getIotaList action


reverseList : Array Iota -> CastingContext -> ActionResult
reverseList stack ctx =
    let
        action iota _ =
            ( case iota of
                IotaList list ->
                    IotaList (Array.reverse list)
                        |> Array.repeat 1

                _ ->
                    Garbage CatastrophicFailure
                        |> Array.repeat 1
            , ctx
            )
    in
    action1Input stack ctx getIotaList action


lastNList : Array Iota -> CastingContext -> ActionResult
lastNList stack ctx =
    let
        maybeIota =
            Array.get 0 stack

        newStack =
            Array.slice 1 (Array.length stack) stack
    in
    case maybeIota of
        Nothing ->
            { stack = Array.append (Array.fromList [ Garbage NotEnoughIotas ]) newStack, ctx = ctx, success = False }

        Just iota ->
            case getInteger <| iota of
                Nothing ->
                    { stack = unshift (Garbage IncorrectIota) newStack, ctx = ctx, success = False }

                _ ->
                    case iota of
                        Number number ->
                            let
                                newNewStack =
                                    removeFromArray 0 (round number) newStack

                                selectedIotas =
                                    Array.reverse <| Array.slice 0 (round number) newStack
                            in
                            if round number > Array.length newStack then
                                { stack = unshift (Garbage NotEnoughIotas) newStack, ctx = ctx, success = False }

                            else
                                { stack = unshift (IotaList selectedIotas) newNewStack, ctx = ctx, success = True }

                        _ ->
                            { stack = Array.fromList [ Garbage CatastrophicFailure ], ctx = ctx, success = False }


splat : Array Iota -> CastingContext -> ActionResult
splat stack ctx =
    let
        action iota _ =
            ( case iota of
                IotaList list ->
                    Array.reverse list

                _ ->
                    Garbage CatastrophicFailure
                        |> Array.repeat 1
            , ctx
            )
    in
    action1Input stack ctx getIotaList action


indexOf : Array Iota -> CastingContext -> ActionResult
indexOf stack ctx =
    let
        action iota1 iota2 _ =
            ( case iota1 of
                IotaList list ->
                    List.filter (\elm -> checkEquality (Tuple.second elm) iota2) (Array.toIndexedList list)
                        |> List.head
                        |> Maybe.withDefault ( -1, Null )
                        |> Tuple.first
                        |> toFloat
                        |> Number
                        |> Array.repeat 1

                _ ->
                    Garbage CatastrophicFailure
                        |> Array.repeat 1
            , ctx
            )
    in
    action2Inputs stack ctx getIotaList getAny action


listRemove : Array Iota -> CastingContext -> ActionResult
listRemove stack ctx =
    let
        action iota1 iota2 _ =
            ( case ( iota1, iota2 ) of
                ( IotaList list1, Number number ) ->
                    IotaList (Array.removeAt (round number) list1)
                        |> Array.repeat 1

                _ ->
                    Garbage CatastrophicFailure
                        |> Array.repeat 1
            , ctx
            )
    in
    action2Inputs stack ctx getIotaList getInteger action


slice : Array Iota -> CastingContext -> ActionResult
slice stack ctx =
    let
        action iota1 iota2 iota3 _ =
            ( case ( iota1, iota2, iota3 ) of
                ( IotaList list, Number number1, Number number2 ) ->
                    IotaList (Array.slice (round number1) (round number2) list)
                        |> Array.repeat 1

                _ ->
                    Garbage CatastrophicFailure
                        |> Array.repeat 1
            , ctx
            )
    in
    action3Inputs stack ctx getIotaList getPositiveInteger getPositiveInteger action


modifyinPlace : Array Iota -> CastingContext -> ActionResult
modifyinPlace stack ctx =
    let
        action iota1 iota2 iota3 _ =
            ( case ( iota1, iota2 ) of
                ( IotaList list, Number number ) ->
                    IotaList (Array.set (round number) (iota3) list)
                        |> Array.repeat 1

                _ ->
                    Garbage CatastrophicFailure
                        |> Array.repeat 1
            , ctx
            )
    in
    action3Inputs stack ctx getIotaList getPositiveInteger getAny action


construct : Array Iota -> CastingContext -> ActionResult
construct stack ctx =
    let
        action listIota iota _ =
            ( case listIota of
                IotaList list ->
                    IotaList (unshift iota list)
                        |> Array.repeat 1

                _ ->
                    Garbage CatastrophicFailure
                        |> Array.repeat 1
            , ctx
            )
    in
    action2Inputs stack ctx getIotaList getAny action


deconstruct : Array Iota -> CastingContext -> ActionResult
deconstruct stack ctx =
    let
        action iota _ =
            ( case iota of
                IotaList list ->
                    [ Maybe.withDefault Null (Array.get 0 list)
                    , IotaList (Array.removeAt 0 list)
                    ]
                        |> Array.fromList

                _ ->
                    Garbage CatastrophicFailure
                        |> Array.repeat 1
            , ctx
            )
    in
    action1Input stack ctx getIotaList action
