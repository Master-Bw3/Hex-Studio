module Logic.App.Patterns.Circles exposing (..)

import Array exposing (Array)
import Logic.App.Patterns.OperatorUtils exposing (actionNoInput)
import Logic.App.Types exposing (Iota(..))


circleImpetusDirection : Array Iota -> Array Iota
circleImpetusDirection stack =
    let
        action =
            Array.fromList [ Vector ( 1.0, 0.0, 0.0 ) ]
    in
    actionNoInput stack action


circleBoundsMin : Array Iota -> Array Iota
circleBoundsMin stack =
    let
        action =
            Array.fromList [ Vector ( 0.0, 0.0, 0.0 ) ]
    in
    actionNoInput stack action


circleBoundsMax : Array Iota -> Array Iota
circleBoundsMax stack =
    let
        action =
            Array.fromList [ Vector ( 0.0, 0.0, 0.0 ) ]
    in
    actionNoInput stack action
