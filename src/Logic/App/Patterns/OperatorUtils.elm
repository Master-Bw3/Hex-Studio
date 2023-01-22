module Logic.App.Patterns.OperatorUtils exposing (..)

import Array exposing (Array)
import Length
import Logic.App.Types exposing (Iota(..), Mishap(..))
import Logic.App.Utils.Utils exposing (unshift)
import Quantity exposing (Quantity(..))
import Vector3d as Vec3d


makeConstant : Iota -> Array Iota -> Array Iota
makeConstant iota stack =
    unshift iota stack


actionNoInput : Array Iota -> Array Iota -> Array Iota
actionNoInput stack action =
    Array.append action stack


action1Input : Array Iota -> (Iota -> Iota) -> (Iota -> Array Iota) -> Array Iota
action1Input stack inputGetter action =
    let
        maybeIota =
            Array.get 0 stack

        newStack =
            Array.slice 1 (Array.length stack) stack
    in
    case maybeIota of
        Nothing ->
            unshift (Garbage NotEnoughIotas) newStack

        Just iota ->
            case inputGetter <| iota of
                Garbage IncorrectIota ->
                    unshift (Garbage IncorrectIota) newStack

                _ ->
                    Array.append (action iota) newStack


action2Inputs : Array Iota -> (Iota -> Iota) -> (Iota -> Iota) -> (Iota -> Iota -> Array Iota) -> Array Iota
action2Inputs stack inputGetter1 inputGetter2 action =
    let
        maybeIota1 =
            Array.get 1 stack

        maybeIota2 =
            Array.get 0 stack

        newStack =
            Array.slice 2 (Array.length stack) stack
    in
    if maybeIota1 == Nothing || maybeIota2 == Nothing then
        Array.append (Array.map mapNothingToMissingIota <| Array.fromList <| moveNothingsToFront [ maybeIota1, maybeIota2 ]) newStack

    else
        case ( Maybe.map inputGetter1 maybeIota1, Maybe.map inputGetter2 maybeIota2 ) of
            ( Just iota1, Just iota2 ) ->
                if iota1 == Garbage IncorrectIota || iota2 == Garbage IncorrectIota then
                    Array.append (Array.fromList [ iota1, iota2 ]) newStack

                else
                    Array.append (action iota1 iota2) newStack

            _ ->
                -- this should never happen
                unshift (Garbage CatastrophicFailure) newStack


action3Inputs : Array Iota -> (Iota -> Iota) -> (Iota -> Iota) -> (Iota -> Iota) -> (Iota -> Iota -> Iota -> Array Iota) -> Array Iota
action3Inputs stack inputGetter1 inputGetter2 inputGetter3 action =
    let
        maybeIota1 =
            Array.get 2 stack

        maybeIota2 =
            Array.get 1 stack

        maybeIota3 =
            Array.get 0 stack

        newStack =
            Array.slice 3 (Array.length stack) stack
    in
    if maybeIota1 == Nothing || maybeIota2 == Nothing || maybeIota3 == Nothing then
        Array.append (Array.map mapNothingToMissingIota <| Array.fromList <| moveNothingsToFront [ maybeIota1, maybeIota2, maybeIota3 ]) newStack

    else
        case ( Maybe.map inputGetter1 maybeIota1, Maybe.map inputGetter2 maybeIota2, Maybe.map inputGetter3 maybeIota3 ) of
            ( Just iota1, Just iota2, Just iota3 ) ->
                if iota1 == Garbage IncorrectIota || iota2 == Garbage IncorrectIota || iota3 == Garbage IncorrectIota then
                    Array.append (Array.fromList [ iota1, iota2, iota3 ]) newStack

                else
                    Array.append (action iota1 iota2 iota3) newStack

            _ ->
                -- this should never happen
                unshift (Garbage CatastrophicFailure) newStack


getPatternOrPatternList : Iota -> Iota
getPatternOrPatternList iota =
    case iota of
        Pattern _ _ ->
            iota

        IotaList list ->
            if
                List.all
                    (\i ->
                        case i of
                            Pattern _ _ ->
                                True

                            _ ->
                                False
                    )
                <|
                    Array.toList list
            then
                iota

            else
                Garbage IncorrectIota

        _ ->
            Garbage IncorrectIota


getNumberOrVector : Iota -> Iota
getNumberOrVector iota =
    case iota of
        Vector _ ->
            iota

        Number _ ->
            iota

        _ ->
            Garbage IncorrectIota


getInteger : Iota -> Iota
getInteger iota =
    case iota of
        Number number ->
            if toFloat (round number) == number then
                iota

            else
                Garbage IncorrectIota

        _ ->
            Garbage IncorrectIota


getNumber : Iota -> Iota
getNumber iota =
    case iota of
        Number _ ->
            iota

        _ ->
            Garbage IncorrectIota


getVector : Iota -> Iota
getVector iota =
    case iota of
        Vector _ ->
            iota

        _ ->
            Garbage IncorrectIota


getEntity : Iota -> Iota
getEntity iota =
    case iota of
        Entity _ ->
            iota

        _ ->
            Garbage IncorrectIota


getIotaList : Iota -> Iota
getIotaList iota =
    case iota of
        IotaList _ ->
            iota

        _ ->
            Garbage IncorrectIota


getBoolean : Iota -> Iota
getBoolean iota =
    case iota of
        Boolean _ ->
            iota

        _ ->
            Garbage IncorrectIota


getAny : Iota -> Iota
getAny iota =
    iota


checkNotGarbage : Iota -> Bool
checkNotGarbage iota =
    case iota of
        Garbage _ ->
            False

        _ ->
            True


mapNothingToMissingIota maybeIota =
    case maybeIota of
        Nothing ->
            Garbage NotEnoughIotas

        Just iota ->
            iota


moveNothingsToFront : List (Maybe a) -> List (Maybe a)
moveNothingsToFront list =
    let
        comparison : Maybe a -> Maybe a -> Order
        comparison a b =
            let
                checkNothing x =
                    case x of
                        Nothing ->
                            1

                        _ ->
                            2
            in
            case compare (checkNothing a) (checkNothing b) of
                LT ->
                    LT

                EQ ->
                    EQ

                GT ->
                    GT
    in
    List.sortWith comparison list


checkEquality : Iota -> Iota -> Bool
checkEquality iota1 iota2 =
    let
        tolerance =
            0.0001
    in
    case ( iota1, iota2 ) of
        ( Pattern pattern1 _, Pattern pattern2 _ ) ->
            pattern1.signature == pattern2.signature

        ( IotaList list1, IotaList list2 ) ->
            List.map2 (\i1 i2 -> checkEquality i1 i2) (Array.toList list1) (Array.toList list2)
                |> List.member False
                |> not

        ( Vector vector1Tuple, Vector vector2Tuple ) ->
            let
                vector1 =
                    Vec3d.fromTuple Length.meters vector1Tuple

                vector2 =
                    Vec3d.fromTuple Length.meters vector2Tuple
            in
            Vec3d.equalWithin (Quantity tolerance) vector1 vector2

        ( Number number1, Number number2 ) ->
            abs (number1 - number2) < tolerance

        ( Entity entity1, Entity entity2 ) ->
            entity1 == entity2

        _ ->
            iota1 == iota2
