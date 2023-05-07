module Components.App.Panels.LibraryPanel exposing (..)

import Array exposing (Array)
import Components.App.Panels.Utils exposing (visibilityToDisplayStyle)
import Dict exposing (Dict)
import FontAwesome as Icon exposing (Icon)
import FontAwesome.Attributes as Icon
import FontAwesome.Brands as Icon
import FontAwesome.Layering as Icon
import FontAwesome.Solid as Icon
import FontAwesome.Styles as Icon
import Html exposing (..)
import Html.Attributes exposing (class, id, placeholder, style, type_, value)
import Html.Events exposing (onClick, onInput)
import Logic.App.Model exposing (Model)
import Logic.App.Msg exposing (Msg(..))
import Logic.App.Types exposing (Iota(..), Panel(..))
import Logic.App.Utils.GetIotaValue exposing (getIotaValueAsHtmlMsg, getIotaValueAsString)
import Logic.App.Utils.Utils exposing (ifThenElse)
import Settings.Theme exposing (iotaColorMap)


libraryPanel : Model -> Html Msg
libraryPanel model =
    let
        visibility =
            List.member LibraryPanel model.ui.openPanels

        ( x, y, z ) =
            model.ui.libraryInputField
    in
    div [ id "library_panel", class "panel", visibilityToDisplayStyle visibility ]
        ([ h1 [ class "panel_title" ] [ text "Akashic Libraries" ]
         , div [ class "input_label_box" ]
            [ input [ placeholder "0", type_ "number", value x, onInput (\val -> UpdateLibraryInputField val y z) ] []
            , input [ placeholder "0", type_ "number", value y, onInput (\val -> UpdateLibraryInputField x val z) ] []
            , input [ placeholder "0", type_ "number", value z, onInput (\val -> UpdateLibraryInputField x y val) ] []
            , button
                [ class "add_button"
                , onClick (AddLibrary model.ui.libraryInputField)
                ]
                [ Icon.css
                , Icon.plus |> Icon.styled [ Icon.sm ] |> Icon.view
                ]
            ]
         ]
            ++ renderLibraryDict model
        )


renderLibraryDict : Model -> List (Html Msg)
renderLibraryDict model =
    let
        renderEntry location entry =
            case entry of
                ( signature, iota ) ->
                    div [ class "stored_iota_container" ]
                        (div [ class "saved_iota_title" ]
                            [ button
                                [ class "trash_button"
                                , onClick (RemoveLibraryEntry location signature)
                                ]
                                [ Icon.css
                                , Icon.trash |> Icon.styled [ Icon.xs ] |> Icon.view
                                ]
                            , label
                                [ class "stored_iota_label"
                                ]
                                [ text ("Pattern \"" ++ signature ++ "\"") ]
                            ]
                            :: renderIotaBox (Maybe.withDefault Null iota)
                        )

        renderLibrary : ( Int, Int, Int ) -> Dict String (Maybe Iota) -> Html Msg
        renderLibrary location library =
            case location of
                ( x, y, z ) ->
                    div []
                        (h1 [ class "library_label" ]
                            [ button
                                [ class "trash_button"
                                , style "margin-left" "0.15em"
                                , style "margin-right" "0.2em"
                                , onClick (RemoveLibrary location)
                                ]
                                [ Icon.css
                                , Icon.trash |> Icon.styled [ Icon.xs ] |> Icon.view
                                ]
                            , text ("[" ++ String.fromInt x ++ ", " ++ String.fromInt y ++ ", " ++ String.fromInt z ++ "]")
                            ]
                            :: (List.map (renderEntry location) <| Dict.toList library)
                        )
    in
    Dict.map renderLibrary model.castingContext.libraries
        |> Dict.values


renderIotaBox : Iota -> List (Html msg)
renderIotaBox iota =
    [ div []
        [ div [ class "iota_box", style "margin-left" "0.6em", style "margin-right" "0.6em" ] (getIotaValueAsHtmlMsg 0 iota 0)
        ]
    ]


renderContents : Array Iota -> List (Html msg)
renderContents stack =
    let
        renderIota index iota =
            getIotaValueAsHtmlMsg index iota 0
    in
    Array.indexedMap renderIota stack
        |> Array.toList
        |> List.concat
