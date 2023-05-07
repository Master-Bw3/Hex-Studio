module Logic.App.ImportExport.ImportExportProject exposing (..)

import Array exposing (Array)
import Bytes exposing (Bytes)
import Dict exposing (Dict)
import Json.Decode as Decode
import Json.Encode as Encode
import Logic.App.Model exposing (Model)
import Logic.App.Patterns.PatternRegistry exposing (getPatternFromSignature)
import Logic.App.Types exposing (CastingContext, Direction(..), HeldItem(..), Iota(..), IotaType(..), Mishap(..), Pattern)
import Serialize as S


directionCodec : S.Codec e Direction
directionCodec =
    S.customType
        (\northeastEncoder northwestEncoder eastEncoder westEncoder southeastEncoder southwestEncoder errorDirectionEncoder value ->
            case value of
                Northeast ->
                    northeastEncoder

                Northwest ->
                    northwestEncoder

                East ->
                    eastEncoder

                West ->
                    westEncoder

                Southeast ->
                    southeastEncoder

                Southwest ->
                    southwestEncoder

                ErrorDirection ->
                    errorDirectionEncoder
        )
        |> S.variant0 Northeast
        |> S.variant0 Northwest
        |> S.variant0 East
        |> S.variant0 West
        |> S.variant0 Southeast
        |> S.variant0 Southwest
        |> S.variant0 ErrorDirection
        |> S.finishCustomType


type alias SimplifiedPattern =
    { signature : String
    , active : Bool
    , startDirection : Direction
    }


type SimplifiedIota
    = SimplifiedNumber Float
    | SimplifiedVector ( Float, Float, Float )
    | SimplifiedBoolean Bool
    | SimplifiedEntity String
    | SimplifiedIotaList (Array SimplifiedIota)
    | SimplifiedPatternIota SimplifiedPattern Bool
    | SimplifiedNull
    | SimplifiedGarbage Mishap
    | SimplifiedOpenParenthesis (Array SimplifiedIota)


patternCodec : S.Codec e SimplifiedPattern
patternCodec =
    S.record SimplifiedPattern
        |> S.field .signature S.string
        |> S.field .active S.bool
        |> S.field .startDirection directionCodec
        |> S.finishRecord


simplifyPattern pattern =
    { signature = pattern.signature
    , active = pattern.active
    , startDirection = pattern.startDirection
    }


unSimplifyPattern : Dict String ( String, Direction, Iota ) -> SimplifiedPattern -> Pattern
unSimplifyPattern macros simplifiedPattern =
    let
        pattern =
            getPatternFromSignature (Just macros) simplifiedPattern.signature
    in
    { pattern | active = simplifiedPattern.active, startDirection = simplifiedPattern.startDirection }


simplifyIota : Iota -> SimplifiedIota
simplifyIota iota =
    case iota of
        Vector vector ->
            SimplifiedVector vector

        Number number ->
            SimplifiedNumber number

        Boolean boolean ->
            SimplifiedBoolean boolean

        Entity entity ->
            SimplifiedEntity entity

        IotaList list ->
            SimplifiedIotaList (Array.map simplifyIota list)

        PatternIota pattern considered ->
            SimplifiedPatternIota (simplifyPattern pattern) considered

        Null ->
            SimplifiedNull

        Garbage mishap ->
            SimplifiedGarbage mishap

        OpenParenthesis list ->
            SimplifiedOpenParenthesis (Array.map simplifyIota list)


unSimplifyIota : Dict String ( String, Direction, Iota ) -> SimplifiedIota -> Iota
unSimplifyIota macros simplifiedIota =
    case simplifiedIota of
        SimplifiedNumber number ->
            Number number

        SimplifiedVector vector ->
            Vector vector

        SimplifiedBoolean boolean ->
            Boolean boolean

        SimplifiedEntity entity ->
            Entity entity

        SimplifiedIotaList list ->
            IotaList (Array.map (unSimplifyIota macros) list)

        SimplifiedPatternIota pattern considered ->
            PatternIota (unSimplifyPattern macros pattern) considered

        SimplifiedNull ->
            Null

        SimplifiedGarbage mishap ->
            Garbage mishap

        SimplifiedOpenParenthesis list ->
            OpenParenthesis (Array.map (unSimplifyIota macros) list)


patternArrayCodec : S.Codec e (Array SimplifiedPattern)
patternArrayCodec =
    S.array patternCodec


