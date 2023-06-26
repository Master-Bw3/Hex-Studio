module Logic.App.Patterns.Math exposing (..)

import Area
import Array exposing (Array)
import Bitwise
import Length
import LineSegment2d exposing (vector)
import Logic.App.Patterns.OperatorUtils exposing (action1Input, action2Inputs, action3Inputs, checkEquality, getAny, getBoolean, getInteger, getIntegerOrList, getIotaList, getNumber, getNumberOrVector, getVector)
import Logic.App.Types exposing (ActionResult, CastingContext, Iota(..), Mishap(..))
import Quantity exposing (Quantity(..))
import Svg.Attributes exposing (azimuth)
import Vector3d as Vec3d


add : Array Iota -> CastingContext -> ActionResult
add stack ctx =
    let
        action iota1 iota2 _ =
            ( case ( iota1, iota2 ) of
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
            , ctx
            )
    in
    action2Inputs stack ctx getNumberOrVector getNumberOrVector action


subtract : Array Iota -> CastingContext -> ActionResult
subtract stack ctx =
    let
        action iota1 iota2 _ =
            ( case ( iota1, iota2 ) of
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
            , ctx
            )
    in
    action2Inputs stack ctx getNumberOrVector getNumberOrVector action


mulDot : Array Iota -> CastingContext -> ActionResult
mulDot stack ctx =
    let
        action iota1 iota2 _ =
            ( case ( iota1, iota2 ) of
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
            , ctx
            )
    in
    action2Inputs stack ctx getNumberOrVector getNumberOrVector action


divCross : Array Iota -> CastingContext -> ActionResult
divCross stack ctx =
    let
        action iota1 iota2 _ =
            ( case ( iota1, iota2 ) of
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
            , ctx
            )
    in
    action2Inputs stack ctx getNumberOrVector getNumberOrVector action


absLen : Array Iota -> CastingContext -> ActionResult
absLen stack ctx =
    let
        action iota _ =
            ( case iota of
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
            , ctx
            )
    in
    action1Input stack ctx getNumberOrVector action


powProj : Array Iota -> CastingContext -> ActionResult
powProj stack ctx =
    let
        action iota1 iota2 _ =
            ( case ( iota1, iota2 ) of
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
            , ctx
            )
    in
    action2Inputs stack ctx getNumberOrVector getNumberOrVector action


floorAction : Array Iota -> CastingContext -> ActionResult
floorAction stack ctx =
    let
        action iota _ =
            ( case iota of
                Number number ->
                    Number (toFloat (floor number))
                        |> Array.repeat 1

                _ ->
                    Garbage CatastrophicFailure
                        |> Array.repeat 1
            , ctx
            )
    in
    action1Input stack ctx getNumber action


ceilAction : Array Iota -> CastingContext -> ActionResult
ceilAction stack ctx =
    let
        action iota _ =
            ( case iota of
                Number number ->
                    Number (toFloat (ceiling number))
                        |> Array.repeat 1

                _ ->
                    Garbage CatastrophicFailure
                        |> Array.repeat 1
            , ctx
            )
    in
    action1Input stack ctx getNumber action


coerceAxial : Array Iota -> CastingContext -> ActionResult
coerceAxial stack ctx =
    let
        action iota _ =
            ( case iota of
                Vector vector ->
                    if checkEquality iota (Vector ( 0.0, 0.0, 0.0 )) then
                        Vector vector
                        |> Array.repeat 1

                    else
                        case vector of
                            ( x, y, z ) ->
                                let
                                    magnitude =
                                        sqrt (x ^ 2 + y ^ 2 + z ^ 2)

                                    azimuth =
                                        acos (z / magnitude)

                                    theta =
                                        atan2 y x

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
            , ctx
            )
    in
    action1Input stack ctx getVector action


sine : Array Iota -> CastingContext -> ActionResult
sine stack ctx =
    let
        action iota _ =
            ( case iota of
                Number number ->
                    Number (sin number)
                        |> Array.repeat 1

                _ ->
                    Garbage CatastrophicFailure
                        |> Array.repeat 1
            , ctx
            )
    in
    action1Input stack ctx getNumber action


