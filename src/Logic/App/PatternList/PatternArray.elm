module Logic.App.PatternList.PatternArray exposing (addToPatternArray, applyColorToPatternFromResult, updateDrawingColors)

import Array exposing (Array)
import Array.Extra as Array
import Dict exposing (Dict)
import Html.Attributes exposing (name)
import Logic.App.Model exposing (Model)
import Logic.App.Patterns.PatternRegistry exposing (getPatternFromName, getPatternFromSignature)
import Logic.App.Types exposing (ApplyToStackResult(..), Direction, GridPoint, Iota, Pattern)
import Ports.HexNumGen as HexNumGen
import Settings.Theme exposing (accent1, accent4, accent5)


addToPatternArray : Model -> Pattern -> Int -> Array ( Pattern, List GridPoint )
addToPatternArray model pattern index =
    let
        patternArray =
            model.patternArray

        drawing =
            model.grid.drawing

        patternDrawingPair =
            ( pattern, drawing.activePath )
    in
    Array.insertAt index (updateDrawingColors patternDrawingPair) patternArray


updateDrawingColors : ( Pattern, List GridPoint ) -> ( Pattern, List GridPoint )
updateDrawingColors patternTuple =
    ( Tuple.first patternTuple
    , List.map
        (\pnt ->
            { pnt
                | connectedPoints =
                    List.map
                        (\conPnt ->
                            { conPnt
                                | color =
                                    if (Tuple.first patternTuple).active == False then
                                        "grey"

                                    else
                                        (Tuple.first patternTuple).color
                            }
                        )
                        pnt.connectedPoints
            }
        )
        (Tuple.second patternTuple)
    )


applyColorToPatternFromResult : Pattern -> ApplyToStackResult -> Pattern
applyColorToPatternFromResult pattern result =
    case result of
        Succeeded ->
            { pattern | color = accent1 }

        Failed ->
            { pattern | color = accent4 }

        Considered ->
            { pattern | color = accent5 }
