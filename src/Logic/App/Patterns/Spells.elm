module Logic.App.Patterns.Spells exposing (..)

import Array exposing (Array)
import Logic.App.Patterns.OperatorUtils exposing (actionNoInput, getEntity, getNumber, getPatternList, getVector, spell1Input, spell2Inputs, spell3Inputs, spellNoInput)
import Logic.App.Types exposing (Iota(..))
import Logic.App.Patterns.OperatorUtils exposing (action1Input)
import Logic.App.Types exposing (CastingContext)
import Logic.App.Types exposing (ActionResult)


explode : Array Iota -> CastingContext -> ActionResult
explode stack ctx =
    spell2Inputs stack ctx getVector getNumber


explodeFire  : Array Iota -> CastingContext -> ActionResult
explodeFire stack ctx =
    spell2Inputs stack ctx getVector getNumber


addMotion  : Array Iota -> CastingContext -> ActionResult
addMotion stack ctx =
    spell2Inputs stack ctx getEntity getVector


blink  : Array Iota -> CastingContext -> ActionResult
blink stack ctx =
    spell2Inputs stack ctx getEntity getNumber


breakBlock  : Array Iota -> CastingContext -> ActionResult
breakBlock stack ctx =
    spell1Input stack ctx getVector


placeBlock  : Array Iota -> CastingContext -> ActionResult
placeBlock stack ctx =
    spell1Input stack ctx getVector


colorize  : Array Iota -> CastingContext -> ActionResult
colorize stack ctx =
    spellNoInput stack ctx


createWater  : Array Iota -> CastingContext -> ActionResult
createWater stack ctx =
    spell1Input stack ctx getVector


destroyWater  : Array Iota -> CastingContext -> ActionResult
destroyWater stack ctx =
    spell1Input stack ctx getVector


ignite  : Array Iota -> CastingContext -> ActionResult
ignite stack ctx =
    spell1Input stack ctx getVector


extinguish  : Array Iota -> CastingContext -> ActionResult
extinguish stack ctx =
    spell1Input stack ctx getVector


conjureBlock  : Array Iota -> CastingContext -> ActionResult
conjureBlock stack ctx =
    spell1Input stack ctx getVector


conjureLight  : Array Iota -> CastingContext -> ActionResult
conjureLight stack ctx =
    spell1Input stack ctx getVector


bonemeal  : Array Iota -> CastingContext -> ActionResult
bonemeal stack ctx =
    spell1Input stack ctx getVector


recharge  : Array Iota -> CastingContext -> ActionResult
recharge stack ctx =
    spell1Input stack ctx getEntity


erase  : Array Iota -> CastingContext -> ActionResult
erase stack ctx =
    spellNoInput stack ctx


edify  : Array Iota -> CastingContext -> ActionResult
edify stack ctx =
    spell1Input stack ctx getVector


beep  : Array Iota -> CastingContext -> ActionResult
beep stack ctx =
    spell3Inputs stack ctx getVector getNumber getNumber


craftArtifact  : Array Iota -> CastingContext -> ActionResult
craftArtifact stack ctx =
    spell2Inputs stack ctx getEntity getPatternList


potion  : Array Iota -> CastingContext -> ActionResult
potion stack ctx =
    spell3Inputs stack ctx getEntity getNumber getNumber


potionFixedPotency  : Array Iota -> CastingContext -> ActionResult
potionFixedPotency stack ctx =
    spell2Inputs stack ctx getEntity getNumber


sentinelCreate  : Array Iota -> CastingContext -> ActionResult
sentinelCreate stack ctx =
    spell1Input stack ctx getVector


sentinelDestroy  : Array Iota -> CastingContext -> ActionResult
sentinelDestroy stack ctx =
    spellNoInput stack ctx


sentinelGetPos  : Array Iota -> CastingContext -> ActionResult
sentinelGetPos stack ctx =
    actionNoInput stack ctx (\_ -> (Array.fromList [ Vector ( 0, 0, 0 ) ], ctx))


sentinelWayfind  : Array Iota -> CastingContext -> ActionResult
sentinelWayfind stack ctx =
    action1Input stack ctx getVector (\_ _ -> ((Array.fromList [ Vector ( 0, 0, 0 ) ]), ctx))
