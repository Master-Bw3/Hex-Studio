module Logic.App.ImportExport.ExportAsText exposing (..)

import Array exposing (Array)
import Logic.App.Types exposing (Pattern)


exportPatternsAsText : Array Pattern -> String
exportPatternsAsText patternArray =
    let
        mapPatternToLine : Pattern -> String
        mapPatternToLine pattern =
            case pattern.internalName of
                "open_paren" ->
                    "{"

                "close_paren" ->
                    "{"

                _ ->
                    pattern.displayName
    in
    Array.map mapPatternToLine patternArray
        |> Array.toList
        |> String.join "\n"
