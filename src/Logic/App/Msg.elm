module Logic.App.Msg exposing (..)

import Browser.Dom
import ContextMenu
import File exposing (File)
import Html.Events.Extra.Drag as Drag
import Html.Events.Extra.Mouse exposing (Keys)
import Json.Decode exposing (Value)
import Keyboard.Event exposing (KeyboardEvent)
import Logic.App.Types exposing (ContextMenuContext, ElementLocation, Overlay, Panel, Pattern)
import Time


type Msg
    = NoOp
    | ViewPanel Panel Keys
    | GetGrid (Result Browser.Dom.Error Browser.Dom.Element)
    | GetContentSize (Result Browser.Dom.Error Browser.Dom.Element)
    | MouseMove ( Float, Float )
    | GridDown ( Float, Float )
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
    | SetInsertionPoint Int
    | SetImportInputValue String
    | ImportText String
    | SelectProjectFile
    | ImportProjectFile File
    | ImportProject String
    | ViewOverlay Overlay
    | Download String String
    | SetTimelineIndex Int
    | HandleKeyboardEvent KeyboardEvent
    | ChangeMacroName String String
    | ContextMenuMsg (ContextMenu.Msg ContextMenuContext)
    | ExpandMacro String Int


type alias MouseMoveData =
    { pageX : Int
    , pageY : Int
    , offsetHeight : Float
    , offsetWidth : Float
    }