cosine : Array Iota -> CastingContext -> ActionResult
cosine stack ctx =
    let
        action iota _ =
            ( case iota of
                Number number ->
                    Number (cos number)
                        |> Array.repeat 1

                _ ->
                    Garbage CatastrophicFailure
                        |> Array.repeat 1
            , ctx
            )
    in
    action1Input stack ctx getNumber action


tangent : Array Iota -> CastingContext -> ActionResult
tangent stack ctx =
    let
        action iota _ =
            ( case iota of
                Number number ->
                    Number (tan number)
                        |> Array.repeat 1

                _ ->
                    Garbage CatastrophicFailure
                        |> Array.repeat 1
            , ctx
            )
    in
    action1Input stack ctx getNumber action


arcsin : Array Iota -> CastingContext -> ActionResult
arcsin stack ctx =
    let
        action iota _ =
            ( case iota of
                Number number ->
                    Number (asin number)
                        |> Array.repeat 1

                _ ->
                    Garbage CatastrophicFailure
                        |> Array.repeat 1
            , ctx
            )
    in
    action1Input stack ctx getNumber action


arccos : Array Iota -> CastingContext -> ActionResult
arccos stack ctx =
    let
        action iota _ =
            ( case iota of
                Number number ->
                    Number (acos number)
                        |> Array.repeat 1

                _ ->
                    Garbage CatastrophicFailure
                        |> Array.repeat 1
            , ctx
            )
    in
    action1Input stack ctx getNumber action


arctan : Array Iota -> CastingContext -> ActionResult
arctan stack ctx =
    let
        action iota _ =
            ( case iota of
                Number number ->
                    Number (atan number)
                        |> Array.repeat 1

                _ ->
                    Garbage CatastrophicFailure
                        |> Array.repeat 1
            , ctx
            )
    in
    action1Input stack ctx getNumber action


logarithm : Array Iota -> CastingContext -> ActionResult
logarithm stack ctx =
    let
        action iota1 iota2 _ =
            ( case ( iota1, iota2 ) of
                ( Number number1, Number number2 ) ->
                    Number (logBase number2 number1)
                        |> Array.repeat 1

                _ ->
                    Garbage CatastrophicFailure
                        |> Array.repeat 1
            , ctx
            )
    in
    action2Inputs stack ctx getNumber getNumber action


modulo : Array Iota -> CastingContext -> ActionResult
modulo stack ctx =
    let
        action iota1 iota2 _ =
            ( case ( iota1, iota2 ) of
                ( Number number1, Number number2 ) ->
                    Number (Quantity.unwrap <| Quantity.fractionalRemainderBy (Quantity number2) (Quantity number1))
                        |> Array.repeat 1

                _ ->
                    Garbage CatastrophicFailure
                        |> Array.repeat 1
            , ctx
            )
    in
    action2Inputs stack ctx getNumber getNumber action


andBit : Array Iota -> CastingContext -> ActionResult
andBit stack ctx =
    let
        action iota1 iota2 _ =
            ( case ( iota1, iota2 ) of
                ( Number number1, Number number2 ) ->
                    Number (toFloat <| Bitwise.and (round number1) (round number2))
                        |> Array.repeat 1

                ( IotaList list1, IotaList list2 ) ->
                    Array.filter (\iota -> List.any (checkEquality iota) <| Array.toList list2) list1
                        |> IotaList
                        |> Array.repeat 1

                _ ->
                    Garbage CatastrophicFailure
                        |> Array.repeat 1
            , ctx
            )
    in
    action2Inputs stack ctx getIntegerOrList getIntegerOrList action


orBit : Array Iota -> CastingContext -> ActionResult
orBit stack ctx =
    let
        action iota1 iota2 _ =
            ( case ( iota1, iota2 ) of
                ( Number number1, Number number2 ) ->
                    Number (toFloat <| Bitwise.or (round number1) (round number2))
                        |> Array.repeat 1

                ( IotaList list1, IotaList list2 ) ->
                    Array.filter (\iota -> not <| List.any (checkEquality iota) <| Array.toList list1) list2
                        |> Array.append list1
                        |> IotaList
                        |> Array.repeat 1

                _ ->
                    Garbage CatastrophicFailure
                        |> Array.repeat 1
            , ctx
            )
    in
    action2Inputs stack ctx getIntegerOrList getIntegerOrList action


