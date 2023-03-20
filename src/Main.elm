module Main exposing (main)

import Array
import Array.Extra as Array
import Browser
import Browser.Dom exposing (getElement)
import Browser.Events
import Components.App.Content exposing (content)
import Components.App.ContextMenu.Configs as Configs
import Components.App.ContextMenu.ContextMenu exposing (..)
import Components.App.Grid exposing (..)
import ContextMenu
import Dict exposing (Dict)
import File.Download as Download
import Html exposing (..)
import Json.Decode exposing (Decoder)
import Keyboard.Event exposing (decodeKeyboardEvent)
import Logic.App.Grid exposing (drawPatterns, sortPatterns)
import Logic.App.ImportExport.ImportParser exposing (parseInput)
import Logic.App.Model exposing (Model)
import Logic.App.Msg exposing (..)
import Logic.App.PatternList.PatternArray exposing (addToPatternArray, applyColorToPatternFromResult, setDrawingColor, updateDrawingColors)
import Logic.App.Patterns.MetaActions exposing (applyMetaAction)
import Logic.App.Patterns.PatternRegistry exposing (..)
import Logic.App.Stack.EvalStack exposing (applyPatternsToStack)
import Logic.App.Types exposing (..)
import Logic.App.Utils.GetAngleSignature exposing (getAngleSignatureAndStartDir)
import Logic.App.Utils.Utils exposing (removeFromArray, unshift)
import Ports.CheckMouseOverDragHandle as CheckMouseOverDragHandle
import Ports.GetElementBoundingBoxById as GetElementBoundingBoxById
import Ports.GetGridDrawingAsGif as GetGridDrawingAsGif
import Ports.GetGridDrawingAsImage as GetGridDrawingAsImage
import Ports.HexNumGen as HexNumGen
import Settings.Theme exposing (..)
import String exposing (fromInt)
import Task
import Time
import Logic.App.Utils.GetIotaValue exposing (getIotaTypeAsString)
import Logic.App.Utils.GetIotaValue exposing (getIotaValueAsString)
import Logic.App.Patterns.OperatorUtils exposing (makeConstant)


main =
    Browser.document
        { init = init
        , update = update
        , view = view
        , subscriptions = subscriptions
        }


init : () -> ( Model, Cmd Msg )
init _ =
    let
        ( contextMenu, msg ) =
            ContextMenu.init
    in
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
            , openOverlay = NoOverlay
            }
      , grid =
            { height = 0
            , width = 0
            , points = []
            , drawnPoints = []
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
            , macros = Dict.empty
            }
      , time = 0
      , downloadSrc = ""
      , insertionPoint = 0
      , importQueue = []
      , timeline = Array.empty
      , timelineIndex = 0
      , lastEvent = Nothing
      , contextMenu = contextMenu
      , config = Configs.winChrome
      , message = ""
      }
    , Cmd.batch [ Task.attempt GetGrid (getElement "hex_grid"), Task.attempt GetContentSize (getElement "content"), Cmd.map ContextMenuMsg msg ]
    )


