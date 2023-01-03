module Logic.App.PatternList.PatternArray exposing (addToPatternArray, getPatternFromSignature)

import Array exposing (Array)
import Logic.App.Model exposing (Model)
import Logic.App.Patterns.PatternRegistry exposing (..)
import Logic.App.Types exposing (GridPoint, PatternType)
import Logic.App.Utils.GetAngleSignature exposing (getAngleSignature)


getPatternFromSignature : String -> PatternType
getPatternFromSignature signature =
    Maybe.withDefault {unknownPattern | signature = signature} <| List.head <| List.filter (\regPattern -> regPattern.signature == signature) patternRegistry


addToPatternArray : Model -> PatternType -> Array (PatternType, List GridPoint)
addToPatternArray model pattern =
    let
        patternList =
            model.patternArray

        drawing =
            model.grid.drawing

        patternDrawingPair =
            (pattern, drawing.activePath)
    in
    Array.append (Array.fromList [ patternDrawingPair ]) patternList

