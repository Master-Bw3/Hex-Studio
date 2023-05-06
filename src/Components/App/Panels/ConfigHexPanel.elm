module Components.App.Panels.ConfigHexPanel exposing (..)

import Array exposing (Array)
import Components.App.Panels.Utils exposing (visibilityToDisplayStyle)
import Dict
import Html exposing (..)
import Html.Attributes exposing (class, id, style, value)
import Html.Events exposing (onInput)
import Logic.App.Model exposing (Model)
import Logic.App.Msg exposing (Msg(..))
import Logic.App.Types exposing (Iota(..), Panel(..))
import Logic.App.Utils.GetHeldItemAsString exposing (getHeldItemAsString)
import Logic.App.Utils.GetIotaValue exposing (getIotaValueAsHtmlMsg)
import Logic.App.Utils.EntityContext exposing (getPlayerHeldItem, getPlayerHeldItemContent)
import Settings.Theme exposing (iotaColorMap)


configHexPanel : Model -> Html Msg
configHexPanel model =
    let
        visibility =
            List.member ConfigHexPanel model.ui.openPanels
    in
    div
        [ id "config_hex_panel"
        , class "panel"
        , visibilityToDisplayStyle visibility
        ]
        [ h1 [ class "panel_title" ]
            [ text "Casting Context" ]
        , heldItemSection model
        , div [ class "divider" ] []
        , ravenmindSection model
        , div [ class "divider" ] []
        , entitiesSection model
        ]


heldItemSection : Model -> Html Msg
heldItemSection model =
    div [ id "held_item_section" ]
        [ div
            [ class "input_label_box"
            ]
            [ label [] [ text "Held Item:" ]
            , select
                [ onInput (ChangeHeldItem "Player")
                , value <| getHeldItemAsString <| getPlayerHeldItem model.castingContext
                ]
                [ option [] [ text "Nothing" ]
                , option [] [ text "Trinket" ]
                , option [] [ text "Cypher" ]
                , option [] [ text "Artifact" ]
                , option [] [ text "Spellbook" ]
                , option [] [ text "Focus" ]
                , option [] [ text "Pie" ]
                ]
            ]
        , div [ class "stored_iota_container" ]
            (label [ class "stored_iota_label" ] [ text "Content:" ]
                :: (case getPlayerHeldItemContent model.castingContext of
                        Just iota ->
                            renderIotaBox iota

                        Nothing ->
                            []
                   )
            )
        ]


renderIotaBox : Iota -> List (Html msg)
renderIotaBox iota =
    [ div [] (getIotaValueAsHtmlMsg 0 iota 0) ]


ravenmindSection : Model -> Html Msg
ravenmindSection model =
    div [ id "ravenmind_section" ]
        [ div [ class "stored_iota_container" ]
            (label [ class "stored_iota_label" ] [ text "Ravenmind:" ]
                :: (case model.castingContext.ravenmind of
                        Just iota ->
                            renderIotaBox iota

                        Nothing ->
                            []
                   )
            )
        ]


entitiesSection : Model -> Html Msg
entitiesSection model =
    let
        generateEntitySection entry =
            case entry of
                ( name, { heldItem, heldItemContent } ) ->
                    div [ id "entity_section" ]
                        [ label [ class "stored_iota_label" ] [ text <| name ++ ":" ]
                        , div [ id "held_item_section" ]
                            [ div
                                [ class "input_label_box"
                                ]
                                [ label [] [ text "Held Item:" ]
                                , select
                                    [ onInput (ChangeHeldItem name)
                                    , value <| getHeldItemAsString heldItem
                                    ]
                                    [ option [] [ text "Nothing" ]
                                    , option [] [ text "Trinket" ]
                                    , option [] [ text "Cypher" ]
                                    , option [] [ text "Artifact" ]
                                    , option [] [ text "Spellbook" ]
                                    , option [] [ text "Focus" ]
                                    , option [] [ text "Pie" ]
                                    ]
                                ]
                            , div [ class "stored_iota_container" ]
                                (label [ class "stored_iota_label" ] [ text "Content:" ]
                                    :: (case heldItemContent of
                                            Just iota ->
                                                renderIotaBox iota

                                            Nothing ->
                                                []
                                       )
                                )
                            ]
                        ]
    in
    div [ id "entities_section" ]
        (h1 [ class "entities_label" ] [ text "Entities:" ]
            :: List.map generateEntitySection
                (List.filter
                    (\entry ->
                        case entry of
                            ( name, _ ) ->
                                name /= "Player"
                    )
                    (Dict.toList model.castingContext.entities)
                )
        )
