module Logic.App.Utils.DirectionMap exposing (..)
import Logic.App.Types exposing (Direction(..))
directionMap : List (Direction, (Int, Int))
directionMap =
    [ ( Northeast, ( 1, -1 ) )
    , ( East, ( 2, 0 ) )
    , ( Southeast, ( 1, 1 ) )
    , ( Southwest, ( -1, 1 ) )
    , ( West, ( -2, 0 ) )
    , ( Northwest, ( -1, -1 ) )
    ]