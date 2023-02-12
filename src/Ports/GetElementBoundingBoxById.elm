port module Ports.GetElementBoundingBoxById exposing (..)
import Json.Encode

port requestBoundingBox : String -> Cmd msg


port recieveBoundingBox : (Json.Encode.Value -> msg) -> Sub msg