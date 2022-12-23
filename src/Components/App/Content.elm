module Components.App.Content exposing (content)

import Components.App.LeftBox exposing (leftBox)
import Components.App.Right exposing (right)
import Html exposing (..)
import Html.Attributes exposing (id)
import Html.Events exposing (on)
import Json.Decode as Decode exposing (Decoder, at, float, int, map4)
import Logic.App.Model exposing (Model)
import Logic.App.Msg exposing (MouseMoveData, Msg(..))


content : Model -> Html Msg
content model =
    let
        d =
            Debug.log <| Debug.toString model.grid.points
    in
    div [ id "content", on "mousemove" (Decode.map MouseMove mouseMoveDecoder) ]
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
