module Components.App.Panels.FilePanel exposing (..)

import Array exposing (Array)
import Components.App.Panels.Utils exposing (visibilityToDisplayStyle)
import File.Select
import Html exposing (..)
import Html.Attributes exposing (alt, attribute, class, download, href, id, src, style, value)
import Html.Events exposing (onClick, onInput)
import Logic.App.ImportExport.ExportAsGiveCommand exposing (exportAsGiveCommand)
import Logic.App.ImportExport.ImportExportProject.ImportExportProjectV1 exposing (encodeProjectData, modelToProjectData)
import Logic.App.Model exposing (Model)
import Logic.App.Msg exposing (Msg(..))
import Logic.App.Types exposing (Iota(..), Overlay(..), Panel(..))

saveExportPanel : Model -> Html Msg
saveExportPanel model =
    let
        visibility =
            List.member FilePanel model.ui.openPanels
    in
    div
        [ id "save_export_panel"
        , class "panel"
        , visibilityToDisplayStyle visibility
        ]
        [ h1 [ class "panel_title" ] [ text "File" ]
        , div [ class "input_label_box" ]
            [ label [] [ text "Project Name:" ]
            , input [ value model.projectName, onInput SetProjectName ] []
            ]
        , div [ class "seperator" ] []

        -- , button [ class "generic_button" ] [ text " • Save Project" ]
        -- , button [ class "generic_button" ] [ text " • Load Project" ]
        , button [ class "generic_button", onClick SelectProjectFile ] [ text " • Import Project" ]
        , button [ class "generic_button", onClick (Download (encodeProjectData <| modelToProjectData model) (model.projectName ++ ".hex") "text/plain") ] [ text " • Export Project" ]
        , div [ class "seperator" ] []

        
        , button [ class "generic_button", onClick (ViewOverlay ImportTextOverlay) ] [ text " • Import Patterns" ]
        , button [ class "generic_button", onClick (ViewOverlay ExportTextOverlay) ] [ text " • Export Patterns" ]
        , div [ class "seperator" ] []

        -- , button [ class "generic_button", onClick (ViewOverlay ExportTextOverlay) ] [ text " • Export Give Command" ]
        , button [ class "generic_button", onClick RequestGridDrawingAsImage ] [ text " • Export Image" ]
        , button [ class "generic_button", onClick RequestGridDrawingAsGIF ] [ text " • Export Gif" ]
        ]
