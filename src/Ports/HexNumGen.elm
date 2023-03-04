port module Ports.HexNumGen exposing (..)

port sendNumber : (Float) -> Cmd msg


port recieveNumber : (String -> msg) -> Sub msg