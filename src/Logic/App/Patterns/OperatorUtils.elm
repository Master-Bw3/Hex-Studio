module Logic.App.Patterns.OperatorUtils exposing (..)

import Array exposing (Array)
import Logic.App.Types exposing (Iota(..))
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
    if iota /= Garbage then
        Array.append (action iota) newStack
    else
        unshift Garbage newStack


get1Input stack inputGetter =
    inputGetter <| Maybe.withDefault Garbage <| Array.get 0 stack


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
    in
    if iota1 /= Garbage && iota2 /= Garbage then
        Array.append (action iota1 iota2) newStack

    else
        Array.append (Array.fromList [ iota1, iota2 ]) newStack


get2Inputs :
    Array Iota
    -> (Iota -> Iota)
    -> (Iota -> Iota)
    -> ( Iota, Iota )
get2Inputs stack inputGetter1 inputGetter2 =
    if Array.length stack >= 2 then
        let
            iota1 =
                inputGetter1 <| Maybe.withDefault Garbage <| Array.get 0 stack

            iota2 =
                inputGetter2 <| Maybe.withDefault Garbage <| Array.get 1 stack
        in
        ( iota1, iota2 )

    else
        let
            maybeIota1 =
                Array.get 0 stack

            maybeIota2 =
                Array.get 1 stack
        in
        case ( maybeIota1, maybeIota2 ) of
            ( Just iota, Nothing ) ->
                ( Garbage, iota )

            ( Nothing, Just iota ) ->
                ( Garbage, iota )

            _ ->
                ( Garbage, Garbage )


getNumberOrVector iota =
    case iota of
        Vector _ ->
            iota

        Number _ ->
            iota

        _ ->
            Garbage


getVector iota =
    case iota of
        Vector _ ->
            iota

        _ ->
            Garbage


getEntity iota =
    case iota of
        Entity _ ->
            iota

        _ ->
            Garbage