xorBit : Array Iota -> CastingContext -> ActionResult
xorBit stack ctx =
    let
        action iota1 iota2 _ =
            ( case ( iota1, iota2 ) of
                ( Number number1, Number number2 ) ->
                    Number (toFloat <| Bitwise.xor (round number1) (round number2))
                        |> Array.repeat 1

                ( IotaList list1, IotaList list2 ) ->
                    Array.filter (\iota -> not <| List.any (checkEquality iota) <| Array.toList list2) list1
                        |> Array.append (Array.filter (\iota -> not <| List.any (checkEquality iota) <| Array.toList list1) list2)
                        |> IotaList
                        |> Array.repeat 1

                _ ->
                    Garbage CatastrophicFailure
                        |> Array.repeat 1
            , ctx
            )
    in
    action2Inputs stack ctx getIntegerOrList getIntegerOrList action


notBit : Array Iota -> CastingContext -> ActionResult
notBit stack ctx =
    let
        action iota _ =
            ( case iota of
                Number number ->
                    Number (toFloat <| Bitwise.complement <| round number)
                        |> Array.repeat 1

                _ ->
                    Garbage CatastrophicFailure
                        |> Array.repeat 1
            , ctx
            )
    in
    action1Input stack ctx getInteger action


toSet : Array Iota -> CastingContext -> ActionResult
toSet stack ctx =
    let
        constructSet iota out =
            if List.any (checkEquality iota) (Array.toList out) then
                out

            else
                Array.push iota out

        action iota _ =
            ( case iota of
                IotaList list ->
                    IotaList (Array.foldl constructSet Array.empty list)
                        |> Array.repeat 1

                _ ->
                    Garbage CatastrophicFailure
                        |> Array.repeat 1
            , ctx
            )
    in
    action1Input stack ctx getIotaList action


constructVector : Array Iota -> CastingContext -> ActionResult
constructVector stack ctx =
    let
        action iota1 iota2 iota3 _ =
            ( case ( iota1, iota2, iota3 ) of
                ( Number number1, Number number2, Number number3 ) ->
                    Vector ( number1, number2, number3 )
                        |> Array.repeat 1

                _ ->
                    Garbage CatastrophicFailure
                        |> Array.repeat 1
            , ctx
            )
    in
    action3Inputs stack ctx getNumber getNumber getNumber action


deconstructVector : Array Iota -> CastingContext -> ActionResult
deconstructVector stack ctx =
    let
        action iota _ =
            ( case iota of
                Vector ( x, y, z ) ->
                    Array.fromList
                        [ Number z
                        , Number y
                        , Number x
                        ]

                _ ->
                    Garbage CatastrophicFailure
                        |> Array.repeat 1
            , ctx
            )
    in
    action1Input stack ctx getVector action


andBool : Array Iota -> CastingContext -> ActionResult
andBool stack ctx =
    let
        action iota1 iota2 _ =
            ( case ( iota1, iota2 ) of
                ( Boolean bool1, Boolean bool2 ) ->
                    Boolean (bool1 && bool2)
                        |> Array.repeat 1

                _ ->
                    Garbage CatastrophicFailure
                        |> Array.repeat 1
            , ctx
            )
    in
    action2Inputs stack ctx getBoolean getBoolean action


orBool : Array Iota -> CastingContext -> ActionResult
orBool stack ctx =
    let
        action iota1 iota2 _ =
            ( case ( iota1, iota2 ) of
                ( Boolean bool1, Boolean bool2 ) ->
                    Boolean (bool1 || bool2)
                        |> Array.repeat 1

                _ ->
                    Garbage CatastrophicFailure
                        |> Array.repeat 1
            , ctx
            )
    in
    action2Inputs stack ctx getBoolean getBoolean action


xorBool : Array Iota -> CastingContext -> ActionResult
xorBool stack ctx =
    let
        action iota1 iota2 _ =
            ( case ( iota1, iota2 ) of
                ( Boolean bool1, Boolean bool2 ) ->
                    Boolean (xor bool1 bool2)
                        |> Array.repeat 1

                _ ->
                    Garbage CatastrophicFailure
                        |> Array.repeat 1
            , ctx
            )
    in
    action2Inputs stack ctx getBoolean getBoolean action


