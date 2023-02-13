module Main exposing (main)

import Array
import Array.Extra as Array
import Browser
import Browser.Dom exposing (getElement)
import Browser.Events
import Components.App.Content exposing (content)
import Components.App.Grid exposing (..)
import FontAwesome.Solid
import Html exposing (..)
import Json.Decode
import Logic.App.Model exposing (Model)
import Logic.App.Msg exposing (..)
import Logic.App.PatternList.PatternArray exposing (addToPatternArray, updateDrawingColors)
import Logic.App.Patterns.PatternRegistry exposing (..)
import Logic.App.Stack.Stack exposing (applyPatternsToStack)
import Logic.App.Types exposing (..)
import Logic.App.Utils.GetAngleSignature exposing (getAngleSignature)
import Logic.App.Utils.Utils exposing (removeFromArray)
import Ports.GetElementBoundingBoxById as GetElementBoundingBoxById
import Ports.HexNumGen as HexNumGen
import Settings.Theme exposing (..)
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
      , time = 0
      }
    , Cmd.batch [ Task.attempt GetGrid (getElement "hex_grid"), Task.attempt GetContentSize (getElement "content") ]
    )


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
                        precedingEscapeCount =
                            let
                                countEscapes patternTuple accumulator =
                                    if Tuple.second accumulator == True then
                                        if (Tuple.first patternTuple).internalName == "escape" then
                                            ( Tuple.first accumulator + 1, True )

                                        else
                                            ( Tuple.first accumulator, False )

                                    else
                                        ( Tuple.first accumulator, False )
                            in
                            Tuple.first <| Array.foldl countEscapes ( 0, True ) model.patternArray

                        newPattern =
                            let
                                uncoloredPattern =
                                    getPatternFromSignature <| getAngleSignature drawing.activePath
                            in
                            if modBy 2 precedingEscapeCount == 1 then
                                { uncoloredPattern | color = accent5 }

                            else
                                uncoloredPattern

                        newGrid =
                            { grid
                                | points = applyActivePathToGrid model.grid.points (Tuple.second (updateDrawingColors ( newPattern, drawing.activePath )))
                                , drawing = { drawing | drawingMode = False, activePath = [] }
                            }
                    in
                    ( { model
                        | patternArray = addToPatternArray model newPattern
                        , grid = newGrid
                        , stack = applyPatternsToStack Array.empty (List.reverse <| List.map (\x -> Tuple.first x) <| Array.toList (addToPatternArray model newPattern)) False
                      }
                    , Cmd.none
                    )

                else
                    ( { model | grid = { grid | drawing = { drawing | drawingMode = False, activePath = [] } } }, Cmd.none )

            else
                ( model, Cmd.none )

        RemoveFromPatternArray startIndex endIndex ->
            let
                newPatternArray =
                    removeFromArray startIndex endIndex model.patternArray
            in
            ( { model
                | patternArray = newPatternArray
                , grid = { grid | points = updateGridPoints grid.width grid.height newPatternArray [] settings.gridScale }
                , stack = applyPatternsToStack Array.empty (List.reverse <| Tuple.first <| List.unzip <| Array.toList newPatternArray) False
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
            , GetElementBoundingBoxById.requestBoundingBox "add_pattern_input"
            )

        UpdatePatternInputField text ->
            ( { model | ui = { ui | patternInputField = text } }, Cmd.none )

        InputPattern name ->
            let
                getPattern =
                    getPatternFromName name

                newPattern =
                    Tuple.first <| getPattern

                command =
                    Tuple.second <| getPattern
            in
            if command == Cmd.none then
                ( { model
                    | patternArray = addToPatternArray model newPattern
                    , ui = { ui | patternInputField = "" }
                    , stack = applyPatternsToStack Array.empty (List.reverse <| List.map (\x -> Tuple.first x) <| Array.toList (addToPatternArray model newPattern)) False
                  }
                , Cmd.none
                )

            else
                ( model, command )

        SendNumberLiteralToGenerate number ->
            ( model, HexNumGen.sendNumber number )

        RecieveGeneratedNumberLiteral signature ->
            let
                newPattern =
                    getPatternFromSignature signature
            in
            ( { model
                | patternArray = addToPatternArray model newPattern
                , ui = { ui | patternInputField = "" }
                , stack = applyPatternsToStack Array.empty (List.reverse <| List.map (\x -> Tuple.first x) <| Array.toList (addToPatternArray model newPattern)) False
              }
            , Cmd.none
            )

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
                    ( { model | ui = { ui | patternInputLocation = ( value.left, value.bottom ) } }, Cmd.none )

                Err _ ->
                    ( model, Cmd.none )

        DragStart index _ _ ->
            ( { model | ui = { ui | mouseOverElementIndex = index, dragging = ( True, index ) } }, Cmd.none )

        DragEnd ->
            ( { model | ui = { ui | mouseOverElementIndex = -1, dragging = ( False, -1 ) } }, Cmd.none )

        DragOver index _ _ ->
            ( { model | ui = { ui | mouseOverElementIndex = index } }, Cmd.none )

        Drop index ->
            let
                originIndex =
                    Tuple.second model.ui.dragging

                newPatternArray =
                    case Array.get originIndex patternArray of
                        Just element ->
                            Array.insertAt index element (removeFromArray originIndex (originIndex + 1) model.patternArray)

                        Nothing ->
                            patternArray
            in
            ( { model
                | ui = { ui | mouseOverElementIndex = -1, dragging = ( False, -1 ) }
                , patternArray = newPatternArray
                , grid = { grid | points = updateGridPoints grid.width grid.height newPatternArray [] settings.gridScale }
                , stack = applyPatternsToStack Array.empty (List.reverse <| Tuple.first <| List.unzip <| Array.toList newPatternArray) False
              }
            , Cmd.none
            )

        SetFocus id ->
            ( { model | ui = { ui | selectedInputID = id } }, Cmd.none )



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
        ]


locationDecoder =
    Json.Decode.map4 ElementLocation
        (Json.Decode.field "left" Json.Decode.int)
        (Json.Decode.field "bottom" Json.Decode.int)
        (Json.Decode.field "top" Json.Decode.int)
        (Json.Decode.field "right" Json.Decode.int)


view model =
    { title = "Hex Studio"
    , body = [ content model ]
    }
