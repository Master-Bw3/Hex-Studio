module Main exposing (main)

import Array
import Array.Extra as Array
import Browser
import Browser.Dom exposing (getElement)
import Browser.Events
import Components.App.Content exposing (content)
import Components.App.Grid exposing (..)
import Html exposing (..)
import Json.Decode exposing (Decoder)
import Logic.App.Grid exposing (generateDrawingFromSignature)
import Logic.App.ImportExport.ImportParser exposing (parseInput)
import Logic.App.Model exposing (Model)
import Logic.App.Msg exposing (..)
import Logic.App.PatternList.PatternArray exposing (addToPatternArray, applyColorToPatternFromResult, updateDrawingColors)
import Logic.App.Patterns.MetaActions exposing (applyMetaAction)
import Logic.App.Patterns.PatternRegistry exposing (..)
import Logic.App.Stack.Stack exposing (applyPatternsToStack)
import Logic.App.Types exposing (..)
import Logic.App.Utils.GetAngleSignature exposing (getAngleSignature)
import Logic.App.Utils.GetIotaValue exposing (getIotaFromString)
import Logic.App.Utils.Utils exposing (removeFromArray)
import Ports.CheckMouseOverDragHandle as CheckMouseOverDragHandle
import Ports.GetElementBoundingBoxById as GetElementBoundingBoxById
import Ports.GetGridDrawingAsGif as GetGridDrawingAsGif
import Ports.HexNumGen as HexNumGen
import Settings.Theme exposing (..)
import String exposing (fromInt)
import Task
import Time


main =
    Browser.document
        { init = init
        , update = update
        , view = view
        , subscriptions = subscriptions
        }


init : () -> ( Model, Cmd Msg )
init _ =
    ( { stack = Array.empty
      , patternArray = Array.empty
      , ui =
            { openPanels = [ PatternPanel ]
            , patternInputField = ""
            , suggestionIndex = 0
            , selectedInputID = ""
            , patternInputLocation = ( 0, 0 )
            , mouseOverElementIndex = -1
            , dragging = ( False, -1 )
            , patternElementMiddleLocations = []
            , overDragHandle = False
            , importInput = ""
            }
      , grid =
            { height = 0
            , width = 0
            , points = []
            , drawing =
                { drawingMode = False
                , activePath = []
                }
            }
      , mousePos = ( 0.0, 0.0 )
      , window =
            { width = 0.0
            , height = 0.0
            }
      , settings =
            { gridScale = 1.0
            }
      , castingContext =
            { heldItem = NoItem
            , heldItemContent = Nothing
            , ravenmind = Nothing
            }
      , time = 0
      , gridGifSrc = ""
      , insertionPoint = 0
      , importQueue = []
      }
    , Cmd.batch [ Task.attempt GetGrid (getElement "hex_grid"), Task.attempt GetContentSize (getElement "content") ]
    )


