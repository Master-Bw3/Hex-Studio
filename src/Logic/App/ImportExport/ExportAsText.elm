module Logic.App.ImportExport.ExportAsText exposing (..)

import Array exposing (Array)
import Logic.App.ImportExport.ExportAsGiveCommand exposing (exportAsGiveCommand)
import Logic.App.Types exposing (Pattern)


exportPatternsAsLineList : Array Pattern -> String
exportPatternsAsLineList patternArray =
    let
        _ =
            Debug.log "give" (exportAsGiveCommand patternArray)

        mapPatternToLine : Pattern -> ( Int, List String ) -> ( Int, List String )
        mapPatternToLine pattern accumulator =
            let
                indentDepth =
                    Tuple.first accumulator

                lines =
                    Tuple.second accumulator

                applyIndent depth string =
                    List.repeat depth "    "
                        ++ [ string ]
                        |> String.concat
            in
            case pattern.internalName of
                "open_paren" ->
                    ( indentDepth + 1, applyIndent indentDepth "{" :: lines )

                "close_paren" ->
                    ( indentDepth - 1, applyIndent (indentDepth - 1) "}" :: lines )

                _ ->
                    ( indentDepth, applyIndent indentDepth pattern.displayName :: lines )
    in
    Array.foldr mapPatternToLine ( 0, [] ) patternArray
        |> Tuple.second
        |> List.reverse
        |> String.join "\n"
