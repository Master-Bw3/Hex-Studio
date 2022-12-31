module Logic.App.Utils.Utils exposing (..)
import Array exposing (Array)

-- add an item to the front of an array
unshift : a -> Array a -> Array a
unshift item array =
    Array.append (Array.fromList [item]) array