heldItemCodec : S.Codec e HeldItem
heldItemCodec =
    S.customType
        (\trinketEncoder artifactEncoder cypherEncoder focusEncoder spellbookEncoder pieEncoder noItemEncoder value ->
            case value of
                Trinket ->
                    trinketEncoder

                Artifact ->
                    artifactEncoder

                Cypher ->
                    cypherEncoder

                Focus ->
                    focusEncoder

                Spellbook ->
                    spellbookEncoder

                Pie ->
                    pieEncoder

                NoItem ->
                    noItemEncoder
        )
        |> S.variant0 Trinket
        |> S.variant0 Artifact
        |> S.variant0 Cypher
        |> S.variant0 Focus
        |> S.variant0 Spellbook
        |> S.variant0 Pie
        |> S.variant0 NoItem
        |> S.finishCustomType


mishapCodec : S.Codec e Mishap
mishapCodec =
    S.customType
        (\invalidpatternencoder notenoughiotasencoder incorrectiotaencoder vectoroutofambitencoder entityoutofambitencoder entityisimmuneencoder mathematicalerrorencoder incorrectitemencoder incorrectblockencoder delvetoodeepencoder transgressotherencoder disallowedactionencoder catastrophicfailureencoder value ->
            case value of
                InvalidPattern ->
                    invalidpatternencoder

                NotEnoughIotas ->
                    notenoughiotasencoder

                IncorrectIota ->
                    incorrectiotaencoder

                VectorOutOfAmbit ->
                    vectoroutofambitencoder

                EntityOutOfAmbit ->
                    entityoutofambitencoder

                EntityIsImmune ->
                    entityisimmuneencoder

                MathematicalError ->
                    mathematicalerrorencoder

                IncorrectItem ->
                    incorrectitemencoder

                IncorrectBlock ->
                    incorrectblockencoder

                DelveTooDeep ->
                    delvetoodeepencoder

                TransgressOther ->
                    transgressotherencoder

                DisallowedAction ->
                    disallowedactionencoder

                CatastrophicFailure ->
                    catastrophicfailureencoder
        )
        |> S.variant0 InvalidPattern
        |> S.variant0 NotEnoughIotas
        |> S.variant0 IncorrectIota
        |> S.variant0 VectorOutOfAmbit
        |> S.variant0 EntityOutOfAmbit
        |> S.variant0 EntityIsImmune
        |> S.variant0 MathematicalError
        |> S.variant0 IncorrectItem
        |> S.variant0 IncorrectBlock
        |> S.variant0 DelveTooDeep
        |> S.variant0 TransgressOther
        |> S.variant0 DisallowedAction
        |> S.variant0 CatastrophicFailure
        |> S.finishCustomType


iotaCodec : S.Codec e SimplifiedIota
iotaCodec =
    S.customType
        (\numberEncoder vectorEncoder booleanEncoder entityEncoder iotaListEncoder patternIotaEncoder nullEncoder garbageEncoder openParenthesisEncoder value ->
            case value of
                SimplifiedNumber number ->
                    numberEncoder number

                SimplifiedVector vector ->
                    vectorEncoder vector

                SimplifiedBoolean boolean ->
                    booleanEncoder boolean

                SimplifiedEntity entity ->
                    entityEncoder entity

                SimplifiedIotaList list ->
                    iotaListEncoder list

                SimplifiedPatternIota pattern considered ->
                    patternIotaEncoder pattern considered

                SimplifiedNull ->
                    nullEncoder

                SimplifiedGarbage mishap ->
                    garbageEncoder mishap

                SimplifiedOpenParenthesis list ->
                    openParenthesisEncoder list
        )
        |> S.variant1 SimplifiedNumber S.float
        |> S.variant1 SimplifiedVector (S.triple S.float S.float S.float)
        |> S.variant1 SimplifiedBoolean S.bool
        |> S.variant1 SimplifiedEntity S.string
        |> S.variant1 SimplifiedIotaList (S.array (S.lazy (\() -> iotaCodec)))
        |> S.variant2 SimplifiedPatternIota patternCodec S.bool
        |> S.variant0 SimplifiedNull
        |> S.variant1 SimplifiedGarbage mishapCodec
        |> S.variant1 SimplifiedOpenParenthesis (S.array (S.lazy (\() -> iotaCodec)))
        |> S.finishCustomType


type alias SimplifiedCastingContextEntity =
    { heldItem : HeldItem, heldItemContent : Maybe SimplifiedIota }


