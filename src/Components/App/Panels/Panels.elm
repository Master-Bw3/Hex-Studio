module Components.App.Panels.Panels exposing (panels)

import Components.App.Panels.ConfigHexPanel exposing (configHexPanel)
import Components.App.Panels.PatternPanel exposing (patternPanel)
import Components.App.Panels.StackPanel exposing (stackPanel)
import Html exposing (..)
import Html.Attributes exposing (class, id)
import Logic.App.Model exposing (Model)
import Logic.App.Msg exposing (Msg)


panels : Model -> Html Msg
panels model =
    div [ id "panels" ]
        [ patternPanel model
        , stackPanel model
        , configHexPanel model
        ]