updatePatternArrayFromQueue : Int -> Model -> ( Model, Cmd Msg )
updatePatternArrayFromQueue insertionPoint model =
    if List.length model.importQueue > 0 then
        let
            ui =
                model.ui

            castingContext =
                model.castingContext

            stackResult =
                applyPatternsToStack Array.empty castingContext (List.reverse <| List.map (\x -> Tuple.first x) <| Array.toList (addToPatternArray model newPattern insertionPoint))

            getPattern =
                List.head model.importQueue
                    |> Maybe.withDefault ( unknownPattern, Cmd.none )

            newPattern =
                Tuple.first <| getPattern

            command =
                Tuple.second <| getPattern

            newUncoloredPatternArray =
                addToPatternArray
                    model
                    newPattern
                    insertionPoint

            newPatternArray =
                Array.map2
                    (\patternTuple result ->
                        updateDrawingColors ( applyColorToPatternFromResult (Tuple.first patternTuple) result, Tuple.second patternTuple )
                    )
                    newUncoloredPatternArray
                    stackResult.resultArray

            patterns =
                Array.map (\x -> Tuple.first x) newPatternArray

            drawPatternsResult =
                drawPatterns patterns model.grid
        in
        if command == Cmd.none then
            updatePatternArrayFromQueue insertionPoint <|
                applyMetaAction
                    { model
                        | patternArray = drawPatternsResult.patternArray
                        , ui = { ui | patternInputField = "" }
                        , stack = stackResult.stack
                        , castingContext = stackResult.ctx
                        , grid = drawPatternsResult.grid
                        , importQueue = Maybe.withDefault [] <| List.tail model.importQueue
                        , timeline = unshift { stack = Array.empty, patternIndex = -1 } stackResult.timeline
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
        update (SetTimelineIndex (Array.length model.timeline)) model


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
                            applyPatternsToStack Array.empty castingContext (List.reverse <| List.map (\x -> Tuple.first x) <| Array.toList (addToPatternArray model newPattern model.insertionPoint))

                        newStack =
                            stackResult.stack

                        resultArray =
                            stackResult.resultArray

                        ( signature, startDir ) =
                            getAngleSignatureAndStartDir drawing.activePath

                        directionlessPattern =
                            getPatternFromSignature (Just model.castingContext.macros) signature

                        newPattern =
                            { directionlessPattern | startDirection = startDir }

                        newUncoloredPatternArray =
                            addToPatternArray
                                model
                                newPattern
                                model.insertionPoint

                        newPatternArray =
                            Array.map2
                                (\patternTuple result ->
                                    updateDrawingColors ( applyColorToPatternFromResult (Tuple.first patternTuple) result, Tuple.second patternTuple )
                                )
                                newUncoloredPatternArray
                                resultArray

                        newGrid =
                            { grid
                                | --points = updateGridPoints grid.width grid.height newPatternArray [] settings.gridScale,
                                  drawing = { drawing | drawingMode = False, activePath = [] }
                            }

                        newModel =
                            applyMetaAction
                                { model
                                    | patternArray = newPatternArray
                                    , grid = newGrid
                                    , stack = newStack
                                    , castingContext = stackResult.ctx
                                    , timeline = unshift { stack = Array.empty, patternIndex = -1 } stackResult.timeline
                                    , insertionPoint =
                                        if model.insertionPoint > Array.length model.patternArray then
                                            0

                                        else
                                            model.insertionPoint
                                }
                                newPattern.metaAction
                    in
                    update (SetTimelineIndex (Array.length newModel.timeline)) <| newModel

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
            update (SetTimelineIndex (Array.length stackResult.timeline + 1)) <|
                { model
                    | patternArray = newPatternArray
                    , grid = { grid | points = updateGridPoints grid.width grid.height newPatternArray [] settings.gridScale }
                    , stack = newStack
                    , castingContext = stackResult.ctx
                    , timeline = unshift { stack = Array.empty, patternIndex = -1 } stackResult.timeline
                    , insertionPoint =
                        if model.insertionPoint > Array.length newPatternArray then
                            0

                        else if model.insertionPoint < endIndex then
                            max model.insertionPoint 0

                        else
                            max (model.insertionPoint - 1) 0
                }

        SetGridScale scale ->
            ( sortPatterns { model | grid = { grid | points = updateGridPoints grid.width grid.height model.patternArray [] scale }, settings = { settings | gridScale = scale } }, Cmd.none )

        WindowResize ->
            ( model, Cmd.batch [ Task.attempt GetGrid (getElement "hex_grid"), Task.attempt GetContentSize (getElement "content") ] )

        Tick newTime ->
            let
                autocompleteIndex =
                    if model.ui.patternInputField == "" then
                        0

                    else
                        model.ui.suggestionIndex

                drawnPoints =
                    grid.drawnPoints
            in
            ( { model
                | time = Time.posixToMillis newTime
                , grid = { grid | drawnPoints = updatemidLineOffsets drawnPoints (Time.posixToMillis newTime) }
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
                        getPatternFromName (Just model.castingContext.macros) name :: model.importQueue

                    else
                        model.importQueue
            in
            updatePatternArrayFromQueue model.insertionPoint { model | importQueue = newImportQueue }

        SendNumberLiteralToGenerate number ->
            ( model, HexNumGen.sendNumber number )

        RecieveGeneratedNumberLiteral signature ->
            let
                newPattern =
                    getPatternFromSignature (Just model.castingContext.macros) signature
            in
            updatePatternArrayFromQueue model.insertionPoint
                { model
                    | importQueue = ( newPattern, Cmd.none ) :: model.importQueue
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
            update (SetTimelineIndex (Array.length stackResult.timeline + 1)) <|
                sortPatterns
                    { model
                        | ui = { ui | mouseOverElementIndex = -1, dragging = ( False, -1 ) }
                        , patternArray = newPatternArray
                        , grid = { grid | points = updateGridPoints grid.width grid.height newPatternArray [] settings.gridScale }
                        , stack = newStack
                        , castingContext = stackResult.ctx
                        , timeline = unshift { stack = Array.empty, patternIndex = -1 } stackResult.timeline
                    }

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
            ( { model | castingContext = { castingContext | heldItem = item, heldItemContent = Nothing } }, Cmd.none )

        RequestGridDrawingAsGIF ->
            ( { model | downloadSrc = "" }, GetGridDrawingAsGif.requestGIF () )

        RecieveGridDrawingAsGIF src ->
            ( { model | downloadSrc = src }, Download.url src )

        RequestGridDrawingAsImage ->
            ( { model | downloadSrc = "" }, GetGridDrawingAsImage.requestImage () )

        RecieveGridDrawingAsImage src ->
            ( { model | downloadSrc = src }, Download.url src )

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
            update (SetTimelineIndex (Array.length stackResult.timeline + 1)) <|
                { model
                    | patternArray = newPatternArray
                    , grid = { grid | points = updateGridPoints grid.width grid.height newPatternArray [] settings.gridScale }
                    , stack = newStack
                    , castingContext = stackResult.ctx
                    , timeline = unshift { stack = Array.empty, patternIndex = -1 } stackResult.timeline
                }

        SetInsertionPoint index ->
            Debug.log "e" <|
                if model.insertionPoint == index then
                    ( { model | insertionPoint = 0 }, Cmd.none )

                else
                    ( { model | insertionPoint = index }, Cmd.none )

        SetImportInputValue string ->
            ( { model | ui = { ui | importInput = string } }, Cmd.none )

        ImportText string ->
            let
                importQueue =
                    parseInput string model.castingContext.macros
            in
            updatePatternArrayFromQueue model.insertionPoint { model | importQueue = importQueue, ui = { ui | openOverlay = NoOverlay, importInput = "" } }

        ViewOverlay overlay ->
            ( { model | ui = { ui | openOverlay = overlay } }, Cmd.none )

        Download string ->
            ( model, Download.string "Hex.hexcasting" "text/plain" string )

        SetTimelineIndex index ->
            let
                timeline =
                    if Array.length model.timeline < 2 then
                        Array.repeat 2 { stack = Array.empty, patternIndex = -1 }

                    else
                        model.timeline

                timelinePatternIndex =
                    if index >= 0 then
                        Array.reverse timeline
                            |> Array.get index
                            |> Maybe.andThen (\x -> Just x.patternIndex)
                            |> Maybe.withDefault (Array.length timeline)

                    else
                        -1

                greyDrawingsPatternArray =
                    Array.reverse <|
                        Array.fromList <|
                            List.map
                                (\indexTuple ->
                                    case indexTuple of
                                        ( patternIndex, tuple ) ->
                                            case tuple of
                                                ( pat, draw ) ->
                                                    if timelinePatternIndex < patternIndex then
                                                        ( pat, setDrawingColor draw "gray" )

                                                    else
                                                        tuple
                                )
                                (Array.toIndexedList <| Array.reverse model.patternArray)
            in
            ( { model
                | timelineIndex = index
                , grid =
                    { grid
                        | drawnPoints = genDrawnPointsFromPatternArray greyDrawingsPatternArray
                        , points = updateUsedGridPoints grid.width grid.height greyDrawingsPatternArray [] settings.gridScale
                    }
                , stack =
                    if index == Array.length timeline then
                        model.stack

                    else
                        Array.reverse timeline
                            |> Array.get index
                            |> Maybe.andThen (\x -> Just x.stack)
                            |> Maybe.withDefault Array.empty
              }
            , Cmd.none
            )

        HandleKeyboardEvent event ->
            let
                timeline =
                    if Array.length model.timeline < 2 then
                        Array.repeat 2 { stack = Array.empty, patternIndex = -1 }

                    else
                        model.timeline
            in
            if event.altKey == True && event.key == Just "ArrowRight" then
                update (SetTimelineIndex <| min (Array.length timeline - 2) <| model.timelineIndex + 1) model

            else if event.altKey == True && event.key == Just "ArrowLeft" then
                update (SetTimelineIndex <| min (Array.length timeline - 3) <| max -1 <| model.timelineIndex - 1) model

            else
                ( model, Cmd.none )

        ChangeMacroName signature newName ->
            let
                updatedMacroDict =
                    Debug.log "hi" <|
                        Dict.update signature
                            (Maybe.map
                                (\value ->
                                    case value of
                                        ( _, direction, iota ) ->
                                            ( newName, direction, iota )
                                )
                            )
                            model.castingContext.macros
            in
            ( { model | castingContext = { castingContext | macros = updatedMacroDict } }, Cmd.none )

        ContextMenuMsg message ->
            let
                ( contextMenu, cmd ) =
                    ContextMenu.update message model.contextMenu
            in
            ( { model | contextMenu = contextMenu }
            , Cmd.map ContextMenuMsg cmd
            )

        ExpandMacro sig index ->
            let
                patterns =
                    List.map (\pat -> ( pat, Cmd.none )) <|
                        case Dict.get sig model.castingContext.macros of
                            Just ( _, _, IotaList patternList ) ->
                                Array.toList <|
                                    Array.map
                                        (\iota ->
                                            case iota of
                                                PatternIota pattern _ ->
                                                    pattern

                                                i ->
                                                    { signature = ""
                                                    , startDirection = East
                                                    , action = makeConstant i
                                                    , metaAction = None
                                                    , displayName = "Constant: " ++ getIotaValueAsString i
                                                    , internalName = "constant"
                                                    , color = accent1
                                                    , outputOptions = []
                                                    , selectedOutput = Nothing
                                                    , active = True
                                                    }
                                        )
                                        patternList

                            _ ->
                                []
            in
            updatePatternArrayFromQueue index { model | importQueue = patterns, patternArray = removeFromArray index (index + 1) model.patternArray }


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.batch
        [ Browser.Events.onResize (\_ _ -> WindowResize)
        , Time.every 100 Tick
        , Browser.Events.onKeyDown (Json.Decode.map HandleKeyboardEvent decodeKeyboardEvent)
        , HexNumGen.recieveNumber RecieveGeneratedNumberLiteral
        , GetElementBoundingBoxById.recieveBoundingBox (Json.Decode.decodeValue locationDecoder >> RecieveInputBoundingBox)
        , GetElementBoundingBoxById.recieveBoundingBoxes (List.map (Json.Decode.decodeValue locationDecoder) >> RecieveInputBoundingBoxes)
        , CheckMouseOverDragHandle.recieveCheckMouseOverDragHandle RecieveMouseOverHandle
        , GetGridDrawingAsGif.recieveGIF RecieveGridDrawingAsGIF
        , GetGridDrawingAsImage.recieveImage RecieveGridDrawingAsImage
        , Sub.map ContextMenuMsg (ContextMenu.subscriptions model.contextMenu)
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
    , body =
        [ content model
        , ContextMenu.view
            model.config
            ContextMenuMsg
            toItemGroups
            model.contextMenu
        ]
    }
