module Components.App.Panels.StackPanel exposing (stackPanel)

import Html exposing (..)
import Html.Attributes exposing (class, id)
import Logic.App.Model exposing (Model)
import Logic.App.Types exposing (Panel(..))
import Components.App.Panels.Utils exposing (visibilityToDisplayStyle)

stackPanel : Model -> Html msg
stackPanel model =
    let
        visibility =
            List.member StackPanel model.ui.openPanels
    in
    div [ id "stack_panel", class "panel", visibilityToDisplayStyle visibility]
        [ h1 [ class "panel_title" ] [ text "Stack ∧" ] ]


