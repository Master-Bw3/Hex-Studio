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


get1Input stack inputGetter =
    inputGetter <| Maybe.withDefault (Garbage NotEnoughIotas) <| Array.get 0 stack


action2Inputs : Array Iota -> (Iota -> Iota) -> (Iota -> Iota) -> (Iota -> Iota -> Array Iota) -> Array Iota
action2Inputs stack inputGetter1 inputGetter2 action =
    let
        iotas =
            get2Inputs stack inputGetter1 inputGetter2

        iota1 =
            Tuple.first iotas

        iota2 =
            Tuple.second iotas

        newStack =
            Array.slice 2 (Array.length stack) stack

        noAction =
            Array.append (Array.fromList [ iota1, iota2 ]) newStack
    in
    case ( iota1, iota2 ) of
        ( Garbage _, Garbage _ ) ->
            noAction

        ( Garbage _, _ ) ->
            noAction

        ( _, Garbage _ ) ->
            noAction

        _ ->
            Array.append (action iota1 iota2) newStack


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
    case ( maybeIota1, maybeIota2 ) of
        ( Just iota, Nothing ) ->
            ( Garbage NotEnoughIotas, iota )

        ( Nothing, Just iota ) ->
            ( Garbage NotEnoughIotas, iota )

        ( Nothing, Nothing ) ->
            ( Garbage NotEnoughIotas, Garbage NotEnoughIotas )

        ( Just iota1, Just iota2 ) ->
            ( inputGetter1 iota1, inputGetter2 iota2 )


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


getVector iota =
    case iota of
        Vector _ ->
            iota

        Garbage _ ->
            iota

        _ ->
            Garbage IncorrectIota


getEntity iota =
    case iota of
        Entity _ ->
            iota

        Garbage _ ->
            iota

        _ ->
            Garbage IncorrectIota
