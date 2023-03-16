module Components.App.Timeline exposing (..)

import Array
import Html exposing (Html, div)
import Html.Attributes as Attr exposing (id)
import Html.Events exposing (onClick)
import Logic.App.Model exposing (Model)
import Logic.App.Msg exposing (Msg(..))
import Logic.App.Types exposing (Timeline)
import Settings.Theme exposing (accent1)
import Svg exposing (polygon, svg)
import Svg.Attributes exposing (fill, height, points, viewBox, width)


timeline : Model -> Html Msg
timeline model =
    div
        [ id "bottom_box"
        ]
        (renderPoints model)


renderPoints : Model -> List (Html Msg)
renderPoints model =
    let
        timelineLength =
            Array.length model.timeline

        spacing =
            (model.grid.width - 50) / (toFloat timelineLength - 1)

        setSpecificAttributes index =
            if index == timelineLength - 1 then
                [ Attr.style "left" (String.fromFloat (model.grid.width - 30) ++ "px"), Attr.style "transform" "scale(200%)" ]

            else if index == 0 then
                [ Attr.style "left" (String.fromFloat 20 ++ "px"), Attr.style "transform" "scale(200%)" ]

            else
                [ Attr.style "left" (String.fromFloat (spacing * toFloat index + 20) ++ "px") ]
    in
    List.repeat timelineLength Nothing
        |> List.indexedMap
            (\index _ ->
                svg
                    ([ width <| String.fromFloat <| 10
                     , height <| String.fromFloat <| 10
                     , viewBox "0 0 300 280"
                     , Attr.style "position" "absolute"
                     , Attr.style "top" (String.fromInt 50 ++ "px")
                     , fill accent1
                     , onClick (SetTimelineIndex (index - 1))
                     ]
                        ++ setSpecificAttributes index
                    )
                    [ polygon [ points "300,150 225,280 75,280 0,150 75,20 225,20" ] []
                    ]
            )
