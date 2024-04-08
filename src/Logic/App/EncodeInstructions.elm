module Logic.App.EncodeInstructions exposing (..)

import Json.Encode as E
import Logic.App.Types exposing (Iota)
import Logic.App.Types exposing (Pattern)
import Html.Attributes exposing (pattern)
import Logic.App.Types exposing (IotaType(..))
import Logic.App.Types exposing (Iota(..))
import Json.Encode exposing (bool)

encodeInstructions : List(Pattern) -> E.Value
encodeInstructions instructions = 
    E.object [ ("instructions", E.list encodePattern instructions)]

encodePattern : Pattern -> E.Value
encodePattern pattern =
    case pattern.selectedOutput of
        Just(_, iota) -> E.object 
                [ ( "signature", E.string pattern.signature )
                , ( "value", encodeIota iota )
                ]
        Nothing -> E.object
                [ ( "signature", E.string pattern.signature )
                ]

encodeIota : Iota -> E.Value
encodeIota iota =
    case (encodeIotaValue iota) of
        Just encodedValue -> (E.object
        [ ( "iota_type", encodeIotaType iota )
        , ( "value",  encodedValue )
        ])

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

        Vector _ -> E.string "number"

        Boolean _ -> E.string "boolean"

        Entity _ -> E.string "entity"

        IotaList _ -> E.string "list"

        PatternIota _ _ -> E.string "pattern"

        Null -> E.string "null"

        Garbage _ -> E.string "garbage"

        OpenParenthesis _ -> E.string ""