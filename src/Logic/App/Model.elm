module Logic.App.Model exposing (..)

import Array exposing (Array)
import Logic.App.Types exposing (CastingContext, GridPoint, HeldItem, Iota, Panel, Pattern)
import Logic.App.Types exposing (Grid)
import Logic.App.Msg exposing (Msg)
import Logic.App.Types exposing (Overlay)
import Logic.App.Types exposing (Timeline)
import Keyboard.Event exposing (KeyboardEvent)
import Dict exposing (Dict)
import Logic.App.Types exposing (Direction)


type alias Model =
    { stack : Array Iota
    , patternArray : Array ( Pattern, List GridPoint )
    , savedIotas : Dict String (String, Direction, Iota)
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
        , importInput : String
        , openOverlay : Overlay
        }
    , grid : Grid
        
    , mousePos : ( Float, Float )
    , window :
        { width : Float
        , height : Float
        }
    , settings :
        { gridScale : Float }
    , castingContext : CastingContext
    , time : Int
    , downloadSrc : String
    , insertionPoint : Int
    , importQueue : List (Pattern, Cmd Msg)
    , timeline : Timeline
    , timelineIndex : Int
    , lastEvent : Maybe KeyboardEvent
    }
