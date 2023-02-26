module Logic.App.Patterns.Lists exposing (..)

import Array exposing (Array)
import Logic.App.Patterns.OperatorUtils exposing (action1Input, action2Inputs, getAny, getIotaList)
import Logic.App.Types exposing (Iota(..), Mishap(..))
import Logic.App.Utils.Utils exposing (unshift)
import Logic.App.Types exposing (CastingContext)
import Logic.App.Types exposing (ActionResult)


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
                    IotaList (unshift iota list)
                        |> Array.repeat 1

                _ ->
                    Garbage CatastrophicFailure
                        |> Array.repeat 1
            , ctx
            )
    in
    action2Inputs stack ctx getIotaList getAny action
