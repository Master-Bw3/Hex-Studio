module Components.App.Panels.FilePanel exposing (..)

import Array exposing (Array)
import Components.App.Panels.Utils exposing (visibilityToDisplayStyle)
import File.Select
import Html exposing (..)
import Html.Attributes exposing (alt, attribute, class, download, href, id, src, style, value)
import Html.Events exposing (onClick, onInput)
import Logic.App.ImportExport.ExportAsGiveCommand exposing (exportAsGiveCommand)
import Logic.App.ImportExport.ImportExportProject exposing (encodeProjectData, modelToProjectData)
import Logic.App.Model exposing (Model)
import Logic.App.Msg exposing (Msg(..))
import Logic.App.Types exposing (Iota(..), Overlay(..), Panel(..))



-- saveExportPanel : Model -> Html Msg
-- saveExportPanel model =
--     let
--         visibility =
--             List.member FilePanel model.ui.openPanels
--     in
--     div
--         [ id "save_export_panel"
--         , class "panel"
--         , visibilityToDisplayStyle visibility
--         ]
--         [ h1 [ class "panel_title" ]
--             [ text "File" ]
--         , div [ style "align-self" "center", style "width" "100%"]
--             [ textarea [id "import_input", onInput SetImportInputValue] []]
--         , button [style "color" "white", onClick (ImportText model.ui.importInput)] [text "Import"]
--         , div [ style "height" "300px", style "align-content" "center" ]
--             [ img
--                 ([ src
--                     (if model.gridGifSrc == "loading" then
--                         "./gen/resources/loading.gif"
--                      else
--                         model.gridGifSrc
--                     )
--                  , style "width" "100%"
--                  , style "max-height" "300px"
--                  , style "object-fit" "cover"
--                  ]
--                     ++ (if model.gridGifSrc == "" then
--                             [ style "opacity" "0" ]
--                         else
--                             []
--                        )
--                 )
--                 []
--             ]
--         , div [ style "align-self" "center" ]
--             [ button [ style "color" "white", onClick RequestGridDrawingAsGIF ] [ text "generate gif" ]
--             , a [ href model.gridGifSrc, download "hex.gif", style "padding-left" "2em" ] [ button [ style "color" "white" ] [ text "download gif" ] ]
--             ]
--         ]


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
        -- , div [ class "input_label_box" ]
        --     [ label [] [ text "Project Name:" ]
        --     , input [ value model.projectName, onInput SetProjectName ] []
        --     ]
        -- , div [ class "seperator" ] []

        -- -- , button [ class "generic_button" ] [ text " • Save Project" ]
        -- -- , button [ class "generic_button" ] [ text " • Load Project" ]
        -- , button [ class "generic_button", onClick SelectProjectFile ] [ text " • Import Project" ]
        -- , button [ class "generic_button", onClick (Download (encodeProjectData <| modelToProjectData model) (model.projectName ++ ".hex") "text/plain") ] [ text " • Export Project" ]
        -- , div [ class "seperator" ] []

        --
        , button [ class "generic_button", onClick (ViewOverlay ImportTextOverlay) ] [ text " • Import Patterns" ]
        , button [ class "generic_button", onClick (ViewOverlay ExportTextOverlay) ] [ text " • Export Patterns" ]
        , div [ class "seperator" ] []

        -- , button [ class "generic_button", onClick (ViewOverlay ExportTextOverlay) ] [ text " • Export Give Command" ]
        , button [ class "generic_button", onClick RequestGridDrawingAsImage ] [ text " • Export Image" ]
        , button [ class "generic_button", onClick RequestGridDrawingAsGIF ] [ text " • Export Gif" ]
        ]
