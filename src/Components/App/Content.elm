module Components.App.Content exposing (content)

import Components.App.LeftBox exposing (leftBox)
import Components.App.Right exposing (right)
import Html exposing (..)
import Html.Attributes exposing (id)
import Logic.App.Model exposing (Model)
import Logic.App.Msg exposing (Msg(..))


content : Model -> Html Msg
content model =
    let
        d =
            Debug.log <| Debug.toString model.grid.points
    in
    d
    div [ id "content" ]
        [ leftBox model
        , right model
        ]
