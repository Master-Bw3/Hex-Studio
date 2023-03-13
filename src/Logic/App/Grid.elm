module Logic.App.Grid exposing (..)

import Components.App.Grid exposing (emptyGridpoint, getGridpointFromOffsetCoordinates)
import List.Extra as List
import Logic.App.Types exposing (Direction(..), Grid, GridPoint, Pattern)
import Logic.App.Utils.DirectionMap exposing (directionMap)
import Logic.App.Utils.LetterMap exposing (letterMap)
import Settings.Theme exposing (accent1)


generateDrawingFromSignature : String -> List (List GridPoint) -> List GridPoint
generateDrawingFromSignature signature grid =
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
            { color = accent1
            , offsetX = Tuple.first coord
            , offsetY = Tuple.second coord
            , betweenOffsetValues = ( ( 0, 0 ), ( 0, 0 ), ( 0, 0 ) )
            }

        gridpointToPointConnection point =
            { color = accent1
            , offsetX = point.offsetX
            , offsetY = point.offsetY
            , betweenOffsetValues = ( ( 0, 0 ), ( 0, 0 ), ( 0, 0 ) )
            }

        getLeftmostAndTopmostValues coord accumulator =
            case coord of
                ( x, y ) ->
                    { x = min x accumulator.x, y = min y accumulator.y }

        leftmostAndTopmostValues =
            Debug.log "lmtm" <| List.foldl getLeftmostAndTopmostValues { x = 0, y = 0 } pathCoords

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
            String.split "" signature
                |> List.foldl signatureToAngles [ East, East ]
                |> List.reverse
                |> List.map directionToCoord
                |> List.foldl coordsToPathCoords []

        pointConnectionToGridPoint point =
            { emptyGridpoint | color = point.color, offsetX = point.offsetX, offsetY = point.offsetY, used = True }
    in
    pathCoords
        |> List.foldl (positionCoords (0 - leftmostAndTopmostValues.x) (0 - leftmostAndTopmostValues.y)) []
        |> List.map
            (\x ->
                x
                    |> coordToPointConnection
                    |> pointConnectionToGridPoint
            )
        |> List.foldr connectPoints ( emptyGridpoint, [] )
        |> Tuple.second



{-
   get points
   move points down until top point == current line point
   move points right until valid
   apply to grid
   connect
-}
