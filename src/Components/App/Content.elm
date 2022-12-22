module Components.App.Content exposing (content)

import Components.App.LeftBox exposing (leftBox)
import Components.App.Right exposing (right)
import Html exposing (..)
import Html.Attributes exposing (class, id)


content : model -> Html msg
content model =
    div [ id "content" ]
        [ leftBox model,
          right model
        ]
