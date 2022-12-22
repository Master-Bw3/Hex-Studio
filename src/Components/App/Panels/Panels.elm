module Components.App.Panels.Panels exposing (panels)

import Components.App.Panels.PatternPanel exposing (patternPanel)
import Components.App.Panels.StackPanel exposing (stackPanel)

import Html exposing (..)
import Html.Attributes exposing (class, id)
import Logic.App.Model exposing (Model)


panels : Model -> Html msg
panels model =
    div [ id "panels" ]
        [ patternPanel model 
        , stackPanel model
        ]
