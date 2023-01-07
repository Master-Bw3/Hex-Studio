module Logic.App.Patterns.Stack exposing (..)

import Array exposing (Array)
import Html.Attributes exposing (action)
import Logic.App.Patterns.OperatorUtils exposing (action1Input, action2Inputs, action3Inputs, getAny)
import Logic.App.Types exposing (Iota(..))
import Logic.App.Utils.Utils exposing (unshift)


swap : Array Iota -> Array Iota
swap stack =
    let
        action iota1 iota2 =
            Array.fromList [ iota2, iota1 ]
    in
    action2Inputs stack getAny getAny action


rotate : Array Iota -> Array Iota
rotate stack =
    let
        action iota1 iota2 iota3 =
            Array.fromList [ iota3, iota1, iota2 ]
    in
    action3Inputs stack getAny getAny getAny action


rotateReverse : Array Iota -> Array Iota
rotateReverse stack =
    let
        action iota1 iota2 iota3 =
            Array.fromList [ iota2, iota3, iota1 ]
    in
    action3Inputs stack getAny getAny getAny action


duplicate : Array Iota -> Array Iota
duplicate stack =
    let
        action iota1 =
            Array.fromList [ iota1, iota1 ]
    in
    action1Input stack getAny action


over : Array Iota -> Array Iota
over stack =
    let
        action iota1 iota2 =
            Array.fromList [ iota2, iota1, iota2 ]
    in
    action2Inputs stack getAny getAny action


tuck : Array Iota -> Array Iota
tuck stack =
    let
        action iota1 iota2 =
            Array.fromList [ iota1, iota2, iota1 ]
    in
    action2Inputs stack getAny getAny action


dup2 : Array Iota -> Array Iota
dup2 stack =
    let
        action iota1 iota2 =
            Array.fromList [ iota1, iota2, iota1, iota2 ]
    in
    action2Inputs stack getAny getAny action
