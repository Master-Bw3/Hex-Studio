module Components.App.PatternAutoComplete exposing (..)

import Html exposing (..)
import Html.Attributes exposing (style, class)
import Logic.App.Model exposing (Model)
import Logic.App.Msg exposing (Msg(..))
import Logic.App.Patterns.PatternRegistry exposing (patternRegistry)
import String exposing (fromInt)


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
    ( div
        [ class "autocomplete_container"
        , style "left" <| (fromInt <| Tuple.first model.ui.patternInputLocation) ++ "px"
        , style "top" <| (fromInt <| Tuple.second model.ui.patternInputLocation) ++ "px"
        ]
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
