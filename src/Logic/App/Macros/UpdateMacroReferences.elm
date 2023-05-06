module Logic.App.Macros.UpdateMacroReferences exposing (..)

import Array
import Dict
import Logic.App.Model exposing (Model)
import Logic.App.Patterns.PatternRegistry exposing (getPatternFromSignature)
import Logic.App.Types exposing (Iota(..))


updateMacroReferences : Model -> Model
updateMacroReferences model =
    let
        castingContext =
            model.castingContext

        newerMacroDict =
            --this is to fix macros inside of macros not showing the macro name
            Dict.map
                (\_ macro ->
                    case macro of
                        ( displayName, startDirection, iota ) ->
                            ( displayName
                            , startDirection
                            , case iota of
                                IotaList iotaList ->
                                    IotaList <|
                                        Array.map
                                            (\i ->
                                                case i of
                                                    PatternIota pattern considered ->
                                                        PatternIota (getPatternFromSignature (Just castingContext.macros) pattern.signature) considered

                                                    _ ->
                                                        i
                                            )
                                            iotaList

                                _ ->
                                    iota
                            )
                )
                castingContext.macros

        newPatternArray =
            Array.map
                (\tuple ->
                    case tuple of
                        ( pattern, gridpoints ) ->
                            case Dict.get pattern.signature newerMacroDict of
                                Just ( displayName, _, _ ) ->
                                    ( { pattern | displayName = displayName }, gridpoints )

                                _ ->
                                    ( pattern, gridpoints )
                )
                model.patternArray

        updateIotaArray iotaArray =
            Array.map updateIota iotaArray

        updateIota iota =
            case iota of
                PatternIota pattern considered ->
                    case Dict.get pattern.signature newerMacroDict of
                        Just ( displayName, _, _ ) ->
                            PatternIota { pattern | displayName = displayName } considered

                        _ ->
                            PatternIota pattern considered

                IotaList list ->
                    IotaList (updateIotaArray list)

                OpenParenthesis list ->
                    OpenParenthesis (updateIotaArray list)

                _ ->
                    iota
    in
    --TODO: update ravenmind, held item, idk what else this is an absolute pain and this code is garbage and jank
    { model
        | castingContext =
            { castingContext
                | macros = newerMacroDict
                , ravenmind = Maybe.map updateIota castingContext.ravenmind
                , heldItemContent = Maybe.map updateIota castingContext.heldItemContent
            }
        , patternArray = newPatternArray
        , stack = updateIotaArray model.stack
    }
