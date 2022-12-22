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

