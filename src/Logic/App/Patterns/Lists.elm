module Logic.App.Patterns.Lists exposing (..)

import Array exposing (Array)
import Logic.App.Patterns.OperatorUtils exposing (action1Input, action2Inputs, getAny, getIotaList, getNumber)
import Logic.App.Types exposing (ActionResult, CastingContext, Iota(..), Mishap(..))
import Logic.App.Utils.Utils exposing (unshift)


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
                    IotaList (Array.append list2 list1)
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
