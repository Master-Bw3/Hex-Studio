module Logic.App.Model exposing (..)

import Array exposing (Array)
import Logic.App.Types exposing (Panel, PatternType)


type alias Model =
    { stack : Array Int
    , patternList : Array PatternType
    , ui :
        { openPanels : List Panel
        }
    }
