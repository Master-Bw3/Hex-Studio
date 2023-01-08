port module Ports.HexNumGen exposing (..)

port call : Float -> Cmd msg


port return : (String -> msg) -> Sub msg