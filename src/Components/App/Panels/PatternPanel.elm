module Components.App.Panels.PatternPanel exposing (patternPanel)

import Array exposing (Array)
import Components.App.Panels.Utils exposing (visibilityToDisplayStyle)
import Components.Icon.MoveButton exposing (moveButton)
import Components.Icon.ParagraphDropdown exposing (paragraphDropdown)
import Components.Icon.XButton exposing (xButton)
import FontAwesome as Icon exposing (Icon)
import FontAwesome.Attributes as Icon
import FontAwesome.Brands as Icon
import FontAwesome.Layering as Icon
import FontAwesome.Solid as Icon
import FontAwesome.Styles as Icon
import Html exposing (..)
import Html.Attributes exposing (attribute, class, id, placeholder)
import Html.Events exposing (onClick, onInput)
import Logic.App.Model exposing (Model)
import Logic.App.Msg exposing (Msg(..))
import Logic.App.Types exposing (GridPoint, Panel(..), PatternType)
import Html.Attributes exposing (value)


patternPanel : Model -> Html Msg
patternPanel model =
    let
        visibility =
            List.member PatternPanel model.ui.openPanels
    in
    div [ id "pattern_panel", class "panel", visibilityToDisplayStyle visibility ]
        [ h1
            [ class "panel_title"
            ]
            [ text "Pattern Order ∨" ]
        , div
            [ id "pattern_draggable_container"
            ]
            (renderPatternList model.patternArray)
        , div
            [ id "add_pattern"
            , class "outer_box"
            ]
            [ div
                [ class "inner_box"
                ]
                [ paragraphDropdown
                , input
                    [ id "add_pattern_input"
                    , placeholder "Add a pattern"
                    , attribute "autocomplete" "off"
                    , onInput UpdatePatternInputField
                    , value model.ui.patternInputField
                    ]
                    []
                , button
                    [ id "add_pattern_button"
                    , class "add_button"
                    , onClick InputPattern
                    ]
                    [ Icon.css
                    , Icon.plus |> Icon.styled [ Icon.sm ] |> Icon.view
                    ]
                ]
            ]
        ]


renderPatternList : Array ( PatternType, List GridPoint ) -> List (Html Msg)
renderPatternList patternList =
    let
        patterns : List PatternType
        patterns =
            Tuple.first <| List.unzip <| Array.toList patternList

        renderPattern : Int -> PatternType -> Html Msg
        renderPattern index pattern =
            div [ class "outer_box" ]
                [ div [ class "inner_box" ]
                    [ button [ class "x_button", onClick (RemoveFromPatternArray index (index + 1)) ] [ xButton ]
                    , div [ class "text" ] [ text pattern.displayName ]
                    , div [ class "move_button" ] [ moveButton ]
                    ]
                ]
    in
    List.indexedMap renderPattern patterns
