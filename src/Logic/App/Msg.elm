module Logic.App.Msg exposing (..)
import Logic.App.Types exposing (Panel)
import Html.Events.Extra.Mouse exposing (Keys)
import Browser.Dom
import Time
import Json.Decode
import Logic.App.Types exposing (ElementLocation)
import Html.Events.Extra.Drag as Drag
import Json.Decode exposing (Value)

type Msg
    = NoOp
    | ViewPanel Panel Keys
    | GetGrid (Result Browser.Dom.Error Browser.Dom.Element)
    | GetContentSize (Result Browser.Dom.Error Browser.Dom.Element)
    | MouseMove (Float, Float)
    | GridDown (Float, Float)
    | MouseUp
    | RemoveFromPatternArray Int Int
    | SetGridScale Float
    | WindowResize
    | Tick Time.Posix
    | UpdatePatternInputField String
    | InputPattern String
    | SendNumberLiteralToGenerate Float
    | RecieveGeneratedNumberLiteral String
    | SelectPreviousSuggestion Int
    | SelectNextSuggestion Int
    | SelectFirstSuggestion
    | RequestInputBoundingBox String
    | RecieveInputBoundingBox (Result Json.Decode.Error ElementLocation)
    | RecieveInputBoundingBoxes (List (Result Json.Decode.Error ElementLocation))
    | DragStart Int Drag.EffectAllowed Value
    | DragEnd
    | DragOver Drag.DropEffect Value
    | Drag Drag.Event
    | Drop
    | SetFocus String

one = Html.Events.Extra.Mouse.onLeave

type alias MouseMoveData =
    { pageX : Int
    , pageY : Int
    , offsetHeight : Float
    , offsetWidth : Float
    }