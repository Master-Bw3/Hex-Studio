module Components.App.Content exposing (content)

import Components.App.LeftBox exposing (leftBox)
import Components.App.PatternAutoComplete exposing (patternInputAutoComplete)
import Components.App.Right exposing (right)
import Html exposing (..)
import Html.Attributes exposing (id)
import Html.Events exposing (onMouseUp)
import Html.Events.Extra.Mouse as MouseEvent
import Html.Events.Extra.Touch as TouchEvent
import Logic.App.Model exposing (Model)
import Logic.App.Msg exposing (Msg(..))
import Logic.App.Utils.Utils exposing (touchCoordinates)


content : Model -> Html Msg
content model =
    div
        [ id "content"
        , MouseEvent.onWithOptions "mousemove" { stopPropagation = False, preventDefault = False } (.clientPos >> MouseMove)
        , TouchEvent.onWithOptions "touchmove" { stopPropagation = False, preventDefault = False } (touchCoordinates >> MouseMove)
        , onMouseUp MouseUp
        ]
        [ leftBox model
        , right model
        , Tuple.first <| patternInputAutoComplete model
        ]
