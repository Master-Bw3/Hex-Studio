module Components.App.Content exposing (content)

import Components.App.LeftBox exposing (leftBox)
import Components.App.Panels exposing (panels)
import Components.App.Right exposing (right)
import Html exposing (..)
import Html.Attributes exposing (class, id)


content =
    div [ id "content" ]
        [ leftBox
        , panels
        , right
        ]
