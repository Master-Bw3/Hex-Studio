port module Ports.SendInstructions exposing (..)

port sendInstructions : (String) -> Cmd msg

port recieveInstructions : (String -> msg) -> Sub msg