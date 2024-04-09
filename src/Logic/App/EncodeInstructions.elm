module Logic.App.EncodeInstructions exposing (..)

import Json.Encode as E
import Logic.App.Types exposing (Iota)
import Logic.App.Types exposing (Pattern)
import Html.Attributes exposing (pattern)
import Logic.App.Types exposing (IotaType(..))
import Logic.App.Types exposing (Iota(..))
import Json.Encode exposing (bool)
import Array exposing (Array)

encodeInstructions : Array(Pattern) -> E.Value
encodeInstructions instructions = 
    E.object [ ("instructions", E.array encodePattern instructions)]

encodePattern : Pattern -> E.Value
encodePattern pattern =
    case pattern.selectedOutput of
        Just(_, iota) -> E.object 
                [ ( "identifier", E.string pattern.internalName )
                , ( "value", encodeIota iota )
                ]
        Nothing -> E.object
                [ ( "identifier", E.string pattern.internalName )
                ]

encodeIota : Iota -> E.Value
encodeIota iota =
    let
        encodedIotaValue = encodeIotaValue iota
    in
    case encodedIotaValue of
        Just encodedValue -> E.object [( "iota_type", encodeIotaType iota ), ( "value",  encodedValue )]

        Nothing -> E.object [( "iota_type", encodeIotaType iota )]

encodeIotaValue : Iota -> Maybe(E.Value)
encodeIotaValue iota = 
    case iota of
        Number number -> Just <| E.float number

        Vector (x, y, z) -> Just(E.object
            [ ("x", E.float x)
            , ("y", E.float y)
            , ("z", E.float z)
            ])

        Boolean bool -> Just <| E.bool bool

        Entity entity -> Just <| E.string entity

        IotaList list -> Just <| E.array encodeIota list

        PatternIota pattern _ -> Just <| encodePattern pattern

        Null -> Nothing

        Garbage _ -> Nothing

        OpenParenthesis _ -> Nothing


encodeIotaType : Iota -> E.Value
encodeIotaType iota =
    case iota of
        Number _ -> E.string "number"

        Vector _ -> E.string "vector"

        Boolean _ -> E.string "boolean"

        Entity _ -> E.string "entity"

        IotaList _ -> E.string "list"

        PatternIota _ _ -> E.string "pattern"

        Null -> E.string "null"

        Garbage _ -> E.string "garbage"

        OpenParenthesis _ -> E.string ""