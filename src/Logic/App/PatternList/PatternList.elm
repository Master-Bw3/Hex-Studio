module Logic.App.PatternList.PatternList exposing (addToPatternList, getPatternFromSignature)

import Array exposing (Array)
import Logic.App.Model exposing (Model)
import Logic.App.Patterns.PatternRegistry exposing (..)
import Logic.App.Types exposing (GridPoint, PatternType)
import Logic.App.Utils.GetAngleSignature exposing (getAngleSignature)


getPatternFromSignature : String -> PatternType
getPatternFromSignature signature =
    Maybe.withDefault {unkownPattern | signature = signature} <| List.head <| List.filter (\regPattern -> regPattern.signature == signature) patternRegistry


addToPatternList : Model -> PatternType -> Array { pattern : PatternType, drawing : List GridPoint }
addToPatternList model pattern =
    let
        patternList =
            model.patternList

        drawing =
            model.grid.drawing

        patternDrawingPair =
            { pattern = pattern, drawing = drawing.activePath }
    in
    Array.append (Array.fromList [ patternDrawingPair ]) patternList