greaterThan : Array Iota -> CastingContext -> ActionResult
greaterThan stack ctx =
    let
        action iota1 iota2 _ =
            ( case ( iota1, iota2 ) of
                ( Number number1, Number number2 ) ->
                    Boolean (number1 > number2)
                        |> Array.repeat 1

                _ ->
                    Garbage CatastrophicFailure
                        |> Array.repeat 1
            , ctx
            )
    in
    action2Inputs stack ctx getNumber getNumber action


lessThan : Array Iota -> CastingContext -> ActionResult
lessThan stack ctx =
    let
        action iota1 iota2 _ =
            ( case ( iota1, iota2 ) of
                ( Number number1, Number number2 ) ->
                    Boolean (number1 < number2)
                        |> Array.repeat 1

                _ ->
                    Garbage CatastrophicFailure
                        |> Array.repeat 1
            , ctx
            )
    in
    action2Inputs stack ctx getNumber getNumber action


greaterThanOrEqualTo : Array Iota -> CastingContext -> ActionResult
greaterThanOrEqualTo stack ctx =
    let
        action iota1 iota2 _ =
            ( case ( iota1, iota2 ) of
                ( Number number1, Number number2 ) ->
                    Boolean (number1 >= number2)
                        |> Array.repeat 1

                _ ->
                    Garbage CatastrophicFailure
                        |> Array.repeat 1
            , ctx
            )
    in
    action2Inputs stack ctx getNumber getNumber action


lessThanOrEqualTo : Array Iota -> CastingContext -> ActionResult
lessThanOrEqualTo stack ctx =
    let
        action iota1 iota2 _ =
            ( case ( iota1, iota2 ) of
                ( Number number1, Number number2 ) ->
                    Boolean (number1 <= number2)
                        |> Array.repeat 1

                _ ->
                    Garbage CatastrophicFailure
                        |> Array.repeat 1
            , ctx
            )
    in
    action2Inputs stack ctx getNumber getNumber action


equalTo : Array Iota -> CastingContext -> ActionResult
equalTo stack ctx =
    let
        action iota1 iota2 _ =
            ( Boolean (checkEquality iota1 iota2)
                |> Array.repeat 1
            , ctx
            )
    in
    action2Inputs stack ctx getAny getAny action


notEqualTo : Array Iota -> CastingContext -> ActionResult
notEqualTo stack ctx =
    let
        action iota1 iota2 _ =
            ( Boolean (not (checkEquality iota1 iota2))
                |> Array.repeat 1
            , ctx
            )
    in
    action2Inputs stack ctx getAny getAny action


invertBool : Array Iota -> CastingContext -> ActionResult
invertBool stack ctx =
    let
        action iota _ =
            ( case iota of
                Boolean True ->
                    Boolean False
                        |> Array.repeat 1

                Boolean False ->
                    Boolean True
                        |> Array.repeat 1

                _ ->
                    Garbage CatastrophicFailure
                        |> Array.repeat 1
            , ctx
            )
    in
    action1Input stack ctx getBoolean action


boolCoerce : Array Iota -> CastingContext -> ActionResult
boolCoerce stack ctx =
    let
        action iota _ =
            ( case iota of
                Number _ ->
                    if checkEquality iota (Number 0.0) then
                        Boolean False
                            |> Array.repeat 1

                    else
                        Boolean True
                            |> Array.repeat 1

                Null ->
                    Boolean False
                        |> Array.repeat 1

                IotaList x ->
                    if x == Array.empty then
                        Boolean False
                            |> Array.repeat 1

                    else
                        Boolean True
                            |> Array.repeat 1

                _ ->
                    Boolean True
                        |> Array.repeat 1
            , ctx
            )
    in
    action1Input stack ctx getAny action


ifBool : Array Iota -> CastingContext -> ActionResult
ifBool stack ctx =
    let
        action iota1 iota2 iota3 _ =
            ( case iota1 of
                Boolean bool ->
                    if bool == True then
                        iota2
                            |> Array.repeat 1

                    else
                        iota3
                            |> Array.repeat 1

                _ ->
                    Garbage CatastrophicFailure
                        |> Array.repeat 1
            , ctx
            )
    in
    action3Inputs stack ctx getBoolean getAny getAny action
