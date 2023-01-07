module Components.App.Grid exposing
    ( addNearbyPoint
    , applyActivePathToGrid
    , distanceBetweenCoordinates
    , generateGrid
    , getClosestPoint
    , grid
    , spacing
    , updateGridPoints
    , updatemidLineOffsets
    )

import Array exposing (Array)
import Html exposing (..)
import Html.Attributes as Attr
import Html.Events.Extra.Mouse as MouseEvent
import Html.Events.Extra.Touch as TouchEvent
import Logic.App.Model exposing (Model)
import Logic.App.Msg exposing (Msg(..))
import Logic.App.Patterns.PatternRegistry exposing (unknownPattern)
import Logic.App.Types exposing (CoordinatePair, GridPoint, PatternType)
import Logic.App.Utils.Utils exposing (touchCoordinates)
import Random
import Settings.Theme exposing (..)
import Svg exposing (Svg, polygon, svg)
import Svg.Attributes exposing (..)



-- settings


spacing scale =
    100 * scale


verticalSpacing scale =
    (spacing scale * sqrt 3.0) / 2


emptyGridpoint =
    { x = 0
    , y = 0
    , offsetX = 0
    , offsetY = 0
    , radius = 0
    , used = False
    , color = ""
    , connectedPoints = []
    }


grid : Model -> Html Msg
grid model =
    div
        [ Attr.id "hex_grid"
        , MouseEvent.onDown (.clientPos >> GridDown)
        , TouchEvent.onStart (touchCoordinates >> GridDown)
        , TouchEvent.onEnd (\_ -> MouseUp)
        ]
        (renderPoints model
            ++ [ svg
                    [ height (String.fromFloat model.grid.height)
                    , width (String.fromFloat model.grid.width)
                    ]
                    (renderDrawingLine model ++ renderActivePath model ++ renderLines model)
               ]
        )


renderDrawingLine : Model -> List (Svg msg)
renderDrawingLine model =
    let
        drawingMode =
            model.grid.drawing.drawingMode

        mousePos =
            model.mousePos

        gridOffset =
            model.window.width - model.grid.width

        activePoint : GridPoint
        activePoint =
            Maybe.withDefault emptyGridpoint (List.head model.grid.drawing.activePath)
    in
    if drawingMode then
        [ renderLine
            model.settings.gridScale
            { x1 = Tuple.first mousePos - gridOffset
            , y1 = Tuple.second mousePos
            , x2 = activePoint.x
            , y2 = activePoint.y
            }
            ( ( 0, 0 ), ( 0, 0 ), ( 0, 0 ) )
        ]

    else
        []


renderActivePath : Model -> List (Svg msg)
renderActivePath model =
    let
        points =
            model.grid.drawing.activePath
    in
    List.map (\x -> renderLine model.settings.gridScale (Tuple.first x) (Tuple.second x)) (List.concatMap (findLinkedPoints model.grid.points) points)


renderLines : Model -> List (Svg msg)
renderLines model =
    let
        points =
            model.grid.points
    in
    List.map (\x -> renderLine model.settings.gridScale (Tuple.first x) (Tuple.second x)) (List.concatMap (findLinkedPoints points) (List.concat points))


renderLine : Float -> CoordinatePair -> ( ( Int, Int ), ( Int, Int ), ( Int, Int ) ) -> Svg msg
renderLine scale coordinatePair offsetsTuple =
    let
        x1 =
            coordinatePair.x1

        y1 =
            coordinatePair.y1

        x2 =
            coordinatePair.x2

        y2 =
            coordinatePair.y2

        rise =
            y2 - y1

        run =
            x2 - x1

        coordsList =
            case offsetsTuple of
                ( ( a1, a2 ), ( b1, b2 ), ( c1, c2 ) ) ->
                    [ [ x1, y1 ]
                    , [ x1 + (0.6 * scale) * toFloat a1 + 0.25 * run, y1 + (0.6 * scale) * toFloat a2 + 0.25 * rise ]
                    , [ x1 + (0.6 * scale) * toFloat b1 + 0.5 * run, y1 + (0.6 * scale) * toFloat b2 + 0.5 * rise ]
                    , [ x1 + (0.6 * scale) * toFloat c1 + 0.75 * run, y1 + (0.6 * scale) * toFloat c2 + 0.75 * rise ]
                    , [ x2, y2 ]
                    ]

        allPointsValid =
            --checks to make sure no points are at (0,0), since that represents a point that doesn't exist
            (( coordinatePair.x1, coordinatePair.y1 ) /= ( 0.0, 0.0 )) && (( coordinatePair.x2, coordinatePair.y2 ) /= ( 0.0, 0.0 ))
    in
    if allPointsValid then
        Svg.path
            [ d <| (++) "M" <| String.join " " <| List.map String.fromFloat <| List.concat coordsList
            , stroke accent2
            , strokeWidth <| String.fromFloat (5.0 * scale)
            , strokeLinecap "round"
            , strokeLinejoin "round"
            , fillOpacity "0"
            ]
            []

    else
        text ""



