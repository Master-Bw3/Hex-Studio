module Logic.App.Msg exposing (..)
import Logic.App.Types exposing (Panel)
import Html.Events.Extra.Mouse exposing (Keys)
import Browser.Dom

type Msg
    = ViewPanel Panel Keys
    | GotGrid (Result Browser.Dom.Error Browser.Dom.Element)