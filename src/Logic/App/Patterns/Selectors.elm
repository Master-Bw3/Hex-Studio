module Logic.App.Patterns.Selectors exposing (..)

import Array exposing (Array)
import Logic.App.Patterns.OperatorUtils exposing (actionNoInput, getVector, spell1Input)
import Logic.App.Types exposing (ActionResult, CastingContext, Iota(..))
import Logic.App.Patterns.OperatorUtils exposing (getNumber)
import Logic.App.Patterns.OperatorUtils exposing (spell2Inputs)


getCaster : Array Iota -> CastingContext -> ActionResult
getCaster stack ctx =
    let
        action _ =
            ( Entity "Player"
                |> Array.repeat 1
            , ctx
            )
    in
    actionNoInput stack ctx action


getEntity : Array Iota -> CastingContext -> ActionResult
getEntity stack ctx =
    spell1Input stack ctx getVector


zoneEntity : Array Iota -> CastingContext -> ActionResult
zoneEntity stack ctx =
    spell2Inputs stack ctx getVector getNumber
