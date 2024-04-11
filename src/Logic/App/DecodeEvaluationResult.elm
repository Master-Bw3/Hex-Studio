module Logic.App.DecodeEvaluationResult exposing (..)

import Json.Decode as D
import Array exposing (Array)
import Logic.App.Types exposing (Iota)
import Logic.App.Types exposing (Iota(..))
import Parser exposing (Trailing(..))
import Logic.App.Types exposing (Mishap)
import Logic.App.Types exposing (Mishap(..))
import Logic.App.Utils.Utils exposing (triple)

type alias EvalResult =
    { stack : Array(Iota)}

type alias VectorObject = {
        x : Float,
        y : Float,
        z : Float
    }

resultDecoder : D.Decoder (Result (Mishap, Int, EvalResult) EvalResult )
resultDecoder =
    D.oneOf 
        [ resultMishapDecoder |> D.andThen (\x -> D.succeed (Err x))
        , resultStateDecoder |> D.andThen (\x -> D.succeed (Ok x))
        ]


resultStateDecoder : D.Decoder EvalResult
resultStateDecoder =
    D.map EvalResult
        (D.field "stack" <| D.array iotaDecoder )
resultMishapDecoder : D.Decoder (Mishap, Int, EvalResult)
resultMishapDecoder =
    D.map3 triple
        (D.field "mishap" D.string)
        (D.field "location" D.int)
        (resultStateDecoder)
    |> D.andThen (\(mishap, location, state) ->
        case mishap of 
            "invalidPattern" -> D.succeed (InvalidPattern, location, state)
            "notEnoughIotas" -> D.succeed (NotEnoughIotas, location, state)
            "incorrectIota" ->  D.succeed (IncorrectIota, location, state)
            "mathematicalError" -> D.succeed (MathematicalError, location, state)
            "holdingIncorrectItem" -> D.succeed (IncorrectItem, location, state)
            _ -> D.succeed (CatastrophicFailure, location, state)
        )


iotaDecoder : D.Decoder Iota
iotaDecoder =
    D.field "iota_type" D.string
    |> D.andThen (\iotaType -> 
    case iotaType of
        "vector" -> vectorIotaDecoder
        "number" -> numberIotaDecoder
        "garbage" -> D.succeed <| Garbage Generic
        _ -> D.fail "expected valid iota type"
    )

numberIotaDecoder : D.Decoder Iota
numberIotaDecoder =
    D.map Number
        (D.field "value" D.float)

vectorIotaDecoder : D.Decoder Iota
vectorIotaDecoder =
    D.map3 VectorObject 
        (D.at ["value", "x"] D.float)
        (D.at ["value", "y"] D.float)
        (D.at ["value", "z"] D.float)
    |> D.andThen mapVectorObject

mapVectorObject : VectorObject -> D.Decoder Iota
mapVectorObject vec = 
    Vector (vec.x, vec.y, vec.z)
    |> D.succeed