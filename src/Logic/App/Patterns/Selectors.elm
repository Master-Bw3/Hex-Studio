module Logic.App.Patterns.Selectors exposing (..)

import Array exposing (Array)
import Logic.App.Patterns.OperatorUtils exposing (actionNoInput)
import Logic.App.Types exposing (EntityType(..), Iota(..))
import Logic.App.Utils.Utils exposing (unshift)


getCaster : Array Iota -> Array Iota
getCaster stack =
    let
        action =
            Array.fromList [ Entity Player ]
    in
    actionNoInput stack action
