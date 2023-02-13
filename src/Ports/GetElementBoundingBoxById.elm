port module Ports.GetElementBoundingBoxById exposing (..)
import Json.Encode

port requestBoundingBox : String -> Cmd msg


port recieveBoundingBox : (Json.Encode.Value -> msg) -> Sub msg


port requestBoundingBoxes : List (String) -> Cmd msg


port recieveBoundingBoxes : (List (Json.Encode.Value) -> msg) -> Sub msg