module Logic.App.PatternList.PatternArray exposing (addToPatternArray, getPatternFromName, getPatternFromSignature, updateDrawingColors)

import Array exposing (Array)
import Html.Attributes exposing (name)
import Logic.App.Model exposing (Model)
import Logic.App.Patterns.PatternRegistry exposing (..)
import Logic.App.Types exposing (GridPoint, PatternType)
import Ports.HexNumGen as HexNumGen


getPatternFromSignature : String -> PatternType
getPatternFromSignature signature =
    case List.head <| List.filter (\regPattern -> regPattern.signature == signature) patternRegistry of
        Just a ->
            a

        Nothing ->
            if String.startsWith "aqaa" signature then
                numberLiteralGenerator signature False

            else if String.startsWith "dedd" signature then
                numberLiteralGenerator signature True

            else
                { unknownPattern | signature = signature, displayName = "Pattern " ++ "\"" ++ signature ++ "\"" }


getPatternFromName : String -> ( PatternType, Cmd msg )
getPatternFromName name =
    case List.head <| List.filter (\regPattern -> regPattern.displayName == name || regPattern.internalName == name || regPattern.signature == name) patternRegistry of
        Just a ->
            ( a, Cmd.none )

        Nothing ->
            case String.toFloat name of
                Just number ->
                    ( unknownPattern, HexNumGen.call number )

                Nothing ->
                    ( unknownPattern, Cmd.none )


addToPatternArray : Model -> PatternType -> Array ( PatternType, List GridPoint )
addToPatternArray model pattern =
    let
        patternList =
            model.patternArray

        drawing =
            model.grid.drawing

        patternDrawingPair =
            ( pattern, drawing.activePath )
    in
    Debug.log "eee" <| Array.append (Array.fromList [ updateDrawingColors patternDrawingPair ]) patternList


updateDrawingColors : ( PatternType, List GridPoint ) -> ( PatternType, List GridPoint )
updateDrawingColors patternTuple =
    ( Tuple.first patternTuple
    , List.map
        (\pnt ->
            { pnt
                | connectedPoints =
                    List.map (\conPnt -> { conPnt | color = (Tuple.first patternTuple).color })
                        pnt.connectedPoints
            }
        )
        (Tuple.second patternTuple)
    )