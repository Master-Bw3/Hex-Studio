module Logic.App.Types exposing (..)

import Array exposing (Array)


type Panel
    = StackPanel
    | PatternPanel


type EntityType
    = Unset
    | Player
    | Chicken
    | Minecart


type alias PatternType =
    { signature : String, action : Array Iota -> Array Iota, displayName : String, internalName : String }


type Iota
    = Number Float
    | Vector ( Float, Float, Float )
    | Boolean Bool
    | Entity EntityType
    | List (Array Iota)
    | Pattern PatternType
    | Null
    | Garbage

type alias GridPoint =
    { x : Float
    , y : Float
    , offsetX : Int -- doubled coordinates (https://www.redblobgames.com/grids/hexagons/#coordinates)
    , offsetY : Int
    , radius : Float
    , used : Bool
    , color : String
    , connectedPoints : List { offsetX : Int, offsetY : Int, betweenOffsetValues : ((Int, Int), (Int, Int), (Int, Int))}
    }


type alias CoordinatePair =
    { x1 : Float
    , y1 : Float
    , x2 : Float
    , y2 : Float
    }


type alias IntCoordinatePair =
    { x1 : Int
    , y1 : Int
    , x2 : Int
    , y2 : Int
    }
