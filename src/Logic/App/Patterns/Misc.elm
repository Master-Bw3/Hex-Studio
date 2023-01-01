module Logic.App.Patterns.Misc exposing (..)

import Array exposing (Array)
import Logic.App.Patterns.OperatorUtils exposing (action2Inputs, actionNoInput, get2Inputs, getNumberOrVector, getVector)
import Logic.App.Types exposing (Iota(..))
import Logic.App.Patterns.OperatorUtils exposing (action1Input)
import Logic.App.Patterns.OperatorUtils exposing (getEntity)


entityPos : Array Iota -> Array Iota
entityPos stack =
    let
        action _ =
            Array.fromList [ Vector ( 0.0, 0.0, 0.0 ) ]
    in
    action1Input stack getEntity action


raycast : Array Iota -> Array Iota
raycast stack =
    let
        action _ _ =
            Array.fromList [ Vector ( 0.0, 0.0, 0.0 ) ]
    in
    action2Inputs stack getVector getVector action
