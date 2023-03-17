module Logic.App.Stack.EvalStack exposing (..)

import Array exposing (Array)
import Array.Extra as Array
import List.Extra as List
import Logic.App.Patterns.OperatorUtils exposing (getIotaList, getPatternList, getPatternOrIotaList, mapNothingToMissingIota, moveNothingsToFront)
import Logic.App.Types exposing (ActionResult, ApplyToStackResult(..), CastingContext, Iota(..), IotaType(..), Mishap(..), Pattern, Timeline)
import Logic.App.Utils.Utils exposing (isJust, unshift)


type alias ApplyResult =
    { stack : Array Iota
    , resultArray : Array ApplyToStackResult
    , ctx : CastingContext
    , error : Bool
    , halted : Bool
    , timeline : Timeline
    }


applyToStackStopAtErrorOrHalt : Array Iota -> CastingContext -> Array Iota -> ApplyResult
applyToStackStopAtErrorOrHalt stack ctx iotas =
    applyToStackLoop ( stack, Array.empty ) ctx (Array.toList iotas) 0 Array.empty False True


applyPatternsToStack : Array Iota -> CastingContext -> List Pattern -> ApplyResult
applyPatternsToStack stack ctx patterns =
    let
        patternIotas =
            List.map (\pattern -> PatternIota pattern False) patterns
    in
    applyToStackLoop ( stack, Array.empty ) ctx patternIotas 0 Array.empty False False


applyToStackLoop : ( Array Iota, Array ApplyToStackResult ) -> CastingContext -> List Iota -> Int -> Timeline -> Bool -> Bool -> ApplyResult
applyToStackLoop stackResultTuple ctx patterns currentIndex timeline considerThis stopAtErrorOrHalt =
    let
        stack =
            Tuple.first stackResultTuple

        resultArray =
            Tuple.second stackResultTuple

        introspection =
            case Array.get 0 stack of
                Just (OpenParenthesis _) ->
                    True

                _ ->
                    False
    in
    case List.head patterns of
        Nothing ->
            { stack = stack, resultArray = resultArray, ctx = ctx, error = False, halted = False, timeline = timeline }

        Just (PatternIota pattern _) ->
            if considerThis then
                let
                    applyResult =
                        ( addEscapedIotaToStack stack (PatternIota pattern True), unshift Considered resultArray )
                in
                applyToStackLoop
                    applyResult
                    ctx
                    (Maybe.withDefault [] <| List.tail patterns)
                    (currentIndex + 1)
                    (unshift { stack = Tuple.first applyResult, patternIndex = currentIndex } timeline)
                    False
                    stopAtErrorOrHalt

            else if pattern.internalName == "halt" && stopAtErrorOrHalt then
                { stack = stack, resultArray = resultArray, ctx = ctx, error = False, halted = True, timeline = timeline }

            else
                let
                    applyResult =
                        applyPatternToStack stack ctx pattern currentIndex
                in
                if not stopAtErrorOrHalt || (stopAtErrorOrHalt && applyResult.result /= Failed) then
                    applyToStackLoop
                        ( applyResult.stack, unshift applyResult.result resultArray )
                        applyResult.ctx
                        (Maybe.withDefault [] <| List.tail patterns)
                        (currentIndex + 1)
                        (Array.append applyResult.timeline timeline)
                        applyResult.considerNext
                        stopAtErrorOrHalt

                else
                    { stack = applyResult.stack
                    , resultArray = unshift applyResult.result resultArray
                    , ctx = applyResult.ctx
                    , error = True
                    , halted = False
                    , timeline = Array.push { stack = applyResult.stack, patternIndex = currentIndex } timeline
                    }

        Just iota ->
            if considerThis || introspection then
                let
                    applyResult =
                        ( addEscapedIotaToStack stack iota, unshift Considered resultArray )
                in
                applyToStackLoop
                    applyResult
                    ctx
                    (Maybe.withDefault [] <| List.tail patterns)
                    (currentIndex + 1)
                    (Array.push { stack = Tuple.first applyResult, patternIndex = currentIndex } timeline)
                    False
                    stopAtErrorOrHalt

            else
                { stack = stack, resultArray = resultArray, ctx = ctx, error = True, halted = False, timeline = timeline }


