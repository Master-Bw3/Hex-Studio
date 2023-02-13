port module Ports.CheckMouseOverDragHandle exposing (..)


port requestCheckMouseOverDragHandle : () -> Cmd msg



port recieveCheckMouseOverDragHandle : (Bool -> msg) -> Sub msg