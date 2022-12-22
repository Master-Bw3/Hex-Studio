module Components.App.LeftBox exposing (leftBox)

import Components.App.Menu exposing (menu)
import Components.App.Panels.Panels exposing (panels)
import Html exposing (Html, div)
import Html.Attributes exposing (class, id)
import Logic.App.Model exposing (Model)
import Logic.App.Msg exposing (Msg(..))


leftBox : Model -> Html Msg
leftBox model =
    div [ id "left_box" ] [ menu model, panels model ]
