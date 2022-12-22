module Components.App.Content exposing (content)

import Components.App.LeftBox exposing (leftBox)
import Components.App.Right exposing (right)
import Html exposing (..)
import Html.Attributes exposing (class, id)
import Logic.App.Model exposing (Model)
import Logic.App.Msg exposing (Msg(..))


content : Model -> Html Msg
content model =
    div [ id "content" ]
        [ leftBox model,
          right model
        ]
