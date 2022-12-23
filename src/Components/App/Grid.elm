module Components.App.Grid exposing (generateGrid, grid, scale)

import Html exposing (..)
import Html.Attributes as Attr
import Logic.App.Model exposing (Model)
import Logic.App.Msg exposing (Msg)
import Logic.App.Types exposing (GridPoint)
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
    in
    List.map (renderPoint gridWidth) (List.concat points)


renderPoint : Float -> GridPoint -> Html msg
renderPoint gridWidth point =
    svg
        [ width (String.fromFloat (point.radius*2))
        , height (String.fromFloat (point.radius*2))
        , viewBox "0 0 300 280"
        , Attr.style "position" "absolute"
        , Attr.style "left" ("calc(100vw - " ++ String.fromFloat gridWidth ++ ")")
        ]
        [ polygon [ points "300,150 225,280 75,280 0,150 75,20 225,20" ] []
        ]



-- settings


scale =
    1


spacing =
    100 * scale


generateGrid : Float -> Float -> List (List GridPoint)
generateGrid gridWidth gridHeight =
    let
        rowCount =
            round (gridHeight / spacing)

        pointCount =
            round (gridWidth / spacing)
    in
    List.map (\x -> List.map (\y -> { x = 100.0, y = 100.0, radius = 8.0, used = False, color = "red" }) (List.repeat pointCount 0)) (List.repeat rowCount 0)
