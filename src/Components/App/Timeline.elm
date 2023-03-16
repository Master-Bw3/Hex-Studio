module Components.App.Timeline exposing (..)

import Array
import Html exposing (Html, div, span, text)
import Html.Attributes as Attr exposing (id)
import Html.Events exposing (onClick)
import Logic.App.Model exposing (Model)
import Logic.App.Msg exposing (Msg(..))
import Logic.App.Types exposing (Timeline)
import Logic.App.Utils.Utils exposing (ifThenElse)
import Settings.Theme exposing (accent1, accent2)
import Svg exposing (polygon, svg)
import Svg.Attributes exposing (class, color, fill, height, points, viewBox, width)


timeline : Model -> Html Msg
timeline model =
    div
        [ id "bottom_box"
        ]
        (div [ id "timeline_bar" ] []
            :: renderPoints
                { model
                    | timeline =
                        if Array.length model.timeline < 2 then
                            Array.repeat 2 {stack = Array.empty, patternIndex = -1}

                        else
                            model.timeline
                }
        )


renderPoints : Model -> List (Html Msg)
renderPoints model =
    let
        timelineLength =
            Array.length model.timeline

        currentTime =
            model.timelineIndex == Array.length model.timeline

        spacing =
            (model.grid.width - 50) / (toFloat timelineLength - 1)

        setSpecificAttributes scale index =
            if index == timelineLength - 1 then
                [ Attr.style "left" (String.fromFloat (model.grid.width - 30) ++ "px"), Attr.style "transform" ("scale(" ++ String.fromFloat (200 * scale) ++ "%)") ]

            else if index == 0 then
                [ Attr.style "left" (String.fromFloat 20 ++ "px"), Attr.style "transform" ("scale(" ++ String.fromFloat (200 * scale) ++ "%)") ]

            else
                [ Attr.style "left" (String.fromFloat (spacing * toFloat index + 20) ++ "px"), Attr.style "transform" ("scale(" ++ String.fromFloat (100 * scale) ++ "%)") ]
    in
    List.repeat timelineLength Nothing
        |> List.indexedMap
            (\index _ ->
                div [ ifThenElse (index == model.timelineIndex + 1 || (currentTime && index + 1 == timelineLength)) (class "timeline_point_selected") (class "timeline_point") ]
                    [ svg
                        ([ width <| String.fromFloat <| 12
                         , height <| String.fromFloat <| 12
                         , viewBox "0 0 300 280"
                         , ifThenElse (index == model.timelineIndex + 1 || (currentTime && index + 1 == timelineLength)) (class "timeline_point_outline_selected") (class "timeline_point_outline")
                         , Attr.style "position" "absolute"
                         , Attr.style "top" (String.fromInt 44 ++ "px")
                         , ifThenElse (index == model.timelineIndex + 1 || (currentTime && index + 1 == timelineLength)) (fill accent2) (fill accent1)
                         , onClick (SetTimelineIndex (index - 1))
                         ]
                            ++ setSpecificAttributes 1.7 index
                        )
                        [ polygon [ points "300,150 225,280 75,280 0,150 75,20 225,20" ] []
                        ]
                    , svg
                        ([ width <| String.fromFloat <| 12
                         , height <| String.fromFloat <| 12
                         , viewBox "0 0 300 280"
                         , ifThenElse (index == model.timelineIndex + 1 || (currentTime && index + 1 == timelineLength)) (class "timeline_point_outline_selected") (class "timeline_point_outline")
                         , Attr.style "position" "absolute"
                         , Attr.style "top" (String.fromInt 44 ++ "px")
                         , fill "var(--primary_light)"
                         , onClick (SetTimelineIndex (index - 1))
                         ]
                            ++ setSpecificAttributes 1.3 index
                        )
                        [ polygon [ points "300,150 225,280 75,280 0,150 75,20 225,20" ] []
                        ]
                    , svg
                        ([ width <| String.fromFloat <| 12
                         , height <| String.fromFloat <| 12
                         , viewBox "0 0 300 280"
                         , Attr.style "position" "absolute"
                         , Attr.style "top" (String.fromInt 44 ++ "px")
                         , ifThenElse (index == model.timelineIndex + 1 || (currentTime && index + 1 == timelineLength)) (fill accent2) (fill accent1)
                         , onClick (SetTimelineIndex (index - 1))
                         ]
                            ++ setSpecificAttributes 1 index
                        )
                        [ polygon [ points "300,150 225,280 75,280 0,150 75,20 225,20" ] []
                        ]
                    ]
            )
