module Components.App.Menu exposing (menu)

import FontAwesome as Icon exposing (Icon)
import FontAwesome.Attributes as Icon
import FontAwesome.Brands as Icon
import FontAwesome.Layering as Icon
import FontAwesome.Solid as Icon
import FontAwesome.Styles as Icon
import Html exposing (..)
import Html.Attributes exposing (class, href, id)


menu : model -> Html msg
menu model =
    div
        [ id "menu"
        ]
        [ div
            [ id "pattern_menu_button"
            , class "menu_button"
            ]
            [ Icon.css
            , Icon.code |> Icon.styled [ Icon.sm ] |> Icon.view
            ]
        , div
            [ id "stack_menu_button"
            , class "menu_button"
            ]
            [ Icon.css
            , Icon.layerGroup |> Icon.styled [ Icon.sm ] |> Icon.view
            ]
        ]
