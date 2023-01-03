module Components.App.Content exposing (content)

import Components.App.LeftBox exposing (leftBox)
import Components.App.Right exposing (right)
import Html exposing (..)
import Html.Attributes exposing (id)
import Html.Events exposing (onMouseUp)
import Html.Events.Extra.Mouse as MouseEvent
import Html.Events.Extra.Touch as TouchEvent
import Json.Decode as Decode exposing (Decoder, at, float, int, map4)
import Logic.App.Model exposing (Model)
import Logic.App.Msg exposing (MouseMoveData, Msg(..))
import Logic.App.Utils.Utils exposing (touchCoordinates)


content : Model -> Html Msg
content model =
    div
        [ id "content"
        , MouseEvent.onMove (.clientPos >> MouseMove)
        , TouchEvent.onMove (touchCoordinates >> MouseMove)
        , onMouseUp MouseUp
        ]
        [ leftBox model
        , right model
        ]


mouseMoveDecoder : Decoder MouseMoveData
mouseMoveDecoder =
    map4 MouseMoveData
        (at [ "pageX" ] int)
        (at [ "pageY" ] int)
        (at [ "target", "offsetHeight" ] float)
        (at [ "target", "offsetWidth" ] float)
