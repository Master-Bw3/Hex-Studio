module Logic.App.Patterns.Stack exposing (..)
import Array
import Logic.App.Patterns.OperatorUtils exposing (action2Inputs, action3Inputs)
import Array exposing (Array)
import Logic.App.Patterns.OperatorUtils exposing (getAny)
import Logic.App.Types exposing (Iota(..))
swap : Array Iota -> Array Iota
swap stack =
    let
        action iota1 iota2 =
            Array.fromList [iota2, iota1]
    in
    action2Inputs stack getAny getAny action


rotate : Array Iota -> Array Iota
rotate stack =
    let
        action iota1 iota2 iota3 =
            Array.fromList [iota3, iota1, iota2]
    in
    action3Inputs stack getAny getAny getAny action