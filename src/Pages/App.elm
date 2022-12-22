module Pages.App exposing (Model, Msg, page)

import Array exposing (Array)
import Components.App.Content exposing (content)
import Gen.Params.App exposing (Params)
import Html exposing (..)
import Html.Attributes exposing (class, id)
import Page
import Request
import Shared
import View exposing (View)
import Logic.App.Model exposing (Model)
import Logic.App.Types exposing (..)



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
      }
    , Cmd.none
    )



-- UPDATE


type Msg
    = ViewPanel Panel
    | ViewAdditionalPanel Panel


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    let
        ui =
            model.ui
    in
    case msg of
        ViewPanel panel ->
            ( { model | ui = { ui | openPanels = [ panel ] } }, Cmd.none )

        ViewAdditionalPanel panel ->
            ( { model | ui = { ui | openPanels = ui.openPanels ++ [ panel ] } }, Cmd.none )



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
