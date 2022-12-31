module Logic.App.Utils.GetAngleSignature exposing (getAngleSignature)

import Logic.App.Types exposing (GridPoint, IntCoordinatePair)



-- get an angle signature from a path (list of connected gridPoints)


type Direction
    = Northeast
    | Northwest
    | East
    | West
    | Southeast
    | Southwest
    | Error


getAngleSignature unflippedPath =
    let
        directionMap =
            [ ( Northeast, ( 1, -1 ) )
            , ( East, ( 2, 0 ) )
            , ( Southeast, ( 1, 1 ) )
            , ( Southwest, ( -1, 1 ) )
            , ( West, ( -2, 0 ) )
            , ( Northwest, ( -1, -1 ) )
            ]

        path =
            List.reverse unflippedPath

        directionVector : IntCoordinatePair -> ( Int, Int )
        directionVector { x1, x2, y1, y2 } =
            ( x2 - x1
            , y2 - y1
            )

        directionBetweenPoints : ( Int, Int ) -> ( Int, Int ) -> Direction
        directionBetweenPoints point1 point2 =
            directionMap
                |> List.filter (\x -> Tuple.second x == directionVector { x1 = Tuple.first point1, y1 = Tuple.second point1, x2 = Tuple.first point2, y2 = Tuple.second point2 })
                |> List.head
                |> Maybe.withDefault ( Error, ( 404, 0 ) )
                --Todo: make this ^ less jank
                |> Tuple.first

        directionList =
                List.map2
                    (\pnt1 pnt2 -> directionBetweenPoints ( pnt1.offsetX, pnt1.offsetY ) ( pnt2.offsetX, pnt2.offsetY ))
                    path
                    (Maybe.withDefault [] <| List.tail path)

        getAngleLetter direction1 direction2 =
            letterMap
                |> List.filter (\x -> Tuple.second x == ( direction1, direction2 ))
                |> List.head
                |> Maybe.withDefault ( "", ( Error, Error ) )
                --Todo: make this ^ less jank
                |> Tuple.first
    in
    String.concat <|
        List.map2
            (\dir1 dir2 -> getAngleLetter dir1 dir2)
            directionList
            (Maybe.withDefault [] <| List.tail directionList)


letterMap =
    [ ( "w", ( East, East ) )
    , ( "a", ( East, Northwest ) )
    , ( "q", ( East, Northeast ) )
    , ( "d", ( East, Southwest ) )
    , ( "e", ( East, Southeast ) )
    , ( "e", ( Northeast, East ) )
    , ( "q", ( Northeast, Northwest ) )
    , ( "a", ( Northeast, West ) )
    , ( "w", ( Northeast, Northeast ) )
    , ( "d", ( Northeast, Southeast ) )
    , ( "d", ( Northwest, East ) )
    , ( "w", ( Northwest, Northwest ) )
    , ( "q", ( Northwest, West ) )
    , ( "e", ( Northwest, Northeast ) )
    , ( "a", ( Northwest, Southwest ) )
    , ( "d", ( West, Northeast ) )
    , ( "e", ( West, Northwest ) )
    , ( "w", ( West, West ) )
    , ( "q", ( West, Southeast ) )
    , ( "a", ( West, Southwest ) )
    , ( "a", ( Southwest, East ) )
    , ( "d", ( Southwest, Northwest ) )
    , ( "e", ( Southwest, West ) )
    , ( "q", ( Southwest, Southeast ) )
    , ( "w", ( Southwest, Southwest ) )
    , ( "q", ( Southeast, East ) )
    , ( "a", ( Southeast, Northeast ) )
    , ( "d", ( Southeast, West ) )
    , ( "w", ( Southeast, Southeast ) )
    , ( "e", ( Southeast, Southwest ) )
    ]
