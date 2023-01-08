module Logic.App.Msg exposing (..)
import Logic.App.Types exposing (Panel)
import Html.Events.Extra.Mouse exposing (Keys)
import Browser.Dom
import Time

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
    | SelectNextSuggestion Int

type alias MouseMoveData =
    { pageX : Int
    , pageY : Int
    , offsetHeight : Float
    , offsetWidth : Float
    }