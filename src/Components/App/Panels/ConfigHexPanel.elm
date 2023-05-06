module Components.App.Panels.ConfigHexPanel exposing (..)

import Array exposing (Array)
import Components.App.Panels.Utils exposing (visibilityToDisplayStyle)
import Html exposing (..)
import Html.Attributes exposing (class, id, style, value)
import Html.Events exposing (onInput)
import Logic.App.Model exposing (Model)
import Logic.App.Msg exposing (Msg(..))
import Logic.App.Types exposing (Iota(..), Panel(..))
import Logic.App.Utils.GetHeldItemAsString exposing (getHeldItemAsString)
import Logic.App.Utils.GetIotaValue exposing (getIotaValueAsHtmlMsg)
import Settings.Theme exposing (iotaColorMap)
import Logic.App.Utils.PlayerContext exposing (getPlayerHeldItem)
import Logic.App.Utils.PlayerContext exposing (getPlayerHeldItemContent)


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
        ]


heldItemSection : Model -> Html Msg
heldItemSection model =
    div [ id "held_item_section" ]
        [ div
            [ class "input_label_box"
            ]
            [ label [] [ text "Held Item:" ]
            , select
                [ onInput ChangeHeldItem
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
