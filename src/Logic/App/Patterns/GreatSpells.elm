module Logic.App.Patterns.GreatSpells exposing (..)

import Array exposing (Array)
import Logic.App.Patterns.OperatorUtils exposing (getEntity, getVector, spell1Input, spell2Inputs)
import Logic.App.Types exposing (ActionResult, CastingContext, Iota)


createLava : Array Iota -> CastingContext -> ActionResult
createLava stack ctx =
    spell1Input stack ctx getVector


lightning : Array Iota -> CastingContext -> ActionResult
lightning stack ctx =
    spell1Input stack ctx getVector


teleport : Array Iota -> CastingContext -> ActionResult
teleport stack ctx =
    spell2Inputs stack ctx getEntity getVector


craftPhial : Array Iota -> CastingContext -> ActionResult
craftPhial stack ctx =
    spell1Input stack ctx getEntity


brainsweep : Array Iota -> CastingContext -> ActionResult
brainsweep stack ctx =
    spell2Inputs stack ctx getEntity getVector
