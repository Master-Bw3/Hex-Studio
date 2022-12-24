module Components.App.Content exposing (content)

import Components.App.LeftBox exposing (leftBox)
import Components.App.Right exposing (right)
import Html exposing (..)
import Html.Attributes exposing (id)
import Html.Events exposing (on, onClick, onMouseUp)
import Html.Events.Extra.Mouse exposing (onMove)
import Json.Decode as Decode exposing (Decoder, at, float, int, map4)
import Logic.App.Model exposing (Model)
import Logic.App.Msg exposing (MouseMoveData, Msg(..))


content : Model -> Html Msg
content model =
    div
        [ id "content"
        , onMove (.clientPos >> MouseMove)
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
