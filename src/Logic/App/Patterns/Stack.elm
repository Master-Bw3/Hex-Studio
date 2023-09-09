module Logic.App.Patterns.Stack exposing (..)

import Array exposing (Array)
import Array.Extra as Array
import FontAwesome.Attributes exposing (stack)
import Html.Attributes exposing (action)
import Logic.App.Patterns.OperatorUtils exposing (action1Input, action2Inputs, action3Inputs, actionNoInput, getAny, getInteger)
import Logic.App.Types exposing (ActionResult, CastingContext, Iota(..), Mishap(..))
import Logic.App.Utils.Utils exposing (removeFromArray, unshift)
import Maybe.Extra as Maybe


swap : Array Iota -> CastingContext -> ActionResult
swap stack ctx =
    let
        action iota1 iota2 _ =
            ( Array.fromList
                [ iota1
                , iota2
                ]
            , ctx
            )
    in
    action2Inputs stack ctx getAny getAny action


rotate : Array Iota -> CastingContext -> ActionResult
rotate stack ctx =
    let
        action iota1 iota2 iota3 _ =
            ( Array.fromList
                [ iota1
                , iota3
                , iota2
                ]
            , ctx
            )
    in
    action3Inputs stack ctx getAny getAny getAny action


rotateReverse : Array Iota -> CastingContext -> ActionResult
rotateReverse stack ctx =
    let
        action iota1 iota2 iota3 _ =
            ( Array.fromList
                [ iota2
                , iota1
                , iota3
                ]
            , ctx
            )
    in
    action3Inputs stack ctx getAny getAny getAny action


duplicate : Array Iota -> CastingContext -> ActionResult
duplicate stack ctx =
    let
        action iota _ =
            ( Array.fromList
                [ iota
                , iota
                ]
            , ctx
            )
    in
    action1Input stack ctx getAny action


over : Array Iota -> CastingContext -> ActionResult
over stack ctx =
    let
        action iota1 iota2 _ =
            ( Array.fromList
                [ iota1
                , iota2
                , iota1
                ]
            , ctx
            )
    in
    action2Inputs stack ctx getAny getAny action


tuck : Array Iota -> CastingContext -> ActionResult
tuck stack ctx =
    let
        action iota1 iota2 _ =
            ( Array.fromList
                [ iota2
                , iota1
                , iota2
                ]
            , ctx
            )
    in
    action2Inputs stack ctx getAny getAny action


dup2 : Array Iota -> CastingContext -> ActionResult
dup2 stack ctx =
    let
        action iota1 iota2 _ =
            ( Array.fromList
                [ iota2
                , iota1
                , iota2
                , iota1
                ]
            , ctx
            )
    in
    action2Inputs stack ctx getAny getAny action


stackLength : Array Iota -> CastingContext -> ActionResult
stackLength stack ctx =
    actionNoInput stack ctx (\_ -> ( Array.repeat 1 (Number (toFloat <| Array.length stack)), ctx ))


duplicateN : Array Iota -> CastingContext -> ActionResult
duplicateN stack ctx =
    let
        action iota1 iota2 _ =
            ( case iota2 of
                Number number ->
                    Array.fromList <| List.repeat (round number) iota1

                _ ->
                    Array.fromList [ Garbage CatastrophicFailure ]
            , ctx
            )
    in
    action2Inputs stack ctx getAny getInteger action


fisherman : Array Iota -> CastingContext -> ActionResult
fisherman stack ctx =
    let
        maybeIota =
            Array.get 0 stack

        newStack =
            Array.slice 1 (Array.length stack) stack
    in
    case maybeIota of
        Nothing ->
            { stack = Array.append (Array.fromList [ Garbage NotEnoughIotas, Garbage NotEnoughIotas ]) newStack, ctx = ctx, success = False }

        Just iota ->
            case getInteger <| iota of
                Nothing ->
                    { stack = unshift (Garbage IncorrectIota) newStack, ctx = ctx, success = False }

                _ ->
                    case iota of
                        Number number ->
                            let
                                newNewStack =
                                    removeFromArray (round number - 1) (round number) newStack

                                maybeCaughtIota =
                                    Array.get (round number - 1) newStack
                            in
                            case maybeCaughtIota of
                                Nothing ->
                                    { stack = unshift (Garbage NotEnoughIotas) stack, ctx = ctx, success = False }

                                Just caughtIota ->
                                    { stack = unshift caughtIota newNewStack, ctx = ctx, success = True }

                        _ ->
                            { stack = unshift (Garbage CatastrophicFailure) stack, ctx = ctx, success = False }


