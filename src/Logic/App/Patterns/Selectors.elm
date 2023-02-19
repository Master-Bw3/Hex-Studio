module Logic.App.Patterns.Selectors exposing (..)

import Array exposing (Array)
import Logic.App.Patterns.OperatorUtils exposing (actionNoInput)
import Logic.App.Types exposing (EntityType(..), Iota(..))


getCaster : Array Iota -> ( Array Iota, Bool )
getCaster stack =
    let
        action =
            Entity Player
                |> Array.repeat 1
    in
    actionNoInput stack action
