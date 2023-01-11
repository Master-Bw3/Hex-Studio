module Components.App.Panels.StackPanel exposing (stackPanel)

import Array exposing (Array)
import Components.App.Panels.Utils exposing (visibilityToDisplayStyle)
import Html exposing (..)
import Html.Attributes exposing (class, id, style)
import Logic.App.Model exposing (Model)
import Logic.App.Types exposing (Iota(..), Panel(..))
import Logic.App.Utils.GetIotaValue exposing (getIotaValueAsHtmlMsg, getIotaValueAsString)
import Settings.Theme exposing (iotaColorMap)


stackPanel : Model -> Html msg
stackPanel model =
    let
        visibility =
            List.member StackPanel model.ui.openPanels
    in
    div [ id "stack_panel", class "panel", visibilityToDisplayStyle visibility ]
        [ h1 [ class "panel_title" ] [ text "Stack ∧" ]
        , div
            [ class "scroll_container" ]
            (renderStack model.stack)
        ]


renderStack : Array Iota -> List (Html msg)
renderStack stack =
    let
        renderIota : Int -> Iota -> Html msg
        renderIota index iota =
            div [ class "outer_box", style "background-color" (iotaColorMap iota) ]
                [ div [ class "inner_box" ]
                    [ div [ class "index_display" ] [ text (String.fromInt (index + 1)) ]
                    , div [ class "text" ] [ div [] (getIotaValueAsHtmlMsg iota) ]
                    ]
                ]
    in
    Array.toList <| Array.indexedMap renderIota stack
