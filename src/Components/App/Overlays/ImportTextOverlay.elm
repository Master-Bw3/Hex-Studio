module Components.App.Overlays.ImportTextOverlay exposing (..)

import Html exposing (Html, button, div, text, textarea)
import Html.Attributes exposing (class, id, style, value)
import Html.Events exposing (onClick, onInput)
import Logic.App.Model exposing (Model)
import Logic.App.Msg exposing (Msg(..))
import Logic.App.Types exposing (Overlay(..))


importTextOverlay : Model -> List (Html Msg)
importTextOverlay model =
    if model.ui.openOverlay /= ImportTextOverlay then
        []

    else
        [ div [ class "overlay" ]
            [ textarea [ id "import_input", onInput SetImportInputValue, value model.ui.importInput ] []
            , div [ id "import_overlay_button_container" ]
                [ button
                    [ class "import_overlay_button"
                    , onClick (ImportText model.ui.importInput)
                    ]
                    [ text "Import" ]
                , button
                    [ class "import_overlay_button"
                    , class "cancel_button"
                    , onClick (ViewOverlay NoOverlay)
                    ]
                    [ text "Cancel" ]
                ]
            ]
        ]