type alias SimplifiedCastingContext =
    { ravenmind : Maybe SimplifiedIota
    , libraries : Dict ( Int, Int, Int ) (Dict String (Maybe SimplifiedIota))
    , entities : Dict String SimplifiedCastingContextEntity
    , macros : Dict String ( String, Direction, SimplifiedIota )
    }


simplifyCastingContext : CastingContext -> SimplifiedCastingContext
simplifyCastingContext castingContext =
    { ravenmind = Maybe.map simplifyIota castingContext.ravenmind
    , libraries = Dict.map (\_ values -> Dict.map (\_ iota -> Maybe.map simplifyIota iota) values) castingContext.libraries
    , entities = Dict.map (\_ entity -> { heldItem = entity.heldItem, heldItemContent = Maybe.map simplifyIota entity.heldItemContent }) castingContext.entities
    , macros =
        Dict.fromList <|
            List.map
                (\entry ->
                    case entry of
                        ( signature, ( displayName, startDirection, iota ) ) ->
                            ( signature, ( displayName, startDirection, simplifyIota iota ) )
                )
                (Dict.toList castingContext.macros)
    }


unSimplifyCastingContext : SimplifiedCastingContext -> CastingContext
unSimplifyCastingContext simplifiedCastingContext =
    let
        macrosLayer1 =
            Dict.map
                (\_ macro ->
                    case macro of
                        ( displayName, startDirection, iota ) ->
                            ( displayName, startDirection, unSimplifyIota Dict.empty iota )
                )
                simplifiedCastingContext.macros

        macros : Dict String ( String, Direction, Iota )
        macros =
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
                                                        PatternIota (getPatternFromSignature (Just macrosLayer1) pattern.signature) considered

                                                    _ ->
                                                        i
                                            )
                                            iotaList

                                _ ->
                                    iota
                            )
                )
                macrosLayer1
    in
    { ravenmind = Maybe.map (unSimplifyIota macros) simplifiedCastingContext.ravenmind
    , libraries = Dict.map (\_ values -> Dict.map (\_ iota -> Maybe.map (unSimplifyIota macros) iota) values) simplifiedCastingContext.libraries
    , entities = Dict.map (\_ entity -> { heldItem = entity.heldItem, heldItemContent = Maybe.map (unSimplifyIota macros) entity.heldItemContent }) simplifiedCastingContext.entities
    , macros = macros
    }


castingContextentityCodec : S.Codec e SimplifiedCastingContextEntity
castingContextentityCodec =
    S.record SimplifiedCastingContextEntity
        |> S.field .heldItem heldItemCodec
        |> S.field .heldItemContent (S.maybe iotaCodec)
        |> S.finishRecord


castingContextCodec : S.Codec e SimplifiedCastingContext
castingContextCodec =
    S.record SimplifiedCastingContext
        |> S.field .ravenmind (S.maybe iotaCodec)
        |> S.field .libraries (S.dict (S.triple S.int S.int S.int) (S.dict S.string (S.maybe iotaCodec)))
        |> S.field .entities (S.dict S.string castingContextentityCodec)
        |> S.field .macros (S.dict S.string (S.triple S.string directionCodec iotaCodec))
        |> S.finishRecord


type alias ProjectData =
    { patternArray : Array SimplifiedPattern, castingContext : SimplifiedCastingContext, projectName : String }


projectCodec : S.Codec e ProjectData
projectCodec =
    S.record ProjectData
        |> S.field .patternArray patternArrayCodec
        |> S.field .castingContext castingContextCodec
        |> S.field .projectName S.string
        |> S.finishRecord


modelToProjectData : Model -> ProjectData
modelToProjectData model =
    { patternArray = Array.map (\patternTuple -> simplifyPattern (Tuple.first patternTuple)) model.patternArray
    , castingContext = simplifyCastingContext model.castingContext
    , projectName = model.projectName
    }


encodeProjectData : ProjectData -> String
encodeProjectData projectData =
    S.encodeToString projectCodec projectData


decodeProjectData : String -> Maybe ProjectData
decodeProjectData encodedProjectData =
    Result.toMaybe <| S.decodeFromString projectCodec encodedProjectData


unsimplifyProjectData : ProjectData -> { patternArray : Array Pattern, castingContext : CastingContext, projectName : String }
unsimplifyProjectData projectData =
    let
        castingContext =
            unSimplifyCastingContext projectData.castingContext
    in
    { patternArray = Array.map (unSimplifyPattern castingContext.macros) projectData.patternArray
    , castingContext = castingContext
    , projectName = projectData.projectName
    }
