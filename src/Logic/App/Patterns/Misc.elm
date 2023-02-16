module Logic.App.Patterns.Misc exposing (..)

import Array exposing (Array)
import Logic.App.Patterns.OperatorUtils exposing (action1Input, action2Inputs, getEntity, getVector)
import Logic.App.Types exposing (EntityType(..), Iota(..))
import Logic.App.Utils.Utils exposing (unshift)


numberLiteral : Float -> Array Iota -> ( Array Iota, Bool )
numberLiteral number stack =
    (unshift (Number number) stack, True)


entityPos : Array Iota -> ( Array Iota, Bool )
entityPos stack =
    let
        action _ =
            Vector ( 0.0, 0.0, 0.0 )
                |> Array.repeat 1
    in
    action1Input stack getEntity action


raycast : Array Iota -> ( Array Iota, Bool )
raycast stack =
    let
        action _ _ =
            Vector ( 0.0, 0.0, 0.0 )
                |> Array.repeat 1
    in
    action2Inputs stack getVector getVector action


raycastAxis : Array Iota -> ( Array Iota, Bool )
raycastAxis stack =
    let
        action _ _ =
            Vector ( 0.0, 0.0, 0.0 )
                |> Array.repeat 1
    in
    action2Inputs stack getVector getVector action


raycastEntity : Array Iota -> ( Array Iota, Bool )
raycastEntity stack =
    let
        action _ _ =
            Entity Chicken
                |> Array.repeat 1
    in
    action2Inputs stack getVector getVector action


getEntityLook : Array Iota -> ( Array Iota, Bool )
getEntityLook stack =
    let
        action _ =
            Vector ( 0.0, 0.0, 0.0 )
                |> Array.repeat 1
    in
    action1Input stack getEntity action


getEntityHeight : Array Iota -> ( Array Iota, Bool )
getEntityHeight stack =
    let
        action _ =
            Number 0
                |> Array.repeat 1
    in
    action1Input stack getEntity action


getEntityVelocity : Array Iota -> ( Array Iota, Bool )
getEntityVelocity stack =
    let
        action _ =
            Vector ( 0.0, 0.0, 0.0 )
                |> Array.repeat 1
    in
    action1Input stack getEntity action
