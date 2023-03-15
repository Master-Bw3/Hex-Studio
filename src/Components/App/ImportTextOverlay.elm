module Components.App.ImportTextOverlay exposing (..)

import Html exposing (Html, button, div, text, textarea)
import Html.Attributes exposing (class, id, style)
import Html.Events exposing (onClick, onInput)
import Logic.App.Model exposing (Model)
import Logic.App.Msg exposing (Msg(..))
import Html.Attributes exposing (value)


importTextOverlay : Model -> Html Msg
importTextOverlay model =
    let
        visibility =
            if model.ui.showImportTextOverlay == False then
                style "display" "none"

            else
                style "" ""
    in
    div [ id "import_text_overlay", visibility ]
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
                , onClick (SetImportOverlayVisibility False)
                ]
                [ text "Cancel" ]
            ]
        ]
