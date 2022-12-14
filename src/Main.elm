module Main exposing (main)

import Array
import Browser
import Browser.Dom exposing (getElement)
import Browser.Events
import Components.App.Content exposing (content)
import Components.App.Grid exposing (..)
import Html exposing (..)
import Logic.App.Model as L exposing (Model)
import Logic.App.Msg as L exposing (..)
import Logic.App.PatternList.PatternArray exposing (addToPatternArray, updateDrawingColors)
import Logic.App.Patterns.PatternRegistry exposing (..)
import Logic.App.Stack.Stack exposing (applyPatternToStack, applyPatternsToStack)
import Logic.App.Types exposing (..)
import Logic.App.Utils.GetAngleSignature exposing (getAngleSignature)
import Logic.App.Utils.Utils exposing (removeFromArray)
import Ports.HexNumGen as HexNumGen
import Settings.Theme exposing (..)
import Task
import Time


type alias Model =
    L.Model


type alias Msg =
    L.Msg


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
                        newPattern =
                            getPatternFromSignature <| getAngleSignature drawing.activePath

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
                points =
                    grid.points
            in
            ( { model
                | time = Time.posixToMillis newTime
                , grid = { grid | points = updatemidLineOffsets points (Time.posixToMillis newTime) }
              }
            , Cmd.none
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
            ( model, HexNumGen.call number )

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

        SelectNextSuggestion suggestLength ->
            let
                newIndex =
                    if model.ui.suggestionIndex >= (min 3 (Debug.log "e" suggestLength) - 1) then
                        Debug.log "s_index" 0

                    else
                        Debug.log "s_index" <| model.ui.suggestionIndex + 1
            in
            ( { model | ui = { ui | suggestionIndex = newIndex } }, Cmd.none )



-- argg : List (List (GridPoint)) -> (Float, Float) -> List (List (GridPoint))
-- argg points mousePos =
--     List.map (\x -> (List.map (\y -> {y | connectedPoints = [{x = Tuple.first mousePos - 380.0, y = Tuple.second mousePos}]}) x)) points
-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.batch [ Browser.Events.onResize (\_ _ -> WindowResize), Time.every 50 Tick, HexNumGen.return RecieveGeneratedNumberLiteral ]


view model =
    { title = "Hex Studio"
    , body = [ content model ]
    }
