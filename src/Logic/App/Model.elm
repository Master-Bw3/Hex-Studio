module Logic.App.Model exposing (..)

import Array exposing (Array)
import Keyboard.Event exposing (KeyboardEvent)
import Logic.App.Msg exposing (Msg)
import Logic.App.Types exposing (CastingContext, Grid, GridPoint, Iota, Overlay, Panel, Pattern, Timeline)
import ContextMenu exposing (ContextMenu)
import Logic.App.Types exposing (ContextMenuContext)


type alias Model =
    { stack : Array Iota
    , patternArray : Array ( Pattern, List GridPoint )
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
        , entityInputField : String
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
    , importQueue : List ( Pattern, Cmd Msg )
    , timeline : Timeline
    , timelineIndex : Int
    , projectName : String
    , lastEvent : Maybe KeyboardEvent
    , contextMenu : ContextMenu ContextMenuContext
    , config : ContextMenu.Config
    , message : String
    }
