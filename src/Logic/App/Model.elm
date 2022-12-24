module Logic.App.Model exposing (..)

import Array exposing (Array)
import Logic.App.Types exposing (GridPoint, Panel, PatternType)


type alias Model =
    { stack : Array Int
    , patternList : Array { pattern : PatternType, drawing : List GridPoint }
    , ui :
        { openPanels : List Panel
        }
    , grid :
        { width : Float
        , height : Float
        , points : List (List GridPoint)
        , drawing :
            { drawingMode : Bool
            , activePath : List GridPoint
            }
        }
    , mousePos : ( Float, Float )
    , window :
        { width : Float
        , height : Float
        }
    }
