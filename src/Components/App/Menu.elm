module Components.App.Menu exposing (menu)

import FontAwesome as Icon exposing (Icon)
import FontAwesome.Attributes as Icon
import FontAwesome.Brands as Icon
import FontAwesome.Layering as Icon
import FontAwesome.Solid as Icon
import FontAwesome.Styles as Icon
import Html exposing (..)
import Html.Attributes exposing (class, id)
import Html.Events exposing (onClick)
import Logic.App.Msg exposing (Msg(..))
import Logic.App.Types exposing (Panel(..))

menu : model -> Html Msg
menu model =
    div
        [ id "menu"
        ]
        [ div
            [ id "pattern_menu_button"
            , class "menu_button"
            , onClick (ViewPanel PatternPanel)
            ]
            [ Icon.css
            , Icon.code |> Icon.styled [ Icon.sm ] |> Icon.view
            ]
        , div
            [ id "stack_menu_button"
            , class "menu_button"
            , onClick (ViewPanel StackPanel)
            ]
            [ Icon.css
            , Icon.layerGroup |> Icon.styled [ Icon.sm ] |> Icon.view
            ]
        ]
