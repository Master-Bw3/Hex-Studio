module Logic.App.PatternList.PatternArray exposing (addToPatternArray, getPatternFromSignature)

import Array exposing (Array)
import Logic.App.Model exposing (Model)
import Logic.App.Patterns.PatternRegistry exposing (..)
import Logic.App.Types exposing (GridPoint, PatternType)
import Logic.App.Utils.GetAngleSignature exposing (getAngleSignature)


getPatternFromSignature : String -> PatternType
getPatternFromSignature signature =
    case List.head <| List.filter (\regPattern -> regPattern.signature == signature) patternRegistry of
        Just a ->
            a

        Nothing ->
            if String.startsWith "aqaa" signature then
                numberLiteralGenerator signature False

            else if String.startsWith "dedd" signature then
                numberLiteralGenerator signature True

            else
                { unknownPattern | signature = signature }


addToPatternArray : Model -> PatternType -> Array ( PatternType, List GridPoint )
addToPatternArray model pattern =
    let
        patternList =
            model.patternArray

        drawing =
            model.grid.drawing

        patternDrawingPair =
            ( pattern, drawing.activePath )
    in
    Array.append (Array.fromList [ patternDrawingPair ]) patternList