fishermanCopy : Array Iota -> CastingContext -> ActionResult
fishermanCopy stack ctx =
    let
        maybeIota =
            Array.get 0 stack

        newStack =
            Array.slice 1 (Array.length stack) stack
    in
    case maybeIota of
        Nothing ->
            { stack = Array.append (Array.fromList [ Garbage NotEnoughIotas, Garbage NotEnoughIotas ]) newStack, ctx = ctx, success = False }

        Just iota ->
            case getInteger <| iota of
                Nothing ->
                    { stack = unshift (Garbage IncorrectIota) newStack, ctx = ctx, success = False }

                _ ->
                    case iota of
                        Number number ->
                            let
                                maybeCaughtIota =
                                    Array.get (round number) newStack
                            in
                            case maybeCaughtIota of
                                Nothing ->
                                    { stack = unshift (Garbage NotEnoughIotas) stack, ctx = ctx, success = False }

                                Just caughtIota ->
                                    { stack = unshift caughtIota newStack, ctx = ctx, success = True }

                        _ ->
                            { stack = unshift (Garbage CatastrophicFailure) stack, ctx = ctx, success = False }

swizzle : Array Iota -> CastingContext -> ActionResult
swizzle stack ctx =
    let
        maybeIota =
            Array.get 0 stack

        newStack =
            Array.slice 1 (Array.length stack) stack
    in
        case maybeIota of
            Nothing ->
                { stack = Array.append (Array.fromList [ Garbage NotEnoughIotas ]) newStack, ctx = ctx, success = False }

            Just iota ->
                case getInteger <| iota of
                    Nothing ->
                        { stack = unshift (Garbage IncorrectIota) newStack, ctx = ctx, success = False }

                    _ ->
                        case iota of
                            Number number ->
                                -- HexCasting does something weird here I don't know how to replicate
                                -- [0, 1, 1.5, Swindle] will error on the 0 with an error message about 1.5
                                -- Very odd.
                                let
                                    permutationSizeRec accum accumFact input =
                                        if input < accumFact then accum
                                        else let next = 1 + accum in permutationSizeRec next (next * accumFact) input

                                    permutationSize = permutationSizeRec 1 1

                                    idx = round number
                                    ps = permutationSize idx

                                    idxToCode : Int -> Int -> List Int
                                    idxToCode i permSize =
                                        if permSize <= 1 then [0]
                                        else
                                            let
                                                fact n =
                                                    case n of
                                                        0 -> 1
                                                        x -> x * fact (x - 1)

                                                multiplier = fact (permSize - 1)
                                                digit = i // multiplier
                                            in digit :: (idxToCode (remainderBy multiplier i) (permSize - 1))

                                    code = idxToCode idx ps
                                    oldSlice = Array.reverse (Array.slice 0 (List.length code) newStack)

                                    codeToPermutationReverse c remaining =
                                        case c of
                                            [] -> Just []
                                            h :: t ->
                                                let
                                                    elem = Array.get h remaining
                                                    next = Array.removeAt h remaining
                                                in Maybe.map2 (::) elem (codeToPermutationReverse t next)

                                    maybeNewSlice = Maybe.map List.reverse (codeToPermutationReverse code oldSlice)
                                in case maybeNewSlice of
                                    Nothing ->
                                        -- needs to be more garbage iotas here to represent reality
                                        { stack = unshift (Garbage NotEnoughIotas) stack, ctx = ctx, success = False }

                                    Just newSlice ->
                                        { stack = Array.append (Array.fromList newSlice) (Array.slice (List.length code) (Array.length newStack) newStack), ctx = ctx, success = True }

                            _ ->
                                { stack = unshift (Garbage CatastrophicFailure) stack, ctx = ctx, success = False }
