module Logic.App.Patterns.Misc exposing (..)

import Array exposing (Array)
import Array.Extra as Array
import Html.Attributes exposing (action)
import Logic.App.Patterns.OperatorUtils exposing (action1Input, getAny, getEntity, getVector, spell1Input, spell2Inputs)
import Logic.App.Types exposing (ActionResult, CastingContext, EntityType(..), Iota(..), Mishap(..))
import Logic.App.Utils.Utils exposing (isJust, unshift)


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


mask : List String -> Array Iota -> CastingContext -> ActionResult
mask maskCode stack ctx =
    let
        action code iota =
            case code of
                "v" ->
                    Nothing

                _ ->
                    Just iota
    in
    if Array.length stack >= List.length maskCode then
        let
            newStack =
                Array.append
                    (Array.map2 action (Array.fromList (List.reverse maskCode)) stack
                        |> Array.filter (\x -> isJust x)
                        |> Array.map (\x -> Maybe.withDefault (Garbage CatastrophicFailure) x)
                    )
                    (Array.slice (List.length maskCode) (Array.length stack) stack)
        in
        { stack = newStack
        , ctx = ctx
        , success = True
        }

    else
        { stack = Array.append stack <| Array.repeat (List.length maskCode - Array.length stack) (Garbage NotEnoughIotas)
        , ctx = ctx
        , success = False
        }
