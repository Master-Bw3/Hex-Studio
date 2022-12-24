module Logic.App.Types exposing (..)

import Array exposing (Array)


type Panel
    = StackPanel
    | PatternPanel


type EntityType
    = Player
    | Chicken
    | Minecart


type alias PatternType =
    {}


type Iota
    = Number Float
    | Vector Float
    | Boolean Bool
    | Entity EntityType
    | PatternList (Array PatternType)
    | IotaList (Array Iota)
    | Null
    | Pattern PatternType


type alias GridPoint =
    { x : Float
    , y : Float
    , radius : Float
    , used : Bool
    , color : String
    , connectedPoints : List { x : Float, y : Float }
    }


type alias CoordinatePair =
        { x1 : Float
        , y1 : Float
        , x2 : Float
        , y2 : Float
        }
