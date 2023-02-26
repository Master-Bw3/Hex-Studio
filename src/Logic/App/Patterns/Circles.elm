module Logic.App.Patterns.Circles exposing (..)

import Array exposing (Array)
import Logic.App.Patterns.OperatorUtils exposing (actionNoInput)
import Logic.App.Types exposing (ActionResult, CastingContext, Iota(..))


circleImpetusDirection : Array Iota -> CastingContext -> ActionResult
circleImpetusDirection stack ctx =
    let
        action _ =
            ( Vector ( 1.0, 0.0, 0.0 )
                |> Array.repeat 1
            , ctx
            )
    in
    actionNoInput stack ctx action


circleBoundsMin : Array Iota -> CastingContext -> ActionResult
circleBoundsMin stack ctx =
    let
        action _ =
            ( Vector ( 0.0, 0.0, 0.0 )
                |> Array.repeat 1
            , ctx
            )
    in
    actionNoInput stack ctx action


circleBoundsMax : Array Iota -> CastingContext -> ActionResult
circleBoundsMax stack ctx =
    let
        action _ =
            ( Vector ( 0.0, 0.0, 0.0 )
                |> Array.repeat 1
            , ctx
            )
    in
    actionNoInput stack ctx action
