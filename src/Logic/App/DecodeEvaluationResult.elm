module Logic.App.DecodeEvaluationResult exposing (..)

import Json.Decode as D
import Array exposing (Array)
import Logic.App.Types exposing (Iota)
import Logic.App.Types exposing (Iota(..))

type alias EvalResult =
    { stack : Array(Iota)}

type alias VectorObject = {
        x : Float,
        y : Float,
        z : Float
    }

resultDecoder : D.Decoder EvalResult
resultDecoder =
    D.map EvalResult
        (D.field "stack" <| D.array iotaDecoder )

iotaDecoder : D.Decoder Iota
iotaDecoder =
    D.oneOf [numberIotaDecoder, vectorIotaDecoder]

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