applyPatternToStack : Array Iota -> CastingContext -> Pattern -> Int -> { stack : Array Iota, result : ApplyToStackResult, ctx : CastingContext, considerNext : Bool, timeline : Timeline }
applyPatternToStack stack ctx pattern index =
    case Array.get 0 stack of
        Just (OpenParenthesis list) ->
            let
                numberOfCloseParen =
                    Array.length
                        (Array.filter
                            (\iota ->
                                case iota of
                                    PatternIota pat False ->
                                        pat.internalName == "close_paren"

                                    _ ->
                                        False
                            )
                            list
                        )

                numberOfOpenParen =
                    (+) 1 <|
                        Array.length
                            (Array.filter
                                (\iota ->
                                    case iota of
                                        PatternIota pat False ->
                                            pat.internalName == "open_paren"

                                        _ ->
                                            False
                                )
                                list
                            )

                addToIntroList =
                    Array.set 0 (OpenParenthesis (Array.push (PatternIota pattern False) list)) stack
            in
            if pattern.internalName == "escape" then
                { stack = stack, result = Succeeded, ctx = ctx, considerNext = True, timeline = Array.fromList [ { stack = stack, patternIndex = index } ] }

            else if pattern.internalName == "close_paren" then
                if pattern.internalName == "close_paren" && (numberOfCloseParen + 1) >= numberOfOpenParen then
                    let
                        newStack =
                            Array.map
                                (\iota ->
                                    case iota of
                                        OpenParenthesis l ->
                                            IotaList l

                                        otherIota ->
                                            otherIota
                                )
                                stack
                    in
                    { stack = newStack
                    , result = Succeeded
                    , ctx = ctx
                    , considerNext = False
                    , timeline = Array.fromList [ { stack = newStack, patternIndex = index } ]
                    }

                else
                    { stack = addToIntroList, result = Considered, ctx = ctx, considerNext = False, timeline = Array.fromList [ { stack = addToIntroList, patternIndex = index } ] }

            else if pattern.internalName == "open_paren" then
                { stack = addToIntroList, result = Considered, ctx = ctx, considerNext = False, timeline = Array.fromList [ { stack = addToIntroList, patternIndex = index } ] }

            else
                { stack = addToIntroList, result = Considered, ctx = ctx, considerNext = False, timeline = Array.fromList [ { stack = addToIntroList, patternIndex = index } ] }

        _ ->
            if pattern.internalName == "escape" then
                { stack = stack, result = Succeeded, ctx = ctx, considerNext = True, timeline = Array.fromList [ { stack = stack, patternIndex = index } ] }

            else if pattern.internalName == "close_paren" then
                { stack = unshift (PatternIota pattern False) stack, result = Failed, ctx = ctx, considerNext = False, timeline = Array.fromList [ { stack = stack, patternIndex = index } ] }

            else if pattern.internalName == "eval" then
                --special cases for eval and for_each because they need to return multiple stack states for the timeline
                let
                    actionResult =
                        eval stack ctx
                in
                if actionResult.success == True then
                    { stack = actionResult.stack
                    , result = Succeeded
                    , ctx = actionResult.ctx
                    , considerNext = False
                    , timeline = Array.map (\x -> { stack = x, patternIndex = index }) actionResult.allStackStates
                    }

                else
                    { stack = actionResult.stack
                    , result = Failed
                    , ctx = actionResult.ctx
                    , considerNext = False
                    , timeline = Array.map (\x -> { stack = x, patternIndex = index }) actionResult.allStackStates
                    }

            else if pattern.internalName == "for_each" then
                --special cases for eval and for_each because they need to return multiple stack states for the timeline
                let
                    actionResult =
                        forEach stack ctx
                in
                if actionResult.success == True then
                    { stack = actionResult.stack
                    , result = Succeeded
                    , ctx = actionResult.ctx
                    , considerNext = False
                    , timeline = Array.map (\x -> { stack = x, patternIndex = index }) actionResult.allStackStates
                    }

                else
                    { stack = actionResult.stack
                    , result = Failed
                    , ctx = actionResult.ctx
                    , considerNext = False
                    , timeline = Array.map (\x -> { stack = x, patternIndex = index }) actionResult.allStackStates
                    }

            else
                let
                    actionResult =
                        let
                            preActionResult =
                                pattern.action stack ctx
                        in
                        if preActionResult.success == True && isJust pattern.selectedOutput then
                            { preActionResult | stack = unshift (Tuple.second <| Maybe.withDefault ( NullType, Null ) pattern.selectedOutput) preActionResult.stack }

                        else
                            preActionResult
                in
                if actionResult.success == True then
                    { stack = actionResult.stack, result = Succeeded, ctx = actionResult.ctx, considerNext = False, timeline = Array.fromList [ { stack = actionResult.stack, patternIndex = index } ] }

                else
                    { stack = actionResult.stack, result = Failed, ctx = actionResult.ctx, considerNext = False, timeline = Array.fromList [ { stack = actionResult.stack, patternIndex = index } ] }


addEscapedIotaToStack : Array Iota -> Iota -> Array Iota
addEscapedIotaToStack stack iota =
    case Array.get 0 stack of
        Just (OpenParenthesis list) ->
            Array.set 0 (OpenParenthesis (Array.push iota list)) stack

        _ ->
            unshift iota stack


