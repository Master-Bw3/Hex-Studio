module Components.App.Panels.StackPanel exposing (stackPanel)

import Html exposing (..)
import Html.Attributes exposing (class, id)
import View exposing (placeholder)


stackPanel : model -> Html msg
stackPanel model visibility =
    div [ id "stack_panel", class "panel" ]
        []
