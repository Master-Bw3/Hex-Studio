module Logic.App.ImportExport.ImportParser exposing (..)

import Array exposing (Array)
import Logic.App.Patterns.PatternRegistry exposing (getPatternFromName)
import Logic.App.Types exposing (Pattern)
import Logic.App.Utils.RegexPatterns exposing (bookkeepersPattern, bookkeepersValuePattern, commentPattern, numberValuePattern)
import Regex
import String exposing (String)


parseInput input =
    let
        getPatternFromString string =
            if string == "{" then
                getPatternFromName "open_paren"

            else if string == "}" then
                getPatternFromName "close_paren"

            else if Regex.contains numberValuePattern string then
                Regex.find numberValuePattern string
                    |> List.map (\val -> val.match)
                    |> List.head
                    |> Maybe.withDefault ""
                    |> String.dropLeft 1
                    |> String.trim
                    |> getPatternFromName

            else if Regex.contains bookkeepersValuePattern string then
                Regex.find bookkeepersValuePattern string
                    |> List.map (\val -> val.match)
                    |> List.head
                    |> Maybe.withDefault ""
                    |> String.dropLeft 1
                    |> String.trim
                    |> getPatternFromName

            else
                getPatternFromName string
    in
    input
        |> String.split "\n"
        |> List.map (Regex.replace commentPattern (\_ -> ""))
        |> List.map String.trim
        |> List.filter (\l -> l /= "")
        |> List.map getPatternFromString
        |> Debug.log "i"
