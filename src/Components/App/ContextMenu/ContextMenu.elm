module Components.App.ContextMenu.ContextMenu exposing (..)

import ContextMenu
import Html exposing (Attribute)
import Html.Attributes exposing (style)
import Logic.App.Msg exposing (Msg(..))
import Logic.App.Types exposing (ContextMenuContext(..))
import Logic.App.Utils.Utils exposing (ifThenElse)


backgroundStyles : List (Attribute msg)
backgroundStyles =
    [ style "left" "10%"
    , style "right" "10%"
    , style "top" "10%"
    , style "bottom" "-10%"
    , style "position" "absolute"
    , style "background-color" "#cdb"
    ]


objectStyles : List (Attribute msg)
objectStyles =
    [ style "position" "absolute"
    , style "top" "100px"
    , style "left" "150px"
    , style "width" "100px"
    , style "height" "100px"
    , style "background-color" "#976"
    ]


toItemGroups : ContextMenuContext -> List (List ( ContextMenu.Item, Msg ))
toItemGroups context =
    case context of
        PatternItem isActive isMacro pattern index ->
            [ [ ( ContextMenu.item "Set Insertion Point Above", SetInsertionPoint (index + 1) )
              , ( ContextMenu.item "Set Insertion Point Below", SetInsertionPoint index )
              , ifThenElse isActive
                    ( ContextMenu.item "Disable Pattern", NoOp )
                    ( ContextMenu.item "Enable Pattern", NoOp )
              ]
                ++ ifThenElse isMacro
                    [ ( ContextMenu.item "Expand Macro", ExpandMacro pattern.signature index ) ]
                    []
            ]
