port module Ports.GetGridDrawingAsGif exposing (..)

port requestGIF : () -> Cmd msg


port recieveGIF : (String -> msg) -> Sub msg