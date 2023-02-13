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
    { signature : String
    , action : Array Iota -> Array Iota
    , displayName : String
    , internalName : String
    , color : String
    }


type PatternValidationState
    = Error
    | Success


type Mishap
    = InvalidPattern
    | NotEnoughIotas
    | IncorrectIota
    | VectorOutOfAmbit
    | EntityOutOfAmbit
    | EntityIsImmune
    | MathematicalError
    | IncorrectItem
    | IncorrectBlock
    | DelveTooDeep
    | TransgressOther
    | DisallowedAction
    | CatastrophicFailure


type Iota
    = Number Float
    | Vector ( Float, Float, Float )
    | Boolean Bool
    | Entity EntityType
    | IotaList (Array Iota)
    | Pattern PatternType Bool -- bool is for if pattern was from consideration
    | Null
    | Garbage Mishap
    | OpenParenthesis (Array Iota)


type alias GridPoint =
    { x : Float
    , y : Float
    , offsetX : Int -- doubled coordinates (https://www.redblobgames.com/grids/hexagons/#coordinates)
    , offsetY : Int
    , radius : Float
    , used : Bool
    , color : String
    , connectedPoints : List PointConnection
    }


type alias PointConnection =
    { color : String, offsetX : Int, offsetY : Int, betweenOffsetValues : ( ( Int, Int ), ( Int, Int ), ( Int, Int ) ) }


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


type alias ElementLocation =
    { element : String
    , left : Int
    , bottom : Int
    , top : Int
    , right : Int
    }
