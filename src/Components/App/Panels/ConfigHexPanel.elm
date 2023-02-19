module Components.App.Panels.ConfigHexPanel exposing (..)

import Components.App.Panels.Utils exposing (visibilityToDisplayStyle)
import Html exposing (..)
import Html.Attributes exposing (class, id, style)
import Logic.App.Model exposing (Model)
import Logic.App.Msg exposing (Msg)
import Logic.App.Types exposing (Iota(..), Panel(..))


configHexPanel : Model -> Html Msg
configHexPanel model =
    let
        visibility =
            List.member ConfigHexPanel model.ui.openPanels
    in
    div [ id "pattern_panel", class "panel", visibilityToDisplayStyle visibility ]
        [ h1 [ class "panel_title" ] [ text "Configure Defaults" ]]
