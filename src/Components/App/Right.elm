module Components.App.Right exposing (right)

import FontAwesome as Icon exposing (Icon)
import FontAwesome.Attributes as Icon
import FontAwesome.Brands as Icon
import FontAwesome.Layering as Icon
import FontAwesome.Solid as Icon
import FontAwesome.Styles as Icon
import Html exposing (..)
import Html.Attributes exposing (class, id)
import Components.App.Grid exposing (grid)
import Logic.App.Msg exposing (Msg)
import Logic.App.Model exposing (Model)

right : Model -> Html Msg
right model =
    div
        [ id "right"
        ]
        [ div
            [ id "canvas_buttons"
            ]
            [ button
                [ id "sort"
                ]
                [ Icon.css
                , Icon.arrowDownShortWide |> Icon.styled [ Icon.sm ] |> Icon.view
                ]
            , button
                [ id "zoom_out"
                ]
                [ Icon.css
                , Icon.minus |> Icon.styled [ Icon.sm ] |> Icon.view
                ]
            , button
                [ id "zoom_in"
                ]
                [ Icon.css
                , Icon.plus |> Icon.styled [ Icon.sm ] |> Icon.view
                ]
            ]
        , grid model
        , div
            [ id "bottom_box"
            ]
            []
        ]
