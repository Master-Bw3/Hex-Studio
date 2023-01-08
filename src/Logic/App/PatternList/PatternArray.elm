module Logic.App.PatternList.PatternArray exposing (addToPatternArray, updateDrawingColors)

import Array exposing (Array)
import Html.Attributes exposing (name)
import Logic.App.Model exposing (Model)
import Logic.App.Types exposing (GridPoint, PatternType)
import Ports.HexNumGen as HexNumGen


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
    Array.append (Array.fromList [ updateDrawingColors patternDrawingPair ]) patternList


updateDrawingColors : ( PatternType, List GridPoint ) -> ( PatternType, List GridPoint )
updateDrawingColors patternTuple =
    ( Tuple.first patternTuple
    , List.map
        (\pnt ->
            { pnt
                | connectedPoints =
                    List.map (\conPnt -> { conPnt | color = (Tuple.first patternTuple).color })
                        pnt.connectedPoints
            }
        )
        (Tuple.second patternTuple)
    )
