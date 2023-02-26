module Logic.App.Patterns.Selectors exposing (..)

import Array exposing (Array)
import Logic.App.Patterns.OperatorUtils exposing (actionNoInput)
import Logic.App.Types exposing (EntityType(..), Iota(..))
import Logic.App.Types exposing (CastingContext)
import Logic.App.Types exposing (ActionResult)


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
