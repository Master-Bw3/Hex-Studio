module Components.App.Panels.LibraryPanel exposing (..)

import Array exposing (Array)
import Components.App.Panels.Utils exposing (visibilityToDisplayStyle)
import Dict
import FontAwesome as Icon exposing (Icon)
import FontAwesome.Attributes as Icon
import FontAwesome.Brands as Icon
import FontAwesome.Layering as Icon
import FontAwesome.Solid as Icon
import FontAwesome.Styles as Icon
import Html exposing (..)
import Html.Attributes exposing (class, id, style)
import Html.Events exposing (onClick)
import Logic.App.Model exposing (Model)
import Logic.App.Msg exposing (Msg(..))
import Logic.App.Types exposing (Iota(..), Panel(..))
import Logic.App.Utils.GetIotaValue exposing (getIotaValueAsHtmlMsg, getIotaValueAsString)
import Settings.Theme exposing (iotaColorMap)


libraryPanel : Model -> Html Msg
libraryPanel model =
    let
        visibility =
            List.member LibraryPanel model.ui.openPanels
    in
    div [ id "library_panel", class "panel", visibilityToDisplayStyle visibility ]
        (h1 [ class "panel_title" ] [ text "Saved Iotas" ]
            :: renderDict model
        )


renderDict : Model -> List (Html Msg)
renderDict model =
    let
        renderEntry signature value =
            case value of
                ( displayName, _, iota ) ->
                    div [ class "stored_iota_container" ]
                        (div [ class "saved_iota_title" ]
                            [ p [ class "stored_iota_label" ] [ text (displayName ++ " (\"" ++ signature ++ "\")") ]
                            , button
                                [ class "add_button"
                                , onClick (InputPattern signature)
                                ]
                                [ Icon.css
                                , Icon.plus |> Icon.styled [ Icon.xs ] |> Icon.view
                                ]
                            ]
                            :: renderIotaBox iota
                        )
    in
    Dict.map renderEntry model.savedIotas
        |> Dict.values
        |> List.intersperse (div [ class "divider" ] [])


renderIotaBox : Iota -> List (Html msg)
renderIotaBox iota =
    [ div [] (getIotaValueAsHtmlMsg 0 iota 0) ]


renderContents : Array Iota -> List (Html msg)
renderContents stack =
    let
        renderIota index iota =
            getIotaValueAsHtmlMsg index iota 0
    in
    Array.indexedMap renderIota stack
        |> Array.toList
        |> List.concat
