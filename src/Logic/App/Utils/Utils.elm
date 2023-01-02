module Logic.App.Utils.Utils exposing (..)

import Array exposing (Array)



-- add an item to the front of an array


unshift : a -> Array a -> Array a
unshift item array =
    Array.append (Array.fromList [ item ]) array


removeFromArray : Int -> Int -> Array a -> Array a
removeFromArray start end array =
    let
        debug =
            Debug.log "remove this" <| rangeToRemove

        rangeToRemove =
            List.range start (end - 1)

        removeRange item =
            not <| List.member (Tuple.first item) rangeToRemove
    in
    Array.fromList <| Tuple.second <| List.unzip <| List.filter removeRange <| Array.toIndexedList array
