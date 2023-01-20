module Logic.App.Patterns.Lists exposing (..)

import Array exposing (Array)
import Logic.App.Patterns.OperatorUtils exposing (action1Input, action2Inputs, getAny, getIotaList)
import Logic.App.Types exposing (Iota(..), Mishap(..))
import Logic.App.Utils.Utils exposing (unshift)


singleton : Array Iota -> Array Iota
singleton stack =
    let
        action iota =
            IotaList (Array.repeat 1 iota)
                |> Array.repeat 1
    in
    action1Input stack getAny action


append : Array Iota -> Array Iota
append stack =
    let
        action listIota iota =
            case listIota of
                IotaList list ->
                    IotaList (unshift iota list)
                        |> Array.repeat 1

                _ ->
                    Garbage CatastrophicFailure
                        |> Array.repeat 1
    in
    action2Inputs stack getIotaList getAny action
