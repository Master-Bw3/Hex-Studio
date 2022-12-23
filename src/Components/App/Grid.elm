module Components.App.Grid exposing (generateGrid, grid, scale, spacing)

import Html exposing (..)
import Html.Attributes as Attr
import Logic.App.Model exposing (Model)
import Logic.App.Msg exposing (Msg)
import Logic.App.Types exposing (GridPoint)
import Settings.Theme exposing (..)
import Svg exposing (circle, polygon, svg)
import Svg.Attributes exposing (..)


grid : Model -> Html Msg
grid model =
    div [ Attr.id "hex_grid" ] (renderPoints model)


renderPoints : Model -> List (Html msg)
renderPoints model =
    let
        points =
            model.grid.points

        gridWidth =
            model.grid.width

        gridHeight =
            model.grid.height
        mousePos =
            model.mousePos
        gridOffset = model.window.width-gridWidth
    in
    --List.map (renderPoint gridWidth gridHeight mousePos gridOffset) (List.concat points)
    List.concat points
    |> List.map (renderPoint gridWidth gridHeight mousePos gridOffset)


renderPoint : Float -> Float -> (Float, Float) -> Float -> GridPoint -> Html msg
renderPoint gridWidth gridHeight mousePos gridOffset point =
    let
        size = (String.fromFloat (Basics.min 1 (1/(distanceBetweenCoordinates mousePos (point.x+gridOffset, point.y+101)/30)) ))
    in
    svg
        [ width "16"
        , height "16"
        , viewBox "0 0 300 280"
        , Attr.style "position" "absolute"
        , Attr.style "left" ("calc(100vw - " ++ String.fromFloat (gridWidth - point.x) ++ "px)")
        , Attr.style "top" ("calc(100vh - " ++ String.fromFloat (gridHeight - point.y) ++ "px)")
        , Attr.style "transform" ("scale("++size++")")
        , fill accent1
        ]
        [ polygon [ points "300,150 225,280 75,280 0,150 75,20 225,20" ] []
        ]


-- helper functions

distanceBetweenCoordinates a b =
    let
        x1 = Tuple.first a
        y1 = Tuple.second a
        x2 = Tuple.first b
        y2 = Tuple.second b
    in
    sqrt ((x1 - x2) ^ 2 + (y1 - y2) ^ 2)


-- settings


scale =
    1


spacing =
    100 * scale


verticalSpacing =
    (spacing * sqrt 3.0) / 2


generateGrid : Float -> Float -> List (List GridPoint)
generateGrid gridWidth gridHeight =
    let
        rowCount =
            floor (gridHeight / verticalSpacing)

        pointCount =
            floor (gridWidth / spacing)
    in
    --Debug.log (Debug.toString (pointCount * spacing))
        List.indexedMap
        (\r x ->
            List.indexedMap
                (\i y ->
                    { x = (spacing * toFloat i) + (gridWidth - toFloat pointCount * spacing) + (spacing / 2 * toFloat (modBy 2 r))
                    , y = verticalSpacing * toFloat r - verticalSpacing
                    , radius = 8.0
                    , used = False
                    , color = "red"
                    }
                )
                (List.repeat pointCount 0)
        )
        (List.repeat rowCount 0)
