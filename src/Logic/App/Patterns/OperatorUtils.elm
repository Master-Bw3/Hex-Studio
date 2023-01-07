module Logic.App.Patterns.OperatorUtils exposing (..)

import Array exposing (Array)
import Logic.App.Types exposing (Iota(..), Mishap(..))
import Logic.App.Utils.Utils exposing (unshift)


makeConstant : Iota -> Array Iota -> Array Iota
makeConstant iota stack =
    unshift iota stack


actionNoInput : Array Iota -> Array Iota -> Array Iota
actionNoInput stack action =
    Array.append action stack


action1Input : Array Iota -> (Iota -> Iota) -> (Iota -> Array Iota) -> Array Iota
action1Input stack inputGetter action =
    let
        iota =
            get1Input stack inputGetter

        newStack =
            Array.slice 1 (Array.length stack) stack
    in
    case iota of
        Garbage _ ->
            unshift iota newStack

        _ ->
            Array.append (action iota) newStack


get1Input : Array Iota -> (Iota -> b) -> b
get1Input stack inputGetter =
    inputGetter <| mapNothingToMissingIota <| Array.get 0 stack


action2Inputs : Array Iota -> (Iota -> Iota) -> (Iota -> Iota) -> (Iota -> Iota -> Array Iota) -> Array Iota
action2Inputs stack inputGetter1 inputGetter2 action =
    let
        iotas =
            get2Inputs stack inputGetter1 inputGetter2

        newStack =
            Array.slice 2 (Array.length stack) stack
    in
    case iotas of
        ( iota1, iota2 ) ->
            if checkNotGarbage iota1 && checkNotGarbage iota2 then
                Array.append (action iota1 iota2) newStack

            else
                Array.append (Array.fromList [ iota1, iota2 ]) newStack


get2Inputs :
    Array Iota
    -> (Iota -> Iota)
    -> (Iota -> Iota)
    -> ( Iota, Iota )
get2Inputs stack inputGetter1 inputGetter2 =
    let
        maybeIota1 =
            Array.get 0 stack

        maybeIota2 =
            Array.get 1 stack
    in
    if maybeIota1 == Nothing || maybeIota2 == Nothing then
        let
            iotas =
                Array.fromList <| List.map mapNothingToMissingIota (moveNothingsToFront [ maybeIota1, maybeIota2 ])

            iota1 =
                Maybe.withDefault (Garbage CatastrophicFailure) <| Array.get 0 iotas

            iota2 =
                Maybe.withDefault (Garbage CatastrophicFailure) <| Array.get 1 iotas
        in
        ( iota1, iota2 )

    else
        ( inputGetter1 <| Maybe.withDefault (Garbage CatastrophicFailure) maybeIota1
        , inputGetter2 <| Maybe.withDefault (Garbage CatastrophicFailure) maybeIota2
        )


action3Inputs : Array Iota -> (Iota -> Iota) -> (Iota -> Iota) -> (Iota -> Iota) -> (Iota -> Iota -> Iota -> Array Iota) -> Array Iota
action3Inputs stack inputGetter1 inputGetter2 inputGetter3 action =
    let
        iotas =
            get3Inputs stack inputGetter1 inputGetter2 inputGetter3

        newStack =
            Array.slice 3 (Array.length stack) stack
    in
    case iotas of
        ( iota1, iota2, iota3 ) ->
            if checkNotGarbage iota1 && checkNotGarbage iota2 && checkNotGarbage iota3 then
                Array.append (action iota1 iota2 iota3) newStack

            else
                Array.append (Array.fromList [ iota1, iota2, iota3 ]) newStack


get3Inputs :
    Array Iota
    -> (Iota -> Iota)
    -> (Iota -> Iota)
    -> (Iota -> Iota)
    -> ( Iota, Iota, Iota )
get3Inputs stack inputGetter1 inputGetter2 inputGetter3 =
    let
        maybeIota1 =
            Array.get 0 stack

        maybeIota2 =
            Array.get 1 stack

        maybeIota3 =
            Array.get 2 stack
    in
    if maybeIota1 == Nothing || maybeIota2 == Nothing || maybeIota3 == Nothing then
        let
            iotas =
                Array.fromList <| List.map mapNothingToMissingIota (moveNothingsToFront [ maybeIota1, maybeIota2, maybeIota3 ])

            iota1 =
                Maybe.withDefault (Garbage CatastrophicFailure) <| Array.get 0 iotas

            iota2 =
                Maybe.withDefault (Garbage CatastrophicFailure) <| Array.get 1 iotas

            iota3 =
                Maybe.withDefault (Garbage CatastrophicFailure) <| Array.get 2 iotas
        in
        ( iota1, iota2, iota3 )

    else
        ( inputGetter1 <| Maybe.withDefault (Garbage CatastrophicFailure) maybeIota1
        , inputGetter2 <| Maybe.withDefault (Garbage CatastrophicFailure) maybeIota2
        , inputGetter3 <| Maybe.withDefault (Garbage CatastrophicFailure) maybeIota3
        )


getNumberOrVector : Iota -> Iota
getNumberOrVector iota =
    case iota of
        Vector _ ->
            iota

        Number _ ->
            iota

        Garbage _ ->
            iota

        _ ->
            Garbage IncorrectIota


getVector : Iota -> Iota
getVector iota =
    case iota of
        Vector _ ->
            iota

        Garbage _ ->
            iota

        _ ->
            Garbage IncorrectIota


getEntity : Iota -> Iota
getEntity iota =
    case iota of
        Entity _ ->
            iota

        Garbage _ ->
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
