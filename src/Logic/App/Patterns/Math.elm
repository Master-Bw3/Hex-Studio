module Logic.App.Patterns.Math exposing (..)

import Area exposing (Area)
import Array exposing (Array)
import Length
import Logic.App.Patterns.OperatorUtils exposing (action1Input, action2Inputs, action3Inputs, getNumber, getNumberOrVector, getVector)
import Logic.App.Types exposing (Iota(..), Mishap(..))
import Quantity exposing (Quantity(..))
import Svg.Attributes exposing (azimuth)
import Vector3d as Vec3d


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
                    vec1
                        |> Vec3d.dot vec2
                        |> Quantity.unwrap
                        |> Number
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


absLen : Array Iota -> Array Iota
absLen stack =
    let
        action iota =
            case iota of
                Number number ->
                    Number (abs number)
                        |> Array.repeat 1

                Vector vector ->
                    let
                        length =
                            Vec3d.fromTuple Length.meters vector
                                |> Vec3d.length
                                |> Quantity.unwrap
                    in
                    Number length
                        |> Array.repeat 1

                _ ->
                    Garbage CatastrophicFailure
                        |> Array.repeat 1
    in
    action1Input stack getNumberOrVector action


powProj : Array Iota -> Array Iota
powProj stack =
    let
        action iota1 iota2 =
            case ( iota1, iota2 ) of
                ( Number number1, Number number2 ) ->
                    Number (number1 ^ number2)
                        |> Array.repeat 1

                ( Number number, Vector vector ) ->
                    case vector of
                        ( x, y, z ) ->
                            Vector
                                ( number ^ x
                                , number ^ y
                                , number ^ z
                                )
                                |> Array.repeat 1

                ( Vector vector, Number number ) ->
                    case vector of
                        ( x, y, z ) ->
                            Vector
                                ( x ^ number
                                , y ^ number
                                , z ^ number
                                )
                                |> Array.repeat 1

                ( Vector vector1Tuple, Vector vector2Tuple ) ->
                    let
                        vector1 =
                            Vec3d.fromTuple Length.meters vector1Tuple

                        vector2 =
                            Vec3d.fromTuple Length.meters vector2Tuple

                        mapFunction number =
                            --idk what to call this function
                            number * Quantity.unwrap (vector2 |> Vec3d.dot vector1) / Quantity.unwrap (vector1 |> Vec3d.dot vector1)
                    in
                    case vector1Tuple of
                        ( x, y, z ) ->
                            Vector ( mapFunction x, mapFunction y, mapFunction z )
                                |> Array.repeat 1

                _ ->
                    Garbage CatastrophicFailure
                        |> Array.repeat 1
    in
    action2Inputs stack getNumberOrVector getNumberOrVector action


floorAction : Array Iota -> Array Iota
floorAction stack =
    let
        action iota =
            case iota of
                Number number ->
                    Number (toFloat (floor number))
                        |> Array.repeat 1

                _ ->
                    Garbage CatastrophicFailure
                        |> Array.repeat 1
    in
    action1Input stack getNumber action


ceilAction : Array Iota -> Array Iota
ceilAction stack =
    let
        action iota =
            case iota of
                Number number ->
                    Number (toFloat (ceiling number))
                        |> Array.repeat 1

                _ ->
                    Garbage CatastrophicFailure
                        |> Array.repeat 1
    in
    action1Input stack getNumber action


coerceAxial : Array Iota -> Array Iota
coerceAxial stack =
    let
        action iota =
            case iota of
                Vector vector ->
                    case vector of
                        ( x, y, z ) ->
                            let
                                magnitude =
                                    sqrt (x ^ 2 + y ^ 2 + z ^ 2)

                                azimuth =
                                    acos (z / magnitude)

                                theta =
                                    atan (y / x)

                                snapped_azimuth =
                                    (pi / 2) * (toFloat <| round (azimuth / (pi / 2)))

                                snapped_theta =
                                    (pi / 2) * (toFloat <| round (theta / (pi / 2)))
                            in
                            ( toFloat <| round <| sin snapped_azimuth * cos snapped_theta
                            , toFloat <| round <| sin snapped_azimuth * sin snapped_theta
                            , toFloat <| round <| cos snapped_azimuth
                            )
                                |> Vector
                                |> Array.repeat 1

                _ ->
                    Garbage CatastrophicFailure
                        |> Array.repeat 1
    in
    action1Input stack getVector action


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