updatePatternArrayFromQueue : Model -> ( Model, Cmd Msg )
updatePatternArrayFromQueue model =
    if List.length model.importQueue > 0 then
        let
            ui =
                model.ui

            grid =
                model.grid

            drawing =
                model.grid.drawing

            castingContext =
                model.castingContext

            stackResult =
                applyPatternsToStack Array.empty castingContext (List.reverse <| List.map (\x -> Tuple.first x) <| Array.toList (addToPatternArray model newUncoloredPattern model.insertionPoint))

            getPattern =
                List.head model.importQueue
                    |> Maybe.withDefault ( unknownPattern, Cmd.none )

            newUncoloredPattern =
                Tuple.first <| getPattern

            newPattern =
                applyColorToPatternFromResult newUncoloredPattern (Maybe.withDefault Failed (Array.get model.insertionPoint stackResult.resultArray))

            command =
                Tuple.second <| getPattern

            newGrid =
                { grid
                    | points = applyActivePathToGrid model.grid.points (Tuple.second (updateDrawingColors ( newPattern, generateDrawingFromSignature newPattern.signature model.grid.points )))
                    , drawing = { drawing | drawingMode = False, activePath = [] }
                }
        in
        if command == Cmd.none then
            updatePatternArrayFromQueue <|
                applyMetaAction
                    { model
                        | patternArray =
                            addToPatternArray
                                { model
                                    | grid =
                                        { grid
                                            | drawing =
                                                { drawing | activePath = generateDrawingFromSignature newPattern.signature model.grid.points }
                                        }
                                }
                                newPattern
                                model.insertionPoint
                        , ui = { ui | patternInputField = "" }
                        , stack = stackResult.stack
                        , castingContext = stackResult.ctx
                        , grid = newGrid
                        , importQueue = Maybe.withDefault [] <| List.tail model.importQueue
                        , insertionPoint =
                            if model.insertionPoint > Array.length model.patternArray then
                                0

                            else
                                model.insertionPoint
                    }
                    newPattern.metaAction

        else
            ( { model | importQueue = Maybe.withDefault [] <| List.tail model.importQueue }, command )

    else
        ( model, Cmd.none )


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    let
        ui =
            model.ui

        grid =
            model.grid

        drawing =
            model.grid.drawing

        settings =
            model.settings

        patternArray =
            model.patternArray

        castingContext =
            model.castingContext
    in
    case msg of
        NoOp ->
            ( model, Cmd.none )

        ViewPanel panel keys ->
            if not keys.shift then
                ( { model | ui = { ui | openPanels = [ panel ] } }, Cmd.none )

            else
                ( { model | ui = { ui | openPanels = ui.openPanels ++ [ panel ] } }, Cmd.none )

        GetGrid (Ok element) ->
            ( { model
                | grid =
                    { grid
                        | height = element.element.height
                        , width = element.element.width
                        , points = updateGridPoints element.element.width element.element.height model.patternArray [] model.settings.gridScale
                    }
              }
            , Cmd.none
            )

        GetGrid (Err _) ->
            ( model, Cmd.none )

        GetContentSize (Ok element) ->
            ( { model
                | window =
                    { height = element.element.height, width = element.element.width }
              }
            , Cmd.none
            )

        GetContentSize (Err _) ->
            ( model, Cmd.none )

        MouseMove ( x, y ) ->
            if drawing.drawingMode == True then
                ( { model | mousePos = ( x, y ), grid = { grid | drawing = { drawing | activePath = addNearbyPoint model } } }, Cmd.none )

            else
                ( { model | mousePos = ( x, y ) }, Cmd.none )

        GridDown ( x, y ) ->
            let
                mousePos =
                    ( x, y )

                closestPoint =
                    getClosestPoint mousePos grid.points model
            in
            if closestPoint.used == False then
                ( { model | mousePos = mousePos, grid = { grid | drawing = { drawing | drawingMode = True, activePath = [ closestPoint ] } } }, Cmd.none )

            else
                ( model, Cmd.none )

        MouseUp ->
            if drawing.drawingMode == True then
                if List.length drawing.activePath > 1 then
                    let
                        stackResult =
                            applyPatternsToStack Array.empty castingContext (List.reverse <| List.map (\x -> Tuple.first x) <| Array.toList (addToPatternArray model newUncoloredPattern model.insertionPoint))

                        newStack =
                            stackResult.stack

                        resultArray =
                            stackResult.resultArray

                        newUncoloredPattern =
                            getPatternFromSignature <| getAngleSignature drawing.activePath

                        newPattern =
                            applyColorToPatternFromResult newUncoloredPattern (Maybe.withDefault Failed (Array.get model.insertionPoint resultArray))

                        newGrid =
                            { grid
                                | points = applyActivePathToGrid model.grid.points (Tuple.second (updateDrawingColors ( newPattern, drawing.activePath )))
                                , drawing = { drawing | drawingMode = False, activePath = [] }
                            }
                    in
                    ( applyMetaAction
                        { model
                            | patternArray = addToPatternArray model newPattern model.insertionPoint
                            , grid = newGrid
                            , stack = newStack
                            , castingContext = stackResult.ctx
                            , insertionPoint =
                                if model.insertionPoint > Array.length model.patternArray then
                                    0

                                else
                                    model.insertionPoint
                        }
                        newPattern.metaAction
                    , Cmd.none
                    )

                else
                    ( { model | grid = { grid | drawing = { drawing | drawingMode = False, activePath = [] } } }, Cmd.none )

            else
                ( model, Cmd.none )

        RemoveFromPatternArray startIndex endIndex ->
            let
                newUncoloredPatternArray =
                    removeFromArray startIndex endIndex model.patternArray

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
            ( { model
                | patternArray = newPatternArray
                , grid = { grid | points = updateGridPoints grid.width grid.height newPatternArray [] settings.gridScale }
                , stack = newStack
                , castingContext = stackResult.ctx
                , insertionPoint =
                    if model.insertionPoint > Array.length newPatternArray then
                        0

                    else
                        max (model.insertionPoint - 1) 0
              }
            , Cmd.none
            )

        SetGridScale scale ->
            ( { model | grid = { grid | points = updateGridPoints grid.width grid.height model.patternArray [] scale }, settings = { settings | gridScale = scale } }, Cmd.none )

        WindowResize ->
            ( model, Cmd.batch [ Task.attempt GetGrid (getElement "hex_grid"), Task.attempt GetContentSize (getElement "content") ] )

        Tick newTime ->
            let
                autocompleteIndex =
                    if model.ui.patternInputField == "" then
                        0

                    else
                        model.ui.suggestionIndex

                points =
                    grid.points
            in
            ( { model
                | time = Time.posixToMillis newTime
                , grid = { grid | points = updatemidLineOffsets points (Time.posixToMillis newTime) }
                , ui = { ui | suggestionIndex = autocompleteIndex }
              }
            , Cmd.batch
                [ GetElementBoundingBoxById.requestBoundingBox "#add_pattern_input"
                , CheckMouseOverDragHandle.requestCheckMouseOverDragHandle ()
                , Array.indexedMap (\index _ -> "[data-index=\"" ++ fromInt index ++ "\"]") model.patternArray
                    |> Array.toList
                    |> GetElementBoundingBoxById.requestBoundingBoxes
                ]
            )

        UpdatePatternInputField text ->
            ( { model | ui = { ui | patternInputField = text } }, Cmd.none )

        InputPattern name ->
            let
                newImportQueue =
                    if name /= "" then
                        getPatternFromName name :: model.importQueue

                    else
                        model.importQueue
            in
            updatePatternArrayFromQueue { model | importQueue = newImportQueue }

        SendNumberLiteralToGenerate number ->
            ( model, HexNumGen.sendNumber number )

        RecieveGeneratedNumberLiteral signature ->
            let

                newPattern =
                    getPatternFromSignature signature
            in
            updatePatternArrayFromQueue
                { model
                    |importQueue = (newPattern, Cmd.none) :: model.importQueue 
                }

        SelectPreviousSuggestion suggestLength ->
            let
                newIndex =
                    if model.ui.suggestionIndex <= 0 then
                        min 3 suggestLength - 1

                    else
                        model.ui.suggestionIndex - 1
            in
            ( { model | ui = { ui | suggestionIndex = newIndex } }, Cmd.none )

        SelectNextSuggestion suggestLength ->
            let
                newIndex =
                    if model.ui.suggestionIndex >= (min 3 suggestLength - 1) then
                        0

                    else
                        model.ui.suggestionIndex + 1
            in
            ( { model | ui = { ui | suggestionIndex = newIndex } }, Cmd.none )

        SelectFirstSuggestion ->
            ( { model | ui = { ui | suggestionIndex = 0 } }, Cmd.none )

        RequestInputBoundingBox id ->
            ( model, GetElementBoundingBoxById.requestBoundingBox id )

        RecieveInputBoundingBox result ->
            case result of
                Ok value ->
                    if value.element == "#add_pattern_input" then
                        ( { model | ui = { ui | patternInputLocation = ( value.left, value.bottom ) } }, Cmd.none )

                    else
                        ( model, Cmd.none )

                Err _ ->
                    ( model, Cmd.none )

        RecieveInputBoundingBoxes resultList ->
            let
                handleResult result =
                    case result of
                        Ok value ->
                            toFloat (value.top + value.bottom) / 2

                        Err _ ->
                            0.0
            in
            ( { model | ui = { ui | patternElementMiddleLocations = List.map handleResult resultList } }, Cmd.none )

        DragStart index _ _ ->
            ( { model | ui = { ui | mouseOverElementIndex = index, dragging = ( True, index ) } }, Cmd.none )

        DragEnd ->
            ( { model | ui = { ui | mouseOverElementIndex = -1, dragging = ( False, -1 ) } }, Cmd.none )

        DragOver _ eventJson ->
            let
                event =
                    Json.Decode.decodeValue mouseMoveDecoder eventJson

                mousePos =
                    case event of
                        Ok value ->
                            ( toFloat value.pageX, toFloat value.pageY )

                        Err _ ->
                            ( 0.0, 0.0 )

                closestElementToMouseY =
                    List.indexedMap (\index yPos -> ( index, Tuple.second mousePos - yPos )) model.ui.patternElementMiddleLocations
                        |> List.filter (\element -> Tuple.second element > 0)
                        |> List.sortWith
                            (\a b ->
                                case compare (Tuple.second a) (Tuple.second b) of
                                    LT ->
                                        LT

                                    EQ ->
                                        EQ

                                    GT ->
                                        GT
                            )
                        |> List.head
                        |> Maybe.withDefault ( List.length model.ui.patternElementMiddleLocations, 0 )
                        |> Tuple.first
            in
            ( { model
                | mousePos = mousePos
                , ui = { ui | mouseOverElementIndex = closestElementToMouseY }
              }
            , Cmd.none
            )

        Drag event ->
            let
                mouseEvent =
                    event.mouseEvent

                mousePos =
                    mouseEvent.clientPos
            in
            ( { model
                | mousePos = mousePos
              }
            , Cmd.none
            )

        Drop ->
            let
                index =
                    if model.ui.mouseOverElementIndex > originIndex then
                        model.ui.mouseOverElementIndex - 1

                    else
                        model.ui.mouseOverElementIndex

                originIndex =
                    Tuple.second model.ui.dragging

                stackResult =
                    applyPatternsToStack
                        Array.empty
                        castingContext
                        (List.reverse <| Tuple.first <| List.unzip <| Array.toList newUncoloredPatternArray)

                newStack =
                    stackResult.stack

                resultArray =
                    stackResult.resultArray

                newUncoloredPatternArray =
                    case Array.get originIndex patternArray of
                        Just element ->
                            Array.insertAt index element (removeFromArray originIndex (originIndex + 1) model.patternArray)

                        Nothing ->
                            patternArray

                newPatternArray =
                    Array.map2
                        (\patternTuple result ->
                            updateDrawingColors ( applyColorToPatternFromResult (Tuple.first patternTuple) result, Tuple.second patternTuple )
                        )
                        newUncoloredPatternArray
                        resultArray
            in
            ( { model
                | ui = { ui | mouseOverElementIndex = -1, dragging = ( False, -1 ) }
                , patternArray = newPatternArray
                , grid = { grid | points = updateGridPoints grid.width grid.height newPatternArray [] settings.gridScale }
                , stack = newStack
                , castingContext = stackResult.ctx
              }
            , Cmd.none
            )

        SetFocus id ->
            ( { model | ui = { ui | selectedInputID = id } }, Cmd.none )

        RecieveMouseOverHandle bool ->
            ( { model | ui = { ui | overDragHandle = bool } }, Cmd.none )

        ChangeHeldItem itemString ->
            let
                item =
                    case itemString of
                        "Trinket" ->
                            Trinket

                        "Cypher" ->
                            Cypher

                        "Artifact" ->
                            Artifact

                        "Spellbook" ->
                            Spellbook

                        "Focus" ->
                            Focus

                        "Pie" ->
                            Pie

                        _ ->
                            NoItem
            in
            ( { model | castingContext = { castingContext | heldItem = Debug.log "item" item, heldItemContent = Nothing } }, Cmd.none )

        RequestGridDrawingAsGIF ->
            ( { model | gridGifSrc = "loading" }, GetGridDrawingAsGif.requestGIF () )

        RecieveGridDrawingAsGIF src ->
            ( { model | gridGifSrc = src }, Cmd.none )

        UpdatePatternOuptut index replacementPattern ->
            let
                newUncoloredPatternArray =
                    Array.update index
                        (\patternTuple ->
                            case patternTuple of
                                ( _, d ) ->
                                    ( replacementPattern, d )
                        )
                        model.patternArray

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
            ( { model
                | patternArray = newPatternArray
                , grid = { grid | points = updateGridPoints grid.width grid.height newPatternArray [] settings.gridScale }
                , stack = newStack
                , castingContext = stackResult.ctx
              }
            , Cmd.none
            )

        SetInsertionPoint index keys ->
            if keys.shift then
                if model.insertionPoint == index then
                    ( { model | insertionPoint = 0 }, Cmd.none )

                else
                    ( { model | insertionPoint = index }, Cmd.none )

            else
                ( model, Cmd.none )

        SetImportInputValue string ->
            ( { model | ui = { ui | importInput = string } }, Cmd.none )

        ImportText string ->
            let
                importQueue =
                    parseInput string
            in
            updatePatternArrayFromQueue { model | importQueue = importQueue }



