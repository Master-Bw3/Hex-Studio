module Logic.App.Patterns.MetaActions exposing (..)

import Array
import Array.Extra as Array
import Components.App.Grid exposing (updateGridPoints)
import Dict
import Logic.App.Grid exposing (drawPatterns)
import Logic.App.Model exposing (Model)
import Logic.App.PatternList.PatternArray exposing (applyColorToPatternFromResult, updateDrawingColors)
import Logic.App.Patterns.PatternRegistry exposing (getPatternFromName, unknownPattern)
import Logic.App.Stack.EvalStack exposing (ApplyResult, applyPatternsToStack)
import Logic.App.Types exposing (ApplyToStackResult(..), Iota(..), MetaActionMsg(..))
import Logic.App.Utils.Utils exposing (unshift)


applyMetaAction : Model -> MetaActionMsg -> Model
applyMetaAction model metaActionMsg =
    let
        grid =
            model.grid

        settings =
            model.settings

        castingContext =
            model.castingContext
    in
    case metaActionMsg of
        None ->
            model

        Reset ->
            { model
                | patternArray = Array.empty
                , grid = { grid | points = updateGridPoints grid.width grid.height Array.empty [] settings.gridScale }
                , stack = Array.empty
                , castingContext = { castingContext | heldItemContent = Nothing }
                , insertionPoint = 0
                , timeline = Array.empty
            }

        ClearPatterns ->
            { model
                | patternArray = Array.empty
                , grid = { grid | points = updateGridPoints grid.width grid.height Array.empty [] settings.gridScale }
                , stack = Array.empty
                , insertionPoint = 0
                , timeline = Array.empty
            }

        Backspace ->
            let
                newUncoloredPatternArray =
                    Array.removeAt model.insertionPoint model.patternArray
                        |> Array.removeAt model.insertionPoint

                stackResult =
                    applyPatternsToStack Array.empty castingContext (List.reverse <| Tuple.first <| List.unzip <| Array.toList newUncoloredPatternArray)

                newStack =
                    stackResult.stack

                resultArray =
                    stackResult.resultArray

                newPatternArray =
                    Array.map2
                        (\patternTuple result ->
                            updateDrawingColors ( applyColorToPatternFromResult (Tuple.first patternTuple) result, Tuple.second patternTuple )
                        )
                        newUncoloredPatternArray
                        resultArray
            in
            { model
                | patternArray = newPatternArray
                , grid = { grid | points = updateGridPoints grid.width grid.height newPatternArray [] settings.gridScale }
                , stack = newStack
                , castingContext = stackResult.ctx
                , timeline = unshift { stack = Array.empty, patternIndex = -1 } stackResult.timeline
                , insertionPoint =
                    if model.insertionPoint > Array.length newPatternArray then
                        0

                    else
                        model.insertionPoint
            }

        Wrap ->
            let
                newUncoloredPatternArray =
                    model.patternArray
                        |> Array.removeAt model.insertionPoint
                        |> Array.push ( Tuple.first (getPatternFromName Nothing "open_paren"), [] )
                        |> unshift ( Tuple.first (getPatternFromName Nothing "close_paren"), [] )

                stackResult =
                    applyPatternsToStack Array.empty castingContext (List.reverse <| Tuple.first <| List.unzip <| Array.toList newUncoloredPatternArray)

                newStack =
                    stackResult.stack

                resultArray =
                    stackResult.resultArray

                newPatternArray =
                    Array.map2
                        (\patternTuple result ->
                            updateDrawingColors ( applyColorToPatternFromResult (Tuple.first patternTuple) result, Tuple.second patternTuple )
                        )
                        newUncoloredPatternArray
                        resultArray

                patterns =
                    Array.map (\x -> Tuple.first x) newPatternArray

                drawPatternsResult =
                    drawPatterns patterns model.grid
            in
            { model
                | patternArray = drawPatternsResult.patternArray
                , grid = drawPatternsResult.grid
                , stack = newStack
                , castingContext = stackResult.ctx
                , timeline = unshift { stack = Array.empty, patternIndex = -1 } stackResult.timeline
            }