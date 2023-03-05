module Logic.App.Patterns.Misc exposing (..)

import Array exposing (Array)
import Logic.App.Patterns.OperatorUtils exposing (action1Input, action2Inputs, getAny, getEntity, getVector, spell2Inputs)
import Logic.App.Types exposing (ActionResult, CastingContext, EntityType(..), Iota(..))
import Logic.App.Utils.Utils exposing (unshift)
import Logic.App.Patterns.OperatorUtils exposing (spell1Input)


numberLiteral : Float -> Array Iota -> CastingContext -> ActionResult
numberLiteral number stack ctx =
    { stack = unshift (Number number) stack, ctx = ctx, success = True }


entityPos : Array Iota -> CastingContext -> ActionResult
entityPos stack ctx =
    spell1Input stack ctx getEntity


raycast : Array Iota -> CastingContext -> ActionResult
raycast stack ctx =
    spell2Inputs stack ctx getVector getVector


raycastAxis : Array Iota -> CastingContext -> ActionResult
raycastAxis stack ctx =
    spell2Inputs stack ctx getVector getVector


raycastEntity : Array Iota -> CastingContext -> ActionResult
raycastEntity stack ctx =
    spell2Inputs stack ctx getVector getVector


getEntityLook : Array Iota -> CastingContext -> ActionResult
getEntityLook stack ctx =
    spell1Input stack ctx getEntity


getEntityHeight : Array Iota -> CastingContext -> ActionResult
getEntityHeight stack ctx =
    spell1Input stack ctx getEntity


getEntityVelocity : Array Iota -> CastingContext -> ActionResult
getEntityVelocity stack ctx =
    spell1Input stack ctx getEntity


print : Array Iota -> CastingContext -> ActionResult
print stack ctx =
    action1Input stack ctx getAny (\iota _ -> ( Array.fromList [ iota ], ctx ))
