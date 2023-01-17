module Logic.App.Patterns.Math exposing (..)

import Array exposing (Array)
import Length
import Logic.App.Patterns.OperatorUtils exposing (action2Inputs, action3Inputs, getNumber, getNumberOrVector, getVector)
import Logic.App.Types exposing (Iota(..), Mishap(..))
import Quantity exposing (Quantity(..))
import Vector3d as Vec3d
import Area exposing (Area)


add : Array Iota -> Array Iota
add stack =
    let
        action iota1 iota2 =
            case ( iota1, iota2 ) of
                ( Number number1, Number number2 ) ->
                    Number (number1 + number2)
                        |> Array.repeat 1

                ( Number number, Vector vector ) ->
                    case vector of
                        ( x, y, z ) ->
                            Vector
                                ( number + x
                                , number + y
                                , number + z
                                )
                                |> Array.repeat 1

                ( Vector vector, Number number ) ->
                    case vector of
                        ( x, y, z ) ->
                            Vector
                                ( x + number
                                , y + number
                                , z + number
                                )
                                |> Array.repeat 1

                ( Vector vector1, Vector vector2 ) ->
                    case ( vector1, vector2 ) of
                        ( ( x1, y1, z1 ), ( x2, y2, z2 ) ) ->
                            Vector
                                ( x1 + x2
                                , y1 + y2
                                , z1 + z2
                                )
                                |> Array.repeat 1

                _ ->
                    Garbage CatastrophicFailure
                        |> Array.repeat 1
    in
    action2Inputs stack getNumberOrVector getNumberOrVector action


subtract : Array Iota -> Array Iota
subtract stack =
    let
        action iota1 iota2 =
            case ( iota1, iota2 ) of
                ( Number number1, Number number2 ) ->
                    Number (number1 - number2)
                        |> Array.repeat 1

                ( Number number, Vector vector ) ->
                    case vector of
                        ( x, y, z ) ->
                            Vector
                                ( number - x
                                , number - y
                                , number - z
                                )
                                |> Array.repeat 1

                ( Vector vector, Number number ) ->
                    case vector of
                        ( x, y, z ) ->
                            Vector
                                ( x - number
                                , y - number
                                , z - number
                                )
                                |> Array.repeat 1

                ( Vector vector1, Vector vector2 ) ->
                    case ( vector1, vector2 ) of
                        ( ( x1, y1, z1 ), ( x2, y2, z2 ) ) ->
                            Vector
                                ( x1 - x2
                                , y1 - y2
                                , z1 - z2
                                )
                                |> Array.repeat 1

                _ ->
                    Garbage CatastrophicFailure
                        |> Array.repeat 1
    in
    action2Inputs stack getNumberOrVector getNumberOrVector action


mulDot : Array Iota -> Array Iota
mulDot stack =
    let
        action iota1 iota2 =
            case ( iota1, iota2 ) of
                ( Number number1, Number number2 ) ->
                    Number (number1 * number2)
                        |> Array.repeat 1

                ( Number number, Vector vector ) ->
                    case vector of
                        ( x, y, z ) ->
                            Vector
                                ( number * x
                                , number * y
                                , number * z
                                )
                                |> Array.repeat 1

                ( Vector vector, Number number ) ->
                    case vector of
                        ( x, y, z ) ->
                            Vector
                                ( x * number
                                , y * number
                                , z * number
                                )
                                |> Array.repeat 1

                ( Vector vector1, Vector vector2 ) ->
                    let
                        vec1 =
                            Vec3d.fromTuple Length.meters vector1

                        vec2 =
                            Vec3d.fromTuple Length.meters vector2
                    in
                    case vec1 |> Vec3d.dot vec2 of
                        Quantity number ->
                            Number number
                                |> Array.repeat 1

                _ ->
                    Garbage CatastrophicFailure
                        |> Array.repeat 1
    in
    action2Inputs stack getNumberOrVector getNumberOrVector action


divCross : Array Iota -> Array Iota
divCross stack =
    let
        action iota1 iota2 =
            case ( iota1, iota2 ) of
                ( Number number1, Number number2 ) ->
                    Number (number1 / number2)
                        |> Array.repeat 1

                ( Number number, Vector vector ) ->
                    case vector of
                        ( x, y, z ) ->
                            Vector
                                ( number / x
                                , number / y
                                , number / z
                                )
                                |> Array.repeat 1

                ( Vector vector, Number number ) ->
                    case vector of
                        ( x, y, z ) ->
                            Vector
                                ( x / number
                                , y / number
                                , z / number
                                )
                                |> Array.repeat 1

                ( Vector vector1, Vector vector2 ) ->
                    let
                        vec1 =
                            Vec3d.fromTuple Length.meters vector1

                        vec2 =
                            Vec3d.fromTuple Length.meters vector2

                        newVec =
                            Vec3d.toTuple Area.inSquareMeters (vec1 |> Vec3d.cross vec2)
                    in
                    Vector newVec
                        |> Array.repeat 1

                _ ->
                    Garbage CatastrophicFailure
                        |> Array.repeat 1
    in
    action2Inputs stack getNumberOrVector getNumberOrVector action


constructVector : Array Iota -> Array Iota
constructVector stack =
    let
        action iota1 iota2 iota3 =
            case ( iota1, iota2, iota3 ) of
                ( Number number1, Number number2, Number number3 ) ->
                    Vector ( number1, number2, number3 )
                        |> Array.repeat 1

                _ ->
                    Garbage CatastrophicFailure
                        |> Array.repeat 1
    in
    action3Inputs stack getNumber getNumber getNumber action
