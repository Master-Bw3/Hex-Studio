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
import Html.Attributes exposing (attribute, class, id, placeholder, value)
import Html.Events exposing (keyCode, onClick, onInput, preventDefaultOn)
import Json.Decode as Json
import Logic.App.Model exposing (Model)
import Logic.App.Msg exposing (Msg(..))
import Logic.App.Patterns.PatternRegistry exposing (patternRegistry)
import Logic.App.Types exposing (GridPoint, Panel(..), PatternType)


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

        isEnter code =
            if code == 13 then
                Json.succeed ( InputPattern valueToSend, True )

            else if code == 9 then
                Json.succeed ( SelectNextSuggestion <| List.length <| patternInputSuggestionList model, True )

            else
                Json.fail "not ENTER"
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
                , div [ id "pattern_input_container" ]
                    [ input
                        [ id "add_pattern_input"
                        , placeholder "Add a pattern"
                        , attribute "autocomplete" "off"
                        , onInput UpdatePatternInputField
                        , value model.ui.patternInputField
                        , preventDefaultOn "keydown" (Json.andThen isEnter keyCode)
                        ]
                        []
                    , Tuple.first autocompleteTuple
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


autocompleteList : List ( String, String )
autocompleteList =
    List.map (\pat -> ( pat.displayName, pat.internalName )) patternRegistry


patternInputAutoComplete : Model -> ( Html Msg, String )
patternInputAutoComplete model =
    let
        suggestionIndex =
            model.ui.suggestionIndex

        constructOption index name =
            li
                [ if index == suggestionIndex then
                    class "highlighted_suggestion"

                  else
                    class ""
                ]
                [ text
                    (if name == "" then
                        "owo"

                     else
                        name
                    )
                ]

        getHighlightedOption =
            Maybe.withDefault "" <|
                List.head <|
                    List.filter
                        (\name -> name /= "")
                        (List.indexedMap
                            (\index name ->
                                if index == suggestionIndex then
                                    name

                                else
                                    ""
                            )
                            (patternInputSuggestionList model)
                        )
    in
    ( div [ class "autocomplete_container" ]
        (List.indexedMap constructOption (patternInputSuggestionList model))
    , getHighlightedOption
    )


patternInputSuggestionList : Model -> List String
patternInputSuggestionList model =
    let
        inputValue =
            model.ui.patternInputField
    in
    if inputValue /= "" then
        Debug.log "owo" <|
            Tuple.first <|
                List.unzip <|
                    List.filter
                        (\name ->
                            String.contains (String.toLower inputValue) (String.toLower <| Tuple.first name)
                                || String.contains (String.toLower inputValue) (String.toLower <| Tuple.second name)
                        )
                        autocompleteList

    else
        []
