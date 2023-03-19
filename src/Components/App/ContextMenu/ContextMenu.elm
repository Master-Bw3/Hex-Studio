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
        PatternItem isActive isMacro index ->
            [ [ ( ContextMenu.item "Set Insertion Point Above", ContextMenuItemSelected 0 )
              , ( ContextMenu.item "Set Insertion Point Below", ContextMenuItemSelected 1 )
              , ifThenElse isActive
                    ( ContextMenu.item "Disable Pattern", ContextMenuItemSelected 2 )
                    ( ContextMenu.item "Enable Pattern", ContextMenuItemSelected 2 )
              ]
                ++ ifThenElse isMacro
                    [ ( ContextMenu.item "Expand Macro", ContextMenuItemSelected 2 ) ]
                    []
            ]
