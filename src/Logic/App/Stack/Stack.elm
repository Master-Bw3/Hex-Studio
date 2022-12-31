module Logic.App.Stack.Stack exposing (..)

import Array exposing (Array)
import Logic.App.Types exposing (Iota, PatternType)


-- untested; might not work properly
applyPatternsToStack : Array Iota -> List PatternType -> Array Iota
applyPatternsToStack stack patterns =
    case List.head patterns of
        Nothing ->
            stack

        Just pattern ->
            applyPatternsToStack (applyPatternToStack stack pattern) <| Maybe.withDefault [] <| List.tail patterns


applyPatternToStack : Array Iota -> PatternType -> Array Iota
applyPatternToStack stack pattern =
    pattern.action stack
