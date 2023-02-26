module Logic.App.Patterns.ReadWrite exposing (..)

import Array exposing (Array)
import Logic.App.Patterns.OperatorUtils exposing (actionNoInput)
import Logic.App.Types exposing (EntityType(..), Iota(..))
import Logic.App.Types exposing (CastingContext)
import Logic.App.Types exposing (ActionResult)


read : Array Iota -> CastingContext -> ActionResult
read stack ctx =
    actionNoInput stack ctx (\_ -> ( Array.fromList [ Null ], ctx ))