eval : Array Iota -> CastingContext -> { stack : Array Iota, ctx : CastingContext, success : Bool, allStackStates : Array (Array Iota) }
eval stack ctx =
    let
        maybeIota =
            Array.get 0 stack

        newStack =
            Array.slice 1 (Array.length stack) stack
    in
    case maybeIota of
        Nothing ->
            { stack = unshift (Garbage NotEnoughIotas) newStack, ctx = ctx, success = False, allStackStates = Array.fromList [ unshift (Garbage NotEnoughIotas) newStack ] }

        Just iota ->
            case getPatternOrIotaList <| iota of
                Nothing ->
                    { stack = unshift (Garbage IncorrectIota) newStack, ctx = ctx, success = False, allStackStates = Array.fromList [ unshift (Garbage IncorrectIota) newStack ] }

                _ ->
                    case iota of
                        IotaList list ->
                            let
                                applyResult =
                                    applyToStackStopAtErrorOrHalt
                                        newStack
                                        ctx
                                        list
                            in
                            { stack =
                                Array.filter
                                    (\i ->
                                        case i of
                                            OpenParenthesis _ ->
                                                False

                                            _ ->
                                                True
                                    )
                                    applyResult.stack
                            , ctx = applyResult.ctx
                            , success = not applyResult.error
                            , allStackStates = Array.map (\x -> x.stack) applyResult.timeline
                            }

                        PatternIota pattern _ ->
                            let
                                applyResult =
                                    applyToStackStopAtErrorOrHalt newStack ctx (Array.fromList [ PatternIota pattern False ])
                            in
                            { stack = applyResult.stack, ctx = applyResult.ctx, success = not applyResult.error, allStackStates = Array.map (\x -> x.stack) applyResult.timeline }

                        _ ->
                            { stack = Array.fromList [ Garbage CatastrophicFailure ], ctx = ctx, success = False, allStackStates = Array.fromList [ Array.fromList [ Garbage CatastrophicFailure ] ] }


forEach : Array Iota -> CastingContext -> { stack : Array Iota, ctx : CastingContext, success : Bool, allStackStates : Array (Array Iota) }
forEach stack ctx =
    let
        maybeIota1 =
            Array.get 1 stack

        maybeIota2 =
            Array.get 0 stack

        newStack =
            Array.slice 2 (Array.length stack) stack
    in
    if maybeIota1 == Nothing || maybeIota2 == Nothing then
        let
            newNewStack =
                Array.append (Array.map mapNothingToMissingIota <| Array.fromList <| moveNothingsToFront [ maybeIota1, maybeIota2 ]) newStack
        in
        { stack = newNewStack
        , ctx = ctx
        , success = False
        , allStackStates = Array.fromList [ newNewStack ]
        }

    else
        case ( Maybe.map getIotaList maybeIota1, Maybe.map getIotaList maybeIota2 ) of
            ( Just iota1, Just iota2 ) ->
                if iota1 == Nothing || iota2 == Nothing then
                    let
                        newNewStack =
                            Array.append
                                (Array.fromList
                                    [ Maybe.withDefault (Garbage IncorrectIota) iota1
                                    , Maybe.withDefault (Garbage IncorrectIota) iota2
                                    ]
                                )
                                newStack
                    in
                    { stack = newNewStack
                    , ctx = ctx
                    , success = False
                    , allStackStates = Array.fromList [ newNewStack ]
                    }

                else
                    case ( iota1, iota2 ) of
                        ( Just (IotaList patternList), Just (IotaList iotaList) ) ->
                            let
                                applyResult =
                                    Array.foldl
                                        (\iota accumulator ->
                                            if accumulator.continue == False then
                                                accumulator

                                            else
                                                let
                                                    subApplyResult =
                                                        applyToStackStopAtErrorOrHalt
                                                            (unshift iota newStack)
                                                            accumulator.ctx
                                                            patternList

                                                    thothList =
                                                        case Array.get 0 accumulator.stack of
                                                            Just (IotaList list) ->
                                                                list

                                                            _ ->
                                                                Array.empty

                                                    success =
                                                        if accumulator.success == True && subApplyResult.error then
                                                            False

                                                        else
                                                            accumulator.success
                                                in
                                                { stack = Array.set 0 (IotaList (Array.append thothList (Array.reverse subApplyResult.stack))) accumulator.stack
                                                , ctx = subApplyResult.ctx
                                                , success = success
                                                , continue =
                                                    if not success || subApplyResult.halted then
                                                        False

                                                    else
                                                        True
                                                , allStackStates =
                                                    Array.append
                                                        (unshift (Array.set 0 (IotaList (Array.append thothList (Array.reverse subApplyResult.stack))) accumulator.stack) <|
                                                            Array.map (\x -> x.stack) subApplyResult.timeline
                                                        )
                                                        accumulator.allStackStates
                                                }
                                        )
                                        { stack = unshift (IotaList Array.empty) newStack, ctx = ctx, success = True, continue = True, allStackStates = Array.empty }
                                        iotaList
                            in
                            { stack =
                                Array.filter
                                    (\i ->
                                        case i of
                                            OpenParenthesis _ ->
                                                False

                                            _ ->
                                                True
                                    )
                                    applyResult.stack
                            , ctx = applyResult.ctx
                            , success = applyResult.success
                            , allStackStates = applyResult.allStackStates
                            }

                        _ ->
                            { stack = Array.fromList [ Garbage CatastrophicFailure ], ctx = ctx, success = False, allStackStates = Array.fromList [ Array.fromList [ Garbage CatastrophicFailure ] ] }

            _ ->
                -- this should never happen
                { stack = unshift (Garbage CatastrophicFailure) newStack
                , ctx = ctx
                , success = False
                , allStackStates = Array.fromList [ unshift (Garbage CatastrophicFailure) newStack ]
                }
