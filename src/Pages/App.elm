module Pages.App exposing (Model, Msg, page)

import Array exposing (Array)
import Browser.Dom exposing (getElement)
import Components.App.Content exposing (content)
import Gen.Params.App exposing (Params)
import Html exposing (..)
import Html.Attributes exposing (class, id)
import Logic.App.Model as L
import Logic.App.Msg as L exposing (..)
import Logic.App.Types exposing (..)
import Page
import Request
import Shared
import Task
import View exposing (View)
import Components.App.Grid exposing (..)

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
      , patternList = Array.empty
      , ui = { openPanels = [ PatternPanel ] }
      , grid =
            { height = 0
            , width = 0
            , points = []
            }
      }
    , Task.attempt GotGrid (getElement "hex_grid")
    )


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    let
        ui =
            model.ui

        grid =
            model.grid
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



-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.none



-- VIEW


view : Model -> View Msg
view model =
    { title = "Hex Studio"
    , body = [ content model ]
    }
