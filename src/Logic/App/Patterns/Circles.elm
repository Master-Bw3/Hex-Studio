module Logic.App.Patterns.Circles exposing (..)

import Array exposing (Array)
import Logic.App.Patterns.OperatorUtils exposing (actionNoInput)
import Logic.App.Types exposing (Iota(..))


circleImpetusDirection : Array Iota -> ( Array Iota, Bool )
circleImpetusDirection stack =
    let
        action =
            Vector ( 1.0, 0.0, 0.0 )
                |> Array.repeat 1
    in
    actionNoInput stack action


circleBoundsMin : Array Iota -> ( Array Iota, Bool )
circleBoundsMin stack =
    let
        action =
            Vector ( 0.0, 0.0, 0.0 )
                |> Array.repeat 1
    in
    actionNoInput stack action


circleBoundsMax : Array Iota -> ( Array Iota, Bool )
circleBoundsMax stack =
    let
        action =
            Vector ( 0.0, 0.0, 0.0 )
                |> Array.repeat 1
    in
    actionNoInput stack action
