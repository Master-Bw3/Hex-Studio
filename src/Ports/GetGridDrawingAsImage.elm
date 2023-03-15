port module Ports.GetGridDrawingAsImage exposing (..)

port requestImage : () -> Cmd msg


port recieveImage : (String -> msg) -> Sub msg