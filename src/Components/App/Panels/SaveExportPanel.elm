module Components.App.Panels.SaveExportPanel exposing (..)

import Array exposing (Array)
import Components.App.Panels.Utils exposing (visibilityToDisplayStyle)
import Html exposing (..)
import Html.Attributes exposing (alt, attribute, class, id, src, style)
import Html.Events exposing (onClick, onInput)
import Logic.App.Model exposing (Model)
import Logic.App.Msg exposing (Msg(..))
import Logic.App.Types exposing (Iota(..), Panel(..))


saveExportPanel : Model -> Html Msg
saveExportPanel model =
    let
        visibility =
            List.member SaveExportPanel model.ui.openPanels
    in
    div
        [ id "save_export_panel"
        , class "panel"
        , visibilityToDisplayStyle visibility
        ]
        [ h1 [ class "panel_title" ]
            [ text "Save / Export" ]
        , img
            ([ src model.gridGifSrc
             , style "width" "100%"
             , style "max-height" "300px"
             , style "object-fit" "scale-down"
             ]
                ++ (if model.gridGifSrc == "" then
                        [style "opacity" "0"]

                    else
                        []
                   )
            )
            []
        , button [ style "color" "white", onClick RequestGridDrawingAsGIF ] [ text "generate gif" ]
        ]
