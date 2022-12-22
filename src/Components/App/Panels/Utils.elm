module Components.App.Panels.Utils exposing (..)
import Html.Attributes exposing (style)


visibilityToDisplayStyle visibility =
    if visibility then
        style "display" "flex"

    else
        style "display" "none"
