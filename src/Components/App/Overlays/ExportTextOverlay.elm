module Components.App.Overlays.ExportTextOverlay exposing (..)

import Array exposing (Array)
import Html exposing (Html, button, div, p, span, text, textarea)
import Html.Attributes exposing (class, id, style, value)
import Html.Events exposing (onClick, onInput)
import Logic.App.ImportExport.ExportAsText exposing (exportPatternsAsLineList)
import Logic.App.Model exposing (Model)
import Logic.App.Msg exposing (Msg(..))
import Logic.App.Types exposing (Overlay(..))


exportTextOverlay : Model -> List (Html Msg)
exportTextOverlay model =
    if model.ui.openOverlay /= ExportTextOverlay then
        []

    else
        let
            patternText =
                exportPatternsAsLineList <| Array.map Tuple.first model.patternArray
        in
        [ div [ class "overlay" ]
            [ div
                [ id "export_text"
                , onInput SetImportInputValue
                , value model.ui.importInput
                , style "display" "flex"
                , style "flex-direction" "column"
                ]
                [ p [] [ text patternText ] ]
            , div [ id "import_overlay_button_container" ]
                [ button
                    [ class "import_overlay_button"
                    , onClick (Download patternText "Hex.hexcasting")
                    ]
                    [ text "Download" ]
                , button
                    [ class "import_overlay_button"
                    , class "cancel_button"
                    , onClick (ViewOverlay NoOverlay)
                    ]
                    [ text "Cancel" ]
                ]
            ]
        ]
