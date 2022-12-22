module Pages.App exposing (Model, Msg, page)

import Array exposing (Array)
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
      , patternList = Array.empty
      , ui = { openPanels = [ PatternPanel ] }
      }
    , Cmd.none
    )


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
