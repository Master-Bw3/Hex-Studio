module Logic.App.PatternList exposing (updatePatternList)

import Array exposing (Array)
import Logic.App.Model exposing (Model)
import Logic.App.PatternRegistry exposing (..)
import Logic.App.Types exposing (GridPoint, PatternType)
import Logic.App.Utils.GetAngleSignature exposing (getAngleSignature)

updatePatternList : Model -> Array { pattern : PatternType, drawing : List GridPoint }
updatePatternList model =
    let
        drawing =
            model.grid.drawing
        patternList =
            model.patternList
        signature = getAngleSignature drawing.activePath
        pattern =
            Maybe.withDefault tempPattern <| List.head <| List.filter (\regPattern -> regPattern.signature == signature) patternRegistry
    in
    Array.append (Array.fromList [ { pattern = pattern, drawing = drawing.activePath } ]) patternList
