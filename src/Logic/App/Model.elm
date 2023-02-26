module Logic.App.Model exposing (..)

import Array exposing (Array)
import Logic.App.Types exposing (CastingContext, GridPoint, HeldItem, Iota, Panel, PatternType)


type alias Model =
    { stack : Array Iota
    , patternArray : Array ( PatternType, List GridPoint )
    , ui :
        { openPanels : List Panel
        , patternInputField : String
        , selectedInputID : String
        , suggestionIndex : Int
        , patternInputLocation : ( Int, Int )
        , mouseOverElementIndex : Int
        , dragging : ( Bool, Int )
        , overDragHandle : Bool
        , patternElementMiddleLocations : List Float
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
    , settings :
        { gridScale : Float }
    , castingContext : CastingContext
    , time : Int
    }
