module Logic.App.Patterns.Selectors exposing (..)
import Logic.App.Types exposing (Iota(..))
import Array exposing (Array)
import Logic.App.Types exposing (EntityType(..))
import Logic.App.Utils.Utils exposing (unshift)


getCaster: Array (Iota) -> Array (Iota)
getCaster stack =
        unshift (Entity Player) stack 