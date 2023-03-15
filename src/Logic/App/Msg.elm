module Logic.App.Msg exposing (..)
import Logic.App.Types exposing (Panel)
import Html.Events.Extra.Mouse exposing (Keys)
import Browser.Dom
import Time
import Json.Decode
import Logic.App.Types exposing (ElementLocation)
import Html.Events.Extra.Drag as Drag
import Json.Decode exposing (Value)
import Logic.App.Types exposing (Pattern)
import Logic.App.Types exposing (Overlay)

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
    | RecieveMouseOverHandle Bool
    | ChangeHeldItem String
    | RequestGridDrawingAsGIF
    | RecieveGridDrawingAsGIF String
    | RequestGridDrawingAsImage
    | RecieveGridDrawingAsImage String
    | UpdatePatternOuptut Int Pattern
    | SetInsertionPoint Int Keys
    | SetImportInputValue String
    | ImportText String
    | ViewOverlay Overlay
    | Download String

type alias MouseMoveData =
    { pageX : Int
    , pageY : Int
    , offsetHeight : Float
    , offsetWidth : Float
    }