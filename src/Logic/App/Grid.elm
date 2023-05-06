module Logic.App.Grid exposing (..)

import Array exposing (Array)
import List.Extra as List
import Logic.App.Model exposing (Model)
import Logic.App.Types exposing (Direction(..), Grid, GridPoint, Pattern)
import Logic.App.Utils.DirectionMap exposing (directionMap)
import Logic.App.Utils.LetterMap exposing (letterMap)
import Logic.App.Utils.Utils exposing (unshift)
import Settings.Theme exposing (accent1, accent2)


updateCoords : List (List GridPoint) -> List GridPoint -> List GridPoint
updateCoords gridPoints pointsToUpdate =
    let
        update : GridPoint -> List GridPoint -> List GridPoint
        update pnt accumulator =
            let
                replacedPnt =
                    List.concat gridPoints
                        |> List.filter (\activePnt -> ( activePnt.offsetX, activePnt.offsetY ) == ( pnt.offsetX, pnt.offsetY ))
                        |> List.head
            in
            case replacedPnt of
                Just point ->
                    { pnt | used = True, color = accent2, x = point.x, y = point.y } :: accumulator

                Nothing ->
                    accumulator

        --find matching points
        --replace grid points with matching active points
    in
    List.foldl update [] pointsToUpdate


applyUsedPointsToGrid : List (List GridPoint) -> List GridPoint -> List (List GridPoint)
applyUsedPointsToGrid gridPoints pointsToChange =
    let
        replace : GridPoint -> GridPoint
        replace pnt =
            let
                replacedPnt =
                    List.head <| List.filter (\activePnt -> ( activePnt.offsetX, activePnt.offsetY ) == ( pnt.offsetX, pnt.offsetY )) pointsToChange
            in
            case replacedPnt of
                Just _ ->
                    { pnt | used = True }

                Nothing ->
                    pnt

        --find matching points
        --replace grid points with matching active points
    in
    List.map (\row -> List.map replace row) gridPoints


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


clearGrid : List (List GridPoint) -> List (List GridPoint)
clearGrid points =
    List.map
        (\row ->
            List.map
                (\point ->
                    { point
                        | used = False
                        , color = accent1
                        , connectedPoints = []
                    }
                )
                row
        )
        points


drawPatterns : Array Pattern -> Grid -> { grid : Grid, patternArray : Array ( Pattern, List GridPoint ) }
drawPatterns patterns grid =
    let
        gridOffsetWidth =
            List.head grid.points
                |> Maybe.withDefault []
                |> List.length
                |> (*) 2
                |> (+) -6

        addPatternToGrid pattern accumulator =
            let
                attemptDrawPatternResult =
                    drawPattern accumulator.xOffset accumulator.yOffset pattern

                drawPatternResult =
                    if attemptDrawPatternResult.rightBound < gridOffsetWidth then
                        { yOffset = accumulator.yOffset
                        , rightBound = attemptDrawPatternResult.rightBound
                        , bottomBound = attemptDrawPatternResult.bottomBound
                        , points = updateCoords grid.points attemptDrawPatternResult.points
                        }

                    else
                        let
                            drawPatternResultOld =
                                drawPattern 0 (accumulator.currentLowestY + 1) pattern
                        in
                        { yOffset = accumulator.currentLowestY + 1
                        , rightBound = drawPatternResultOld.rightBound
                        , bottomBound = drawPatternResultOld.bottomBound
                        , points = updateCoords grid.points drawPatternResultOld.points
                        }
            in
            { xOffset = drawPatternResult.rightBound + 1
            , yOffset = drawPatternResult.yOffset
            , currentLowestY = max accumulator.currentLowestY drawPatternResult.bottomBound
            , points = accumulator.points ++ drawPatternResult.points
            , patternArray = unshift ( pattern, drawPatternResult.points ) accumulator.patternArray
            }

        drawPatternsResult =
            Array.foldr addPatternToGrid { xOffset = 0, yOffset = 0, currentLowestY = 0, points = [], patternArray = Array.empty } patterns
    in
    { grid =
        { grid
            | drawnPoints = drawPatternsResult.points
            , points = applyUsedPointsToGrid (clearGrid grid.points) drawPatternsResult.points
        }

    -- { grid
    --     | points = applyPathToGrid (clearGrid grid.points) drawPatternsResult.points
    -- }
    , patternArray = drawPatternsResult.patternArray
    }


drawPattern : Int -> Int -> Pattern -> { points : List GridPoint, bottomBound : Int, rightBound : Int }
drawPattern xOffset yOffset pattern =
    let
        getNextDirection prevDirection angle =
            List.filter
                (\mapItem ->
                    case mapItem of
                        ( letter, direction ) ->
                            if letter == angle && Tuple.first direction == prevDirection then
                                True

                            else
                                False
                )
                letterMap
                |> List.head
                |> Maybe.withDefault ( "", ( ErrorDirection, ErrorDirection ) )
                |> Tuple.second
                |> Tuple.second

        signatureToAngles angle accumulator =
            getNextDirection (Maybe.withDefault East (List.head accumulator)) angle :: accumulator

        directionToCoord direction =
            List.filter
                (\mapItem ->
                    case mapItem of
                        ( dir, _ ) ->
                            if dir == direction then
                                True

                            else
                                False
                )
                directionMap
                |> List.head
                |> Maybe.withDefault ( ErrorDirection, ( 0, 0 ) )
                |> Tuple.second

        coordsToPathCoords coord accumulator =
            case List.head accumulator of
                Just prevPoint ->
                    ( Tuple.first coord + Tuple.first prevPoint
                    , Tuple.second coord + Tuple.second prevPoint
                    )
                        :: accumulator

                Nothing ->
                    [ ( Tuple.first coord - 2, Tuple.second coord ) ]

        coordToPointConnection coord =
            { color = pattern.color
            , offsetX = Tuple.first coord
            , offsetY = Tuple.second coord
            , betweenOffsetValues = ( ( 0, 0 ), ( 0, 0 ), ( 0, 0 ) )
            }

        gridpointToPointConnection point =
            { color = pattern.color
            , offsetX = point.offsetX
            , offsetY = point.offsetY
            , betweenOffsetValues = ( ( 0, 0 ), ( 0, 0 ), ( 0, 0 ) )
            }

        getLeftmostAndTopmostValues coord accumulator =
            case coord of
                ( x, y ) ->
                    { x = min x accumulator.x, y = min y accumulator.y }

        leftmostAndTopmostValues =
            List.foldl getLeftmostAndTopmostValues { x = 0, y = 0 } pathCoords

        positionCoords leftBound topBound coord accumulator =
            let
                offsetBounds =
                    if modBy 2 leftBound == modBy 2 topBound then
                        ( leftBound, topBound )

                    else
                        ( leftBound + 1, topBound )
            in
            case offsetBounds of
                ( offsetLeftBound, offsetTopBound ) ->
                    ( Tuple.first coord + offsetLeftBound
                    , Tuple.second coord + offsetTopBound
                    )
                        :: accumulator

        connectPoints : GridPoint -> ( GridPoint, List GridPoint ) -> ( GridPoint, List GridPoint )
        connectPoints point accumulator =
            let
                prevPoint =
                    Tuple.first accumulator

                drawing =
                    Tuple.second accumulator
            in
            case List.head drawing of
                Just _ ->
                    if List.any (\x -> ( x.offsetX, x.offsetY ) == ( point.offsetX, point.offsetY )) drawing then
                        ( point
                        , List.map
                            (\x ->
                                if ( x.offsetX, x.offsetY ) == ( point.offsetX, point.offsetY ) then
                                    { x | connectedPoints = gridpointToPointConnection prevPoint :: x.connectedPoints }

                                else
                                    x
                            )
                            drawing
                        )

                    else
                        ( point, { point | connectedPoints = [ gridpointToPointConnection prevPoint ] } :: drawing )

                Nothing ->
                    ( point, point :: drawing )

        pathCoords =
            String.split "" pattern.signature
                |> List.foldl signatureToAngles [ pattern.startDirection, pattern.startDirection ]
                |> List.reverse
                |> List.map directionToCoord
                |> List.foldl coordsToPathCoords []

        pointConnectionToGridPoint point =
            { emptyGridpoint | color = point.color, offsetX = point.offsetX, offsetY = point.offsetY, used = True }

        bottomAndRightBound =
            List.foldl (positionCoords (xOffset - leftmostAndTopmostValues.x) (yOffset - leftmostAndTopmostValues.y)) [] pathCoords
                |> List.foldl getbottomAndRightBound { right = 0, bottom = 0 }

        getbottomAndRightBound coord accumulator =
            case coord of
                ( x, y ) ->
                    { right = max x accumulator.right, bottom = max y accumulator.bottom }

        grid =
            pathCoords
                |> List.foldl (positionCoords (xOffset - leftmostAndTopmostValues.x) (yOffset - leftmostAndTopmostValues.y)) []
                |> List.map
                    (\x ->
                        x
                            |> coordToPointConnection
                            |> pointConnectionToGridPoint
                    )
                |> List.foldr connectPoints ( emptyGridpoint, [] )
                |> Tuple.second
    in
    { points = grid, bottomBound = bottomAndRightBound.bottom, rightBound = bottomAndRightBound.right }


sortPatterns : Model -> Model
sortPatterns model =
    let
        drawPatternsResult =
            drawPatterns (Array.map Tuple.first model.patternArray) model.grid
    in
    { model
        | grid = drawPatternsResult.grid
        , patternArray = drawPatternsResult.patternArray
    }


gridpointToMidpoints : GridPoint -> List ( Float, Float )
gridpointToMidpoints gridPoint =
    List.map
        (\connection ->
            ( toFloat (gridPoint.offsetX + connection.offsetX) / 2
            , toFloat (gridPoint.offsetY + connection.offsetY) / 2
            )
        )
        gridPoint.connectedPoints



-- returns the points relative to the geometric center of the shape


centerMidpoints : List ( Float, Float ) -> List ( Float, Float )
centerMidpoints points =
    let
        getLeftmostAndTopmostValues coord accumulator =
            ( min (Tuple.first coord) (Tuple.first accumulator), min (Tuple.second coord) (Tuple.second accumulator) )

        leftmostAndTopmostValues =
            List.foldl getLeftmostAndTopmostValues ( 0.0, 0.0 ) points

        getRightmostAndBottommostValues coord accumulator =
            ( max (Tuple.first coord) (Tuple.first accumulator), max (Tuple.second coord) (Tuple.second accumulator) )

        rightmostAndBottommostValues =
            List.foldl getRightmostAndBottommostValues ( 0.0, 0.0 ) points

        center =
            ( (Tuple.first leftmostAndTopmostValues + Tuple.first rightmostAndBottommostValues) / 2
            , (Tuple.second leftmostAndTopmostValues + Tuple.second rightmostAndBottommostValues) / 2
            )
    in
    List.map
        (\point ->
            ( Tuple.first point - Tuple.first center
            , Tuple.second point - Tuple.second center
            )
        )
        points
