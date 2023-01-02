module Pages.App exposing (Model, Msg, page)

import Array
import Browser.Dom exposing (getElement)
import Components.App.Content exposing (content)
import Components.App.Grid exposing (..)
import Gen.Params.App exposing (Params)
import Html exposing (..)
import Logic.App.Model as L exposing (Model)
import Logic.App.Msg as L exposing (..)
import Logic.App.PatternList.PatternArray exposing (addToPatternArray, getPatternFromSignature)
import Logic.App.Patterns.PatternRegistry exposing (..)
import Logic.App.Stack.Stack exposing (applyPatternToStack)
import Logic.App.Types exposing (..)
import Logic.App.Utils.GetAngleSignature exposing (getAngleSignature)
import Logic.App.Utils.Utils exposing (removeFromArray)
import Page
import Request
import Shared
import Task
import View exposing (View)


type alias Model =
    L.Model


type alias Msg =
    L.Msg


page : Shared.Model -> Request.With Params -> Page.With Model Msg
page shared req =
    Page.element
        { init = init
        , update = update
        , view = view
        , subscriptions = subscriptions
        }


init : ( Model, Cmd Msg )
init =
    ( { stack = Array.empty
      , patternArray = Array.empty
      , ui = { openPanels = [ PatternPanel ] }
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
      }
    , Cmd.batch [ Task.attempt GotGrid (getElement "hex_grid"), Task.attempt GotContent (getElement "content") ]
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
    in
    case msg of
        ViewPanel panel keys ->
            if not keys.shift then
                ( { model | ui = { ui | openPanels = [ panel ] } }, Cmd.none )

            else
                ( { model | ui = { ui | openPanels = ui.openPanels ++ [ panel ] } }, Cmd.none )

        GotGrid (Ok element) ->
            ( { model
                | grid =
                    { grid
                        | height = element.element.height
                        , width = element.element.width
                        , points = generateGrid element.element.width element.element.height
                    }
              }
            , Cmd.none
            )

        GotGrid (Err _) ->
            ( model, Cmd.none )

        GotContent (Ok element) ->
            ( { model
                | window =
                    { height = element.element.height, width = element.element.width }
              }
            , Cmd.none
            )

        GotContent (Err _) ->
            ( model, Cmd.none )

        MouseMove ( x, y ) ->
            if drawing.drawingMode == True then
                ( { model | mousePos = ( x, y ), grid = { grid | drawing = { drawing | activePath = addNearbyPoint model } } }, Cmd.none )

            else
                ( { model | mousePos = ( x, y ) }, Cmd.none )

        GridDown ->
            let
                closestPoint =
                    getClosestPoint model.mousePos grid.points model
            in
            if closestPoint.used == False then
                ( { model | grid = { grid | drawing = { drawing | drawingMode = True, activePath = [ closestPoint ] } } }, Cmd.none )

            else
                ( model, Cmd.none )

        MouseUp ->
            if drawing.drawingMode == True then
                if List.length drawing.activePath > 1 then
                    let
                        newGrid =
                            { grid | points = applyActivePathToGrid model, drawing = { drawing | drawingMode = False, activePath = [] } }

                        newPattern =
                            getPatternFromSignature <| getAngleSignature drawing.activePath
                    in
                    ( { model
                        | patternArray = addToPatternArray model newPattern
                        , grid = newGrid
                        , stack = applyPatternToStack model.stack newPattern
                      }
                    , Cmd.none
                    )

                else
                    ( { model | grid = { grid | drawing = { drawing | drawingMode = False, activePath = [] } } }, Cmd.none )

            else
                ( model, Cmd.none )

        RemoveFromPatternArray startIndex endIndex ->
            ( { model
                | patternArray = removeFromArray startIndex endIndex model.patternArray
                , grid = { grid | points = updateGridPoints model}
              }
            , Cmd.none
            )



-- argg : List (List (GridPoint)) -> (Float, Float) -> List (List (GridPoint))
-- argg points mousePos =
--     List.map (\x -> (List.map (\y -> {y | connectedPoints = [{x = Tuple.first mousePos - 380.0, y = Tuple.second mousePos}]}) x)) points
-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.none


view : Model -> View Msg
view model =
    let
        debug =
            --Debug.log "DEBUG" <| List.map (\x -> x.pattern.internalName) <| Array.toList model.patternList
            Debug.log "stack" <| Array.toList model.stack
    in
    { title = "Hex Studio"
    , body = [ content model ]
    }
