module Logic.App.Patterns.Spells exposing (..)

import Array exposing (Array)
import Logic.App.Patterns.OperatorUtils exposing (actionNoInput, getEntity, getNumber, getPatternList, getVector, spell1Input, spell2Inputs, spell3Inputs, spellNoInput)
import Logic.App.Types exposing (Iota(..))
import Logic.App.Patterns.OperatorUtils exposing (action1Input)


explode : Array Iota -> ( Array Iota, Bool )
explode stack =
    spell2Inputs stack getVector getNumber


explodeFire : Array Iota -> ( Array Iota, Bool )
explodeFire stack =
    spell2Inputs stack getVector getNumber


addMotion : Array Iota -> ( Array Iota, Bool )
addMotion stack =
    spell2Inputs stack getEntity getVector


blink : Array Iota -> ( Array Iota, Bool )
blink stack =
    spell2Inputs stack getEntity getNumber


breakBlock : Array Iota -> ( Array Iota, Bool )
breakBlock stack =
    spell1Input stack getVector


placeBlock : Array Iota -> ( Array Iota, Bool )
placeBlock stack =
    spell1Input stack getVector


colorize : Array Iota -> ( Array Iota, Bool )
colorize stack =
    spellNoInput stack


createWater : Array Iota -> ( Array Iota, Bool )
createWater stack =
    spell1Input stack getVector


destroyWater : Array Iota -> ( Array Iota, Bool )
destroyWater stack =
    spell1Input stack getVector


ignite : Array Iota -> ( Array Iota, Bool )
ignite stack =
    spell1Input stack getVector


extinguish : Array Iota -> ( Array Iota, Bool )
extinguish stack =
    spell1Input stack getVector


conjureBlock : Array Iota -> ( Array Iota, Bool )
conjureBlock stack =
    spell1Input stack getVector


conjureLight : Array Iota -> ( Array Iota, Bool )
conjureLight stack =
    spell1Input stack getVector


bonemeal : Array Iota -> ( Array Iota, Bool )
bonemeal stack =
    spell1Input stack getVector


recharge : Array Iota -> ( Array Iota, Bool )
recharge stack =
    spell1Input stack getEntity


erase : Array Iota -> ( Array Iota, Bool )
erase stack =
    spellNoInput stack


edify : Array Iota -> ( Array Iota, Bool )
edify stack =
    spell1Input stack getVector


beep : Array Iota -> ( Array Iota, Bool )
beep stack =
    spell3Inputs stack getVector getNumber getNumber


craftArtifact : Array Iota -> ( Array Iota, Bool )
craftArtifact stack =
    spell2Inputs stack getEntity getPatternList


potion : Array Iota -> ( Array Iota, Bool )
potion stack =
    spell3Inputs stack getEntity getNumber getNumber


potionFixedPotency : Array Iota -> ( Array Iota, Bool )
potionFixedPotency stack =
    spell2Inputs stack getEntity getNumber


sentinelCreate : Array Iota -> ( Array Iota, Bool )
sentinelCreate stack =
    spell1Input stack getVector


sentinelDestroy : Array Iota -> ( Array Iota, Bool )
sentinelDestroy stack =
    spellNoInput stack


sentinelGetPos : Array Iota -> ( Array Iota, Bool )
sentinelGetPos stack =
    actionNoInput stack (Array.fromList [ Vector ( 0, 0, 0 ) ])


sentinelWayfind : Array Iota -> ( Array Iota, Bool )
sentinelWayfind stack =
    action1Input stack getVector (\_ -> (Array.fromList [ Vector ( 0, 0, 0 ) ]))
