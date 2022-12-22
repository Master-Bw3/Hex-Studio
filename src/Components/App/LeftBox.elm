module Components.App.LeftBox exposing (leftBox)

import Components.App.Menu exposing (menu)
import Components.App.Panels.Panels exposing (panels)
import Html exposing (Html, div)
import Html.Attributes exposing (class, id)


leftBox : model -> Html msg
leftBox model =
    div [ id "left_box" ] [ menu model, panels model ]
