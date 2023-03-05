module Logic.App.Patterns.Selectors exposing (..)

import Array exposing (Array)
import Logic.App.Patterns.OperatorUtils exposing (actionNoInput)
import Logic.App.Types exposing (ActionResult, CastingContext, EntityType(..), Iota(..))
import Logic.App.Patterns.OperatorUtils exposing (spell1Input)
import Logic.App.Patterns.OperatorUtils exposing (getVector)


getCaster : Array Iota -> CastingContext -> ActionResult
getCaster stack ctx =
    let
        action _ =
            ( Entity Player
                |> Array.repeat 1
            , ctx
            )
    in
    actionNoInput stack ctx action


getEntity : Array Iota -> CastingContext -> ActionResult
getEntity stack ctx =
    spell1Input stack ctx getVector
