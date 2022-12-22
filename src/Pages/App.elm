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


page : Shared.Model -> Request.With Params -> Page.With Model Msg
page shared req =
    Page.element
        { init = init
        , update = update
        , view = view
        , subscriptions = subscriptions
        }



-- Types


type Panel
    = StackPanel
    | PatternPanel


type EntityType
    = Player
    | Chicken
    | Minecart


type alias Pattern =
    {}


type Iota
    = Number Float
    | Vector Float
    | Boolean Bool
    | Entity EntityType
    | PatternList (Array Pattern)
    | IotaList (Array Iota)
    | Null
    | Pattern Pattern


type alias Model =
    { stack : Array Int
    , patternList : Array Pattern
    , ui :
        { openPanels : List Panel
        }
    }


init : ( Model, Cmd Msg )
init =
    ( { stack = Array.empty
      , patternList = Array.empty
      , ui = { openPanels = [PatternPanel] }
      }
    , Cmd.none
    )



-- UPDATE


type Msg
    = ViewPanel Panel
    | ViewAdditionalPanel Panel


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        ViewPanel panel ->
            ( model, Cmd.none )

        ViewAdditionalPanel panel ->
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
