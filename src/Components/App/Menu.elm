module Components.App.Menu exposing (menu)

import FontAwesome as Icon exposing (Icon)
import FontAwesome.Attributes as Icon
import FontAwesome.Brands as Icon
import FontAwesome.Layering as Icon
import FontAwesome.Solid as Icon
import FontAwesome.Styles as Icon
import Html exposing (..)
import Html.Attributes exposing (class, id, style)
import Html.Events.Extra.Mouse exposing (onClick)
import Logic.App.Model exposing (Model)
import Logic.App.Msg exposing (Msg(..))
import Logic.App.Types exposing (Panel(..))


menu : Model -> Html Msg
menu model =
    let
        highlightIfActive panel =
            if List.member panel model.ui.openPanels then
                [ style "background-color" "var(--primary_medium)" ]

            else
                []
    in
    div
        [ id "menu"
        ]
        [ button
            ([ id "pattern_menu_button"
             , class "menu_button"
             , onClick (\event -> ViewPanel PatternPanel event.keys)
             ]
                ++ highlightIfActive PatternPanel
            )
            [ Icon.css
            , Icon.code |> Icon.styled [ Icon.sm ] |> Icon.view
            ]
        , button
            ([ id "stack_menu_button"
             , class "menu_button"
             , onClick (\event -> ViewPanel StackPanel event.keys)
             ]
                ++ highlightIfActive StackPanel
            )
            [ Icon.css
            , Icon.layerGroup |> Icon.styled [ Icon.sm ] |> Icon.view
            ]
        , button
            ([ id "config_hex_menu_button"
             , class "menu_button"
             , onClick (\event -> ViewPanel ConfigHexPanel event.keys)
             ]
                ++ highlightIfActive ConfigHexPanel
            )
            [ Icon.css
            , Icon.sliders |> Icon.styled [ Icon.sm ] |> Icon.view
            ]
        , button
            ([ id "save_export_menu_button"
             , class "menu_button"
             , onClick (\event -> ViewPanel SaveExportPanel event.keys)
             ]
                ++ highlightIfActive SaveExportPanel
            )
            [ Icon.css
            , Icon.download |> Icon.styled [ Icon.sm ] |> Icon.view
            ]
        ]
