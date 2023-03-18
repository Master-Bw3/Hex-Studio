module Logic.App.ImportExport.ExportAsGiveCommand exposing (..)

import Array exposing (Array)
import Logic.App.Types exposing (Pattern)


exportAsGiveCommand : Array Pattern -> String
exportAsGiveCommand patternArray =
    let
        singatureList =
            patternArray
                |> Array.toList
                |> List.reverse
                |> List.map (\pattern -> pattern.signature)

        commandStartString =
            "/give @p hexcasting:focus{data: {\"hexcasting:type\": \"hexcasting:list\", \"hexcasting:data\": ["

        patternStartString =
            "{\"hexcasting:type\": \"hexcasting:pattern\", \"hexcasting:data\": {angles: [B; "

        mapAngleToBytes angle =
            case angle of
                "w" ->
                    "0B"

                "e" ->
                    "1B"

                "d" ->
                    "2B"

                "a" ->
                    "4B"

                "q" ->
                    "5B"

                _ ->
                    "3B"

        patternEndString =
            "], start_dir: 0b}}"

        commandEndString =
            "]}} 1"
    in
    [ commandStartString
    , List.map
        (\signature ->
            [ patternStartString
            , List.map mapAngleToBytes
                (String.split "" signature)
                |> String.join ", "
            , patternEndString
            ]
                |> String.concat
        )
        singatureList
        |> String.join ", "
    , commandEndString
    ]
        |> String.concat
