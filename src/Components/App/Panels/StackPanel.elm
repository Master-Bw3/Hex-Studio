module Components.App.Panels.StackPanel exposing (stackPanel)

import Html exposing (..)
import Html.Attributes exposing (class, id)
import Svg.Attributes exposing (visibility)
import Logic.App.Model exposing (Model)

stackPanel : Model -> Html msg
stackPanel model =
    let
        visibility = model.ui.openPanels
    in
    div [ id "stack_panel", class "panel" ]
        [h1 [class "panel_title"] [text "Stack ∧"]]