-- turns a gridPoint into a list of coordinate pairs of the point and connected point


findLinkedPoints : List (List GridPoint) -> GridPoint -> List ( CoordinatePair, ( ( Int, Int ), ( Int, Int ), ( Int, Int ) ) )
findLinkedPoints grid_ point =
    let
        connectedPoints : List ( GridPoint, ( ( Int, Int ), ( Int, Int ), ( Int, Int ) ) )
        connectedPoints =
            List.map (\pnt -> ( getGridpointFromOffsetCoordinates grid_ pnt, pnt.betweenOffsetValues )) point.connectedPoints
    in
    List.map
        (\conPnt ->
            let
                conPntCoords : GridPoint
                conPntCoords =
                    Tuple.first conPnt
            in
            ( { x1 = conPntCoords.x, y1 = conPntCoords.y, x2 = point.x, y2 = point.y }, Tuple.second conPnt )
        )
        connectedPoints


getGridpointFromOffsetCoordinates : List (List GridPoint) -> { offsetX : Int, offsetY : Int, betweenOffsetValues : ( ( Int, Int ), ( Int, Int ), ( Int, Int ) ) } -> GridPoint
getGridpointFromOffsetCoordinates grid_ offsetCoords =
    let
        checkMatchingOffsetCoords point =
            ( point.offsetX, point.offsetY ) == ( offsetCoords.offsetX, offsetCoords.offsetY )
    in
    Maybe.withDefault emptyGridpoint <| List.head <| List.filter checkMatchingOffsetCoords <| List.concat grid_


renderPoints : Model -> List (Html msg)
renderPoints model =
    let
        points =
            model.grid.points

        gridWidth =
            model.grid.width

        mousePos =
            model.mousePos

        gridOffset =
            model.window.width - gridWidth

        scale =
            model.settings.gridScale
    in
    List.concat points
        |> List.map (renderPoint mousePos gridOffset scale)


applyActivePathToGrid : Model -> List (List GridPoint)
applyActivePathToGrid model =
    let
        gridPoints =
            model.grid.points

        activePoints =
            model.grid.drawing.activePath
    in
    applyPathToGrid gridPoints activePoints


applyPathToGrid : List (List GridPoint) -> List GridPoint -> List (List GridPoint)
applyPathToGrid gridPoints pointsToAdd =
    let
        replace : GridPoint -> GridPoint
        replace pnt =
            let
                replacedPnt =
                    List.head <| List.filter (\activePnt -> ( activePnt.offsetX, activePnt.offsetY ) == ( pnt.offsetX, pnt.offsetY )) pointsToAdd
            in
            case replacedPnt of
                Just point ->
                    { pnt | used = True, connectedPoints = point.connectedPoints, color = accent2 }

                Nothing ->
                    pnt

        --find matching points
        --replace grid points with matching active points
    in
    List.map (\row -> List.map replace row) gridPoints


renderPoint : ( Float, Float ) -> Float -> Float -> GridPoint -> Html msg
renderPoint mousePos gridOffset scale point =
    let
        pointScale =
            if point.used == False then
                String.fromFloat (Basics.min 1 (1 / (distanceBetweenCoordinates mousePos ( point.x + gridOffset, point.y ) / 30)))

            else
                String.fromFloat 0
    in
    svg
        [ width <| String.fromFloat <| point.radius * 2
        , height <| String.fromFloat <| point.radius * 2
        , viewBox "0 0 300 280"
        , Attr.style "position" "absolute"
        , Attr.style "left" (String.fromFloat (point.x - (8 * scale)) ++ "px")
        , Attr.style "top" (String.fromFloat (point.y - (8 * scale)))
        , Attr.style "transform" ("scale(" ++ pointScale ++ ")")
        , fill point.color
        ]
        [ polygon [ points "300,150 225,280 75,280 0,150 75,20 225,20" ] []
        ]


