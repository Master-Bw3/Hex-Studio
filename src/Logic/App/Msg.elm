module Logic.App.Msg exposing (..)
import Logic.App.Types exposing (Panel)
import Html.Events.Extra.Mouse exposing (Keys)
import Browser.Dom


type Msg
    = ViewPanel Panel Keys
    | GotGrid (Result Browser.Dom.Error Browser.Dom.Element)
    | GotContent (Result Browser.Dom.Error Browser.Dom.Element)
    | MouseMove (Float, Float)
    | GridDown (Float, Float)
    | MouseUp
    | RemoveFromPatternArray Int Int
    | SetGridScale Float

type alias MouseMoveData =
    { pageX : Int
    , pageY : Int
    , offsetHeight : Float
    , offsetWidth : Float
    }