module Logic.App.Patterns.ReadWrite exposing (..)

import Array exposing (Array)
import Logic.App.Patterns.OperatorUtils exposing (actionNoInput)
import Logic.App.Types exposing (EntityType(..), Iota(..))

read : Array Iota -> ( Array Iota, Bool )
read stack = actionNoInput stack (Array.fromList [ Null])