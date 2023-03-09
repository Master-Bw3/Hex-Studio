module Logic.App.Model exposing (..)

import Array exposing (Array)
import Logic.App.Types exposing (CastingContext, GridPoint, HeldItem, Iota, Panel, Pattern)
import Logic.App.Types exposing (Grid)


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
    , gridGifSrc : String
    , insertionPoint : Int
    }
