module Logic.App.Utils.GetAngleSignature exposing (getAngleSignatureAndStartDir)

import Logic.App.Types exposing (Direction(..), IntCoordinatePair)
import Logic.App.Utils.DirectionMap exposing (directionMap)
import Logic.App.Utils.LetterMap exposing (letterMap)


getAngleSignatureAndStartDir unflippedPath =
    let
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
                |> Maybe.andThen (\x -> Just (Tuple.first x))
                |> Maybe.withDefault ErrorDirection

        directionList =
            List.map2
                (\pnt1 pnt2 -> directionBetweenPoints ( pnt1.offsetX, pnt1.offsetY ) ( pnt2.offsetX, pnt2.offsetY ))
                path
                (Maybe.withDefault [] <| List.tail path)

        getAngleLetter direction1 direction2 =
            letterMap
                |> List.filter (\x -> Tuple.second x == ( direction1, direction2 ))
                |> List.head
                |> Maybe.andThen (\x -> Just (Tuple.first x))
                |> Maybe.withDefault ""
    in
    ( String.concat <|
        List.map2
            (\dir1 dir2 -> getAngleLetter dir1 dir2)
            directionList
            (Maybe.withDefault [] <| List.tail directionList)
    , Maybe.withDefault East (List.head directionList)
    )