addNearbyPoint : Model -> List GridPoint
addNearbyPoint model =
    let
        modelGrid =
            model.grid

        scale =
            model.settings.gridScale

        gridOffset =
            model.window.width - model.grid.width

        offsetMousePos =
            ( Tuple.first model.mousePos - gridOffset, Tuple.second model.mousePos )

        closestGridNode =
            getClosestPoint model.mousePos modelGrid.points model

        closestPoint =
            Maybe.withDefault closestGridNode (List.head <| List.filter (\point -> ( point.x, point.y ) == ( closestGridNode.x, closestGridNode.y )) <| modelGrid.drawing.activePath)

        prevGridNode =
            Maybe.withDefault emptyGridpoint <| List.head modelGrid.drawing.activePath

        otherNodes =
            Maybe.withDefault [] <| List.tail modelGrid.drawing.activePath

        prevNode : GridPoint
        prevNode =
            Maybe.withDefault prevGridNode (List.head <| List.filter (\point -> ( point.x, point.y ) == ( prevGridNode.x, prevGridNode.y )) <| otherNodes)

        prevPrevNode =
            Maybe.withDefault emptyGridpoint <| List.head otherNodes

        pointPrevPrevPoint =
            ( prevPrevNode.x, prevPrevNode.y ) == ( closestPoint.x, closestPoint.y )

        pointNotConnectedToPrevPoint =
            not
                ((List.any (\x -> x == True) <| List.map (\pnt -> ( pnt.offsetX, pnt.offsetY ) == ( closestPoint.offsetX, closestPoint.offsetY )) prevNode.connectedPoints)
                    || (List.any (\x -> x == True) <| List.map (\pnt -> ( pnt.offsetX, pnt.offsetY ) == ( prevNode.offsetX, prevNode.offsetY )) closestPoint.connectedPoints)
                )

        pointNotPrevPoint =
            ( prevNode.x, prevNode.y ) /= ( closestPoint.x, closestPoint.y )

        mouseDistanceCloseToPoint =
            distanceBetweenCoordinates offsetMousePos ( closestPoint.x, closestPoint.y ) <= (spacing scale / 2)

        pointCloseToPrevPoint =
            distanceBetweenCoordinates ( prevNode.x, prevNode.y ) ( closestPoint.x, closestPoint.y ) <= (spacing scale * 1.5)
    in
    if pointPrevPrevPoint then
        -- disconnect the previous point to allow for lines to be undrawn
        { prevPrevNode
            | connectedPoints =
                List.filter
                    (\pnt -> ( pnt.offsetX, pnt.offsetY ) /= ( prevNode.offsetX, prevNode.offsetY ))
                    prevPrevNode.connectedPoints
        }
            :: (Maybe.withDefault [] <| List.tail otherNodes)

    else if
        mouseDistanceCloseToPoint
            && pointCloseToPrevPoint
            && pointNotConnectedToPrevPoint
            && pointNotPrevPoint
            && not closestPoint.used
    then
        [ closestPoint --{ closestPoint | connectedPoints = [ { x = prevNode.x, y = prevNode.y } ] }
        , { prevNode | connectedPoints = { offsetX = closestPoint.offsetX, offsetY = closestPoint.offsetY, betweenOffsetValues = ( ( 0, 0 ), ( 0, 0 ), ( 0, 0 ) ) } :: prevNode.connectedPoints }
        ]
            ++ otherNodes

    else
        modelGrid.drawing.activePath



-- helper functions


