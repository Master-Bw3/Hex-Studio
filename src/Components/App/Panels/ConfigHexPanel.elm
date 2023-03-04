module Components.App.Panels.ConfigHexPanel exposing (..)

import Array exposing (Array)
import Components.App.Panels.Utils exposing (visibilityToDisplayStyle)
import Html exposing (..)
import Html.Attributes exposing (class, id, style)
import Html.Events exposing (onInput)
import Logic.App.Model exposing (Model)
import Logic.App.Msg exposing (Msg(..))
import Logic.App.Types exposing (Iota(..), Panel(..))
import Logic.App.Utils.GetIotaValue exposing (getIotaValueAsHtmlMsg)
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
            [ text "Configure World" ]
        , heldItemSection model
        ]


heldItemSection : Model -> Html Msg
heldItemSection model =
    div [ id "held_item_section" ]
        [ div
            [ class "input_label_box"
            ]
            [ label [] [ text "Held Item:" ]
            , select [ onInput ChangeHeldItem ]
                [ option [] [ text "Nothing" ]
                , option [] [ text "Trinket" ]
                , option [] [ text "Cypher" ]
                , option [] [ text "Artifact" ]
                , option [] [ text "Spellbook" ]
                , option [] [ text "Focus" ]
                , option [] [ text "Pie" ]
                ]
            ]
        , div [class "stored_iota_container"]
            (label [class "stored_iota_label"] [ text "Content:" ]
                :: (case model.castingContext.heldItemContent of
                        Just iota ->
                            [ renderHeldItemContent iota ]

                        Nothing ->
                            []
                   )
            )
        ]


renderHeldItemContent : Iota -> Html msg
renderHeldItemContent heldItemContent =
    let
        renderIota : Iota -> Html msg
        renderIota iota =
            div [ class "outer_box", style "background-color" (iotaColorMap iota) ]
                [ div [ class "inner_box" ]
                    [ div [ class "text" ] [ div [] (getIotaValueAsHtmlMsg iota) ] ]
                ]
    in
    renderIota heldItemContent
