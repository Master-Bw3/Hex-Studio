module Logic.App.ImportExport.ImportParser exposing (..)

import Array exposing (Array)
import Logic.App.Types exposing (Pattern)



-- parseInput : String -> Array Pattern


parseInput input =
    input
    |> String.split "\n"
    |> List.map String.trim
    |> List.filter (not << (String.startsWith "//"))
    |> Debug.log "i"