getClosestPoint : ( Float, Float ) -> List (List GridPoint) -> Model -> GridPoint
getClosestPoint coordinates points model =
    let
        gridOffset =
            model.window.width - model.grid.width

        offsetCoords =
            ( Tuple.first coordinates - gridOffset, Tuple.second coordinates )

        distanceComparison : GridPoint -> GridPoint -> Order
        distanceComparison a b =
            case compare (distanceBetweenCoordinates ( a.x, a.y ) offsetCoords) (distanceBetweenCoordinates ( b.x, b.y ) offsetCoords) of
                LT ->
                    LT

                EQ ->
                    EQ

                GT ->
                    GT
    in
    Maybe.withDefault emptyGridpoint (List.head (List.sortWith distanceComparison (List.concat points)))


distanceBetweenCoordinates : ( Float, Float ) -> ( Float, Float ) -> Float
distanceBetweenCoordinates a b =
    let
        x1 =
            Tuple.first a

        y1 =
            Tuple.second a

        x2 =
            Tuple.first b

        y2 =
            Tuple.second b
    in
    sqrt ((x1 - x2) ^ 2 + (y1 - y2) ^ 2)


generateGrid : Float -> Float -> Float -> List (List GridPoint)
generateGrid gridWidth gridHeight scale =
    let
        rowCount =
            3 + floor (gridHeight / verticalSpacing scale)

        pointCount =
            3 + floor (gridWidth / spacing scale)
    in
    List.indexedMap
        (\r _ ->
            List.indexedMap
                (\i _ ->
                    let
                        radius =
                            if r >= (rowCount - 3) || (i >= pointCount - 3) then
                                0

                            else
                                8.0 * scale
                    in
                    { x = (spacing scale * toFloat i) + (spacing scale / 2 * toFloat (modBy 2 r)) + ((gridWidth - ((toFloat pointCount - 3.5) * spacing scale)) / 2)
                    , y = (verticalSpacing scale * toFloat r) + ((gridHeight - (toFloat (rowCount - 4) * verticalSpacing scale)) / 2)
                    , offsetX = i * 2 + modBy 2 r
                    , offsetY = r
                    , radius = radius
                    , used = False
                    , color = accent1
                    , connectedPoints = []
                    }
                )
                (List.repeat pointCount 0)
        )
        (List.repeat rowCount 0)



-- TODO: Finish this


updateGridPoints : Float -> Float -> Array ( PatternType, List GridPoint ) -> List (List GridPoint) -> Float -> List (List GridPoint)
updateGridPoints gridWidth gridHeight patternArray maybeGrid scale =
    let
        drawing =
            Tuple.second <| Maybe.withDefault ( unknownPattern, [] ) <| Array.get 0 patternArray

        oldGrid =
            if maybeGrid == [] then
                generateGrid gridWidth gridHeight scale

            else
                maybeGrid

        newGrid =
            applyPathToGrid oldGrid drawing

        tail =
            Array.slice 1 (Array.length patternArray) patternArray
    in
    if Array.length tail == 0 then
        newGrid

    else
        updateGridPoints gridWidth gridHeight tail newGrid scale


updatemidLineOffsets : List (List GridPoint) -> Int -> List (List GridPoint)
updatemidLineOffsets grid_ time =
    let
        randomNum seed =
            if (Tuple.first <| Random.step (Random.int 0 1) <| Random.initialSeed seed) == 0 then
                -1

            else
                1

        offset oldVal amount =
            let
                newVal =
                    oldVal + amount
            in
            if newVal > 8 || newVal < -8 then
                oldVal

            else
                newVal

        updateOffsets : GridPoint -> GridPoint
        updateOffsets point =
            { point
                | connectedPoints =
                    List.map
                        (\conPoint ->
                            case conPoint.betweenOffsetValues of
                                ( ( a1, a2 ), ( b1, b2 ), ( c1, c2 ) ) ->
                                    { conPoint
                                        | betweenOffsetValues =
                                            ( ( offset a1 <| randomNum (time + conPoint.offsetX), offset a2 <| randomNum (time + conPoint.offsetX + 1) )
                                            , ( offset b1 <| randomNum (time + conPoint.offsetY), offset b2 <| randomNum (time + conPoint.offsetY + 1) )
                                            , ( offset c1 <| randomNum (time + conPoint.offsetX + 2), offset c2 <| randomNum (time + conPoint.offsetY + 2) )
                                            )
                                    }
                        )
                        point.connectedPoints
            }
    in
    List.map (\row -> List.map updateOffsets row) grid_
