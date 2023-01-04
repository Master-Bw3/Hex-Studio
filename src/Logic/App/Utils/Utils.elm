module Logic.App.Utils.Utils exposing (..)

import Array exposing (Array)
import Html.Events.Extra.Touch as Touch



-- add an item to the front of an array


unshift : a -> Array a -> Array a
unshift item array =
    Array.append (Array.fromList [ item ]) array


removeFromArray : Int -> Int -> Array a -> Array a
removeFromArray start end array =
    let

        rangeToRemove =
            List.range start (end - 1)

        removeRange item =
            not <| List.member (Tuple.first item) rangeToRemove
    in
    Array.fromList <| Tuple.second <| List.unzip <| List.filter removeRange <| Array.toIndexedList array


touchCoordinates : Touch.Event -> ( Float, Float )
touchCoordinates touchEvent =
    List.head touchEvent.changedTouches
        |> Maybe.map .clientPos
        |> Maybe.withDefault ( 0, 0 )
