module Logic.App.ImportExport.ImportExportProject exposing (..)

import Array exposing (Array)
import Bytes exposing (Bytes)
import Dict exposing (Dict)
import Json.Decode as Decode
import Json.Encode as Encode
import Logic.App.Model exposing (Model)
import Logic.App.Types exposing (Direction, GridPoint, HeldItem(..), Iota(..), IotaType(..), Pattern)
import Serialize as S


type alias SimplifiedPattern =
    { signature : String
    , active : Bool
    }


patternCodec : S.Codec e SimplifiedPattern
patternCodec =
    S.record SimplifiedPattern
        |> S.field .signature S.string
        |> S.field .active S.bool
        |> S.finishRecord


patternArrayCodec : S.Codec e (Array SimplifiedPattern)
patternArrayCodec =
    S.array patternCodec


encodePatternArray : Model -> String
encodePatternArray model =
    S.encodeToString patternArrayCodec <| Array.map (\x -> { signature = (Tuple.first x).signature, active = (Tuple.first x).active }) model.patternArray


decodePatternArray : String -> Array SimplifiedPattern
decodePatternArray encoded =
    case S.decodeFromString patternArrayCodec encoded of
        Ok patternArray ->
            patternArray

        Err _ ->
            Array.empty

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