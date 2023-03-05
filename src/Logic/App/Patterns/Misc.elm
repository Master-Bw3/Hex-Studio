module Logic.App.Patterns.Misc exposing (..)

import Array exposing (Array)
import Logic.App.Patterns.OperatorUtils exposing (action1Input, action2Inputs, getEntity, getVector)
import Logic.App.Types exposing (ActionResult, CastingContext, EntityType(..), Iota(..))
import Logic.App.Utils.Utils exposing (unshift)
import Logic.App.Patterns.OperatorUtils exposing (getAny)


numberLiteral : Float -> Array Iota -> CastingContext -> ActionResult
numberLiteral number stack ctx =
    { stack = unshift (Number number) stack, ctx = ctx, success = True }


entityPos : Array Iota -> CastingContext -> ActionResult
entityPos stack ctx =
    let
        action _ _ =
            (Vector ( 0.0, 0.0, 0.0 )
                |> Array.repeat 1
                , ctx
            )
    in
    action1Input stack ctx getEntity action


raycast : Array Iota -> CastingContext -> ActionResult
raycast stack ctx =
    let
        action _ _ _ =
            (Vector ( 0.0, 0.0, 0.0 )
                |> Array.repeat 1
                , ctx
            )
    in
    action2Inputs stack ctx getVector getVector action


raycastAxis : Array Iota -> CastingContext -> ActionResult
raycastAxis stack ctx =
    let
        action _ _ _ =
            (Vector ( 0.0, 0.0, 0.0 )
                |> Array.repeat 1
                , ctx
            )
    in
    action2Inputs stack ctx getVector getVector action


raycastEntity : Array Iota -> CastingContext -> ActionResult
raycastEntity stack ctx =
    let
        action _ _ _ =
            ( Array.empty
            , ctx
            )
    in
    action2Inputs stack ctx getVector getVector action


getEntityLook : Array Iota -> CastingContext -> ActionResult
getEntityLook stack ctx =
    let
        action _ _  =
            (Vector ( 0.0, 0.0, 0.0 )
                |> Array.repeat 1
                , ctx
            )
    in
    action1Input stack ctx getEntity action


getEntityHeight : Array Iota -> CastingContext -> ActionResult
getEntityHeight stack ctx =
    let
        action _ _ =
            (Number 0
                |> Array.repeat 1
                , ctx
            )
    in
    action1Input stack ctx getEntity action


getEntityVelocity : Array Iota -> CastingContext -> ActionResult
getEntityVelocity stack ctx =
    let
        action _ _ =
            (Vector ( 0.0, 0.0, 0.0 )
                |> Array.repeat 1
                , ctx
            )
    in
    action1Input stack ctx getEntity action

print : Array Iota -> CastingContext -> ActionResult
print stack ctx =
    action1Input stack ctx getAny (\iota _ -> ( Array.fromList [ iota ], ctx ))