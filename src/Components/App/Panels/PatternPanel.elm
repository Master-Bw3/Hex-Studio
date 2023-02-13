module Components.App.Panels.PatternPanel exposing (patternPanel)

import Array exposing (Array)
import Components.App.Panels.Utils exposing (visibilityToDisplayStyle)
import Components.App.PatternAutoComplete exposing (..)
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
import Html.Attributes exposing (attribute, class, id, placeholder, style, value)
import Html.Events exposing (keyCode, onBlur, onClick, onFocus, onInput, preventDefaultOn)
import Html.Events.Extra.Drag exposing (DraggedSourceConfig, DropTargetConfig, Event, onDropTarget, onSourceDrag)
import Html.Events.Extra.Mouse exposing (onOver, onWithOptions)
import Json.Decode as Json exposing (Decoder, at, float, int, map4)
import Logic.App.Model exposing (Model)
import Logic.App.Msg exposing (MouseMoveData, Msg(..))
import Logic.App.Patterns.PatternRegistry exposing (patternRegistry)
import Logic.App.Types exposing (GridPoint, Panel(..), PatternType)
import String exposing (fromInt)


patternPanel : Model -> Html Msg
patternPanel model =
    let
        autocompleteTuple =
            patternInputAutoComplete model

        valueToSend =
            if Tuple.second autocompleteTuple /= "" then
                Tuple.second autocompleteTuple

            else
                model.ui.patternInputField

        visibility =
            List.member PatternPanel model.ui.openPanels

        detectKey code =
            if code == 13 || code == 9 then
                Json.succeed ( InputPattern valueToSend, True )

            else if code == 38 then
                Json.succeed ( SelectPreviousSuggestion <| List.length <| patternInputSuggestionList model, True )

            else if code == 40 then
                Json.succeed ( SelectNextSuggestion <| List.length <| patternInputSuggestionList model, True )

            else
                Json.fail ""
    in
    div [ id "pattern_panel", class "panel", visibilityToDisplayStyle visibility ]
        [ h1
            [ class "panel_title"
            ]
            [ text "Pattern Order ∨" ]
        , div
            (id "pattern_draggable_container" :: onDropTarget dropTargetConfig)
            (List.reverse (renderPatternList model.patternArray model.ui.mouseOverElementIndex (Tuple.second model.ui.dragging)))
        , div
            [ id "add_pattern"
            , class "outer_box"
            ]
            [ div
                [ class "inner_box"
                ]
                [ paragraphDropdown
                , div [ id "pattern_input_container" ]
                    [ input
                        [ id "add_pattern_input"
                        , placeholder "Add a pattern"
                        , attribute "autocomplete" "off"
                        , onInput UpdatePatternInputField
                        , onFocus (SetFocus "add_pattern_input")
                        , onBlur (SetFocus "")
                        , value model.ui.patternInputField
                        , preventDefaultOn "keydown" (Json.andThen detectKey keyCode)
                        ]
                        []
                    ]
                , button
                    [ id "add_pattern_button"
                    , class "add_button"
                    , onClick (InputPattern valueToSend)
                    ]
                    [ Icon.css
                    , Icon.plus |> Icon.styled [ Icon.sm ] |> Icon.view
                    ]
                ]
            ]
        ]


dropTargetConfig : DropTargetConfig Msg
dropTargetConfig =
    { dropEffect = Html.Events.Extra.Drag.MoveOnDrop
    , onOver = DragOver
    , onDrop = always Drop
    , onEnter = Nothing
    , onLeave = Nothing
    }


draggedSourceConfig : Int -> DraggedSourceConfig Msg
draggedSourceConfig id =
    { effectAllowed = { move = True, copy = False, link = False }
    , onStart = DragStart id
    , onEnd = always DragEnd
    , onDrag = Nothing
    }


renderPatternList : Array ( PatternType, List GridPoint ) -> Int -> Int -> List (Html Msg)
renderPatternList patternList dragoverIndex dragstartIndex =
    let
        patterns : List PatternType
        patterns =
            Tuple.first <| List.unzip <| Array.toList patternList

        renderPattern : Int -> PatternType -> List (Html Msg)
        renderPattern index pattern =
            (if dragoverIndex == index && index /= dragstartIndex then
                [ div [ class "seperator" ] [] ]

             else
                []
            )
                ++ [ div
                        ([ class "outer_box"
                         , attribute "data-index" <| fromInt index
                         , attribute "draggable" "true"
                         ]
                            ++ onSourceDrag (draggedSourceConfig index)
                            ++ (if index == dragstartIndex then
                                    [ style "opacity" "40%" ]

                                else
                                    [ style "opacity" "100%" ]
                               )
                            ++ (if dragoverIndex == index && index /= dragstartIndex then
                                    [ class "dragover" ]

                                else
                                    []
                               )
                        )
                        [ div [ class "inner_box" ]
                            [ button [ class "x_button", onClick (RemoveFromPatternArray index (index + 1)) ] [ xButton ]
                            , div [ class "text" ] [ text pattern.displayName ]
                            , div [ class "move_button" ] [ moveButton ]
                            ]
                        ]
                   ]
    in
    List.concat (List.indexedMap renderPattern patterns)
        ++ (if dragoverIndex > List.length patterns - 1 then
                [ div [ class "seperator" ] [] ]

            else
                []
           )
