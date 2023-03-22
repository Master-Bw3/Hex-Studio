module Logic.App.ImportExport.ImportExportProject exposing (..)

import Array exposing (Array)
import Bytes exposing (Bytes)
import Dict exposing (Dict)
import Json.Decode as Decode
import Json.Encode as Encode
import Logic.App.Model exposing (Model)
import Logic.App.Patterns.PatternRegistry exposing (getPatternFromSignature)
import Logic.App.Types exposing (CastingContext, Direction(..), EntityType(..), GridPoint, HeldItem(..), Iota(..), IotaType(..), Mishap(..), Pattern)
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
    | SimplifiedEntity EntityType
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


entityCodec : S.Codec e EntityType
entityCodec =
    S.customType
        (\unsetEncoder value ->
            case value of
                Unset ->
                    unsetEncoder
        )
        |> S.variant0 Unset
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
        |> S.variant1 SimplifiedEntity entityCodec
        |> S.variant1 SimplifiedIotaList (S.array (S.lazy (\() -> iotaCodec)))
        |> S.variant2 SimplifiedPatternIota patternCodec S.bool
        |> S.variant0 SimplifiedNull
        |> S.variant1 SimplifiedGarbage mishapCodec
        |> S.variant1 SimplifiedOpenParenthesis (S.array (S.lazy (\() -> iotaCodec)))
        |> S.finishCustomType


type alias SimplifiedCastingContext =
    { heldItem : HeldItem
    , heldItemContent : Maybe SimplifiedIota
    , ravenmind : Maybe SimplifiedIota
    , macros : Dict String ( String, Direction, SimplifiedIota )
    }


simplifyCastingContext : CastingContext -> SimplifiedCastingContext
simplifyCastingContext castingContext =
    { heldItem = castingContext.heldItem
    , heldItemContent = Maybe.map simplifyIota castingContext.heldItemContent
    , ravenmind = Maybe.map simplifyIota castingContext.ravenmind
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
        macros =
            Dict.fromList <|
                List.map
                    (\entry ->
                        case entry of
                            ( signature, ( displayName, startDirection, iota ) ) ->
                                ( signature, ( displayName, startDirection, unSimplifyIota Dict.empty iota ) )
                    )
                    (Dict.toList simplifiedCastingContext.macros)
    in
    { heldItem = simplifiedCastingContext.heldItem
    , heldItemContent = Maybe.map (unSimplifyIota macros) simplifiedCastingContext.heldItemContent
    , ravenmind = Maybe.map (unSimplifyIota macros) simplifiedCastingContext.ravenmind
    , macros = macros
    }


castingContextCodec : S.Codec e SimplifiedCastingContext
castingContextCodec =
    S.record SimplifiedCastingContext
        |> S.field .heldItem heldItemCodec
        |> S.field .heldItemContent (S.maybe iotaCodec)
        |> S.field .ravenmind (S.maybe iotaCodec)
        |> S.field .macros (S.dict S.string (S.triple S.string directionCodec iotaCodec))
        |> S.finishRecord


type alias ProjectData =
    { patternArray : Array SimplifiedPattern, castingContext : SimplifiedCastingContext }


projectCodec : S.Codec e ProjectData
projectCodec =
    S.record ProjectData
        |> S.field .patternArray patternArrayCodec
        |> S.field .castingContext castingContextCodec
        |> S.finishRecord


modelToProjectData : Model -> ProjectData
modelToProjectData model =
    { patternArray = Array.map (\patternTuple -> simplifyPattern (Tuple.first patternTuple)) model.patternArray
    , castingContext = simplifyCastingContext model.castingContext
    }


encodeProjectData : ProjectData -> String
encodeProjectData projectData =
    S.encodeToString projectCodec projectData


decodeProjectData : String -> Maybe ProjectData
decodeProjectData encodedProjectData =
   Result.toMaybe <| S.decodeFromString projectCodec encodedProjectData



unsimplifyProjectData : ProjectData -> { patternArray : Array Pattern, castingContext : CastingContext }
unsimplifyProjectData projectData =
    let
        castingContext =
            unSimplifyCastingContext projectData.castingContext
    in
    { patternArray = Array.map (unSimplifyPattern castingContext.macros) projectData.patternArray
    , castingContext = castingContext
    }



-- encodePatternArray : Model -> String
-- encodePatternArray model =
--     S.encodeToString patternArrayCodec <| Array.map (\patternTuple -> simplifyPattern (Tuple.first patternTuple)) model.patternArray
-- decodePatternArray : String -> Array SimplifiedPattern
-- decodePatternArray encoded =
--     case S.decodeFromString patternArrayCodec encoded of
--         Ok patternArray ->
--             patternArray
--         Err _ ->
--             Array.empty
{-
   exportProject : Model -> Encode.Value
   exportProject model =
       let
           contextToJsonObject context =
               [ ( "heldItem", encodeHeldItem context.heldItem )
               , ( "heldItemContent"
                 , case context.heldItemContent of
                       Just iota ->
                           encodeIota iota

                       Nothing ->
                           Encode.null
                 )
               , ( "ravenmind"
                 , case context.ravenmind of
                       Just iota ->
                           encodeIota iota

                       Nothing ->
                           Encode.null
                 )
               , ( "macros", encodeMacros context.macros )
               ]
       in
       Encode.object
           [ ( "patternArray"
             , Encode.list
                   Encode.object
                   (List.map
                       (\tuple -> patternToKeyValPair (Tuple.first tuple))
                       (Array.toList model.patternArray)
                   )
             )
           , ( "castingContext", Encode.object (contextToJsonObject model.castingContext) )
           ]


   encodeIota : Iota -> Encode.Value
   encodeIota iota =
       iotaToKeyValPair iota
           |> Encode.object


   iotaToKeyValPair : Iota -> List ( String, Encode.Value )
   iotaToKeyValPair iota =
       case iota of
           Vector ( x, y, z ) ->
               [ ( "Vector", Encode.list Encode.float [ x, y, z ] ) ]

           Number number ->
               [ ( "Number", Encode.float number ) ]

           Boolean bool ->
               [ ( "Boolean", Encode.bool bool ) ]

           Entity _ ->
               [ ( "Entity", Encode.null ) ]

           IotaList list ->
               [ ( "IotaList", Encode.list Encode.object <| List.map iotaToKeyValPair <| Array.toList list ) ]

           PatternIota pattern _ ->
               [ ( "Pattern", Encode.object <| patternToKeyValPair pattern ) ]

           Null ->
               [ ( "Null", Encode.null ) ]

           Garbage _ ->
               [ ( "Garbage", Encode.null ) ]

           OpenParenthesis list ->
               [ ( "OpenParenthesis", Encode.list Encode.object <| List.map iotaToKeyValPair <| Array.toList list ) ]


   encodeHeldItem : HeldItem -> Encode.Value
   encodeHeldItem item =
       case item of
           Trinket ->
               Encode.string "Trinkt"

           Artifact ->
               Encode.string "Artifact"

           Cypher ->
               Encode.string "Cypher"

           Focus ->
               Encode.string "Focus"

           Spellbook ->
               Encode.string "Spellbook"

           Pie ->
               Encode.string "Pie"

           NoItem ->
               Encode.string "NoItem"


   patternToKeyValPair : Pattern -> List ( String, Encode.Value )
   patternToKeyValPair pattern =
       [ ( "signature", Encode.string pattern.signature )

       -- , ( "startDirection", Encode.string pattern.startDirection )
       -- , ( "action", pattern.action )
       -- , ( "metaAction", pattern.metaAction )
       -- , ( "displayName", pattern.displayName )
       , ( "internalName", Encode.string pattern.internalName )

       -- , ( "color", pattern.color )
       -- , ( "outputOptions", pattern.outputOptions )
       , ( "selectedOutput"
         , case pattern.selectedOutput of
               Just ( _, iota ) ->
                   encodeIota iota

               Nothing ->
                   Encode.null
         )
       , ( "active", Encode.bool pattern.active )
       ]


   encodeMacros : Dict String ( String, Direction, Iota ) -> Encode.Value
   encodeMacros macros =
       Dict.toList macros
           |> List.map
               (\macro ->
                   case macro of
                       ( key, ( displayName, startDirection, iota ) ) ->
                           [ ( key
                             , Encode.object
                                   [ ( "displayName", Encode.string displayName )
                                   , ( "iota", encodeIota iota )
                                   ]
                             )
                           ]
               )
           |> Encode.list Encode.object
-}