-- argg : List (List (GridPoint)) -> (Float, Float) -> List (List (GridPoint))
-- argg points mousePos =
--     List.map (\x -> (List.map (\y -> {y | connectedPoints = [{x = Tuple.first mousePos - 380.0, y = Tuple.second mousePos}]}) x)) points
-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions _ =
    Sub.batch
        [ Browser.Events.onResize (\_ _ -> WindowResize)
        , Time.every 50 Tick
        , HexNumGen.recieveNumber RecieveGeneratedNumberLiteral
        , GetElementBoundingBoxById.recieveBoundingBox (Json.Decode.decodeValue locationDecoder >> RecieveInputBoundingBox)
        , GetElementBoundingBoxById.recieveBoundingBoxes (List.map (Json.Decode.decodeValue locationDecoder) >> RecieveInputBoundingBoxes)
        , CheckMouseOverDragHandle.recieveCheckMouseOverDragHandle RecieveMouseOverHandle
        , GetGridDrawingAsGif.recieveGIF RecieveGridDrawingAsGIF
        ]


mouseMoveDecoder : Decoder MouseMoveData
mouseMoveDecoder =
    Json.Decode.map4 MouseMoveData
        (Json.Decode.at [ "pageX" ] Json.Decode.int)
        (Json.Decode.at [ "pageY" ] Json.Decode.int)
        (Json.Decode.at [ "target", "offsetHeight" ] Json.Decode.float)
        (Json.Decode.at [ "target", "offsetWidth" ] Json.Decode.float)


locationDecoder =
    Json.Decode.map5 ElementLocation
        (Json.Decode.field "element" Json.Decode.string)
        (Json.Decode.field "left" Json.Decode.int)
        (Json.Decode.field "bottom" Json.Decode.int)
        (Json.Decode.field "top" Json.Decode.int)
        (Json.Decode.field "right" Json.Decode.int)


view model =
    { title = "Hex Studio"
    , body = [ content model ]
    }
