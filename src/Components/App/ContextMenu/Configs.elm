module Components.App.ContextMenu.Configs exposing (..)
import ContextMenu
import ContextMenu exposing (Direction(..))
import ContextMenu exposing (Overflow(..))
import ContextMenu exposing (Cursor(..))
import ContextMenu exposing (defaultConfig)

winChrome : ContextMenu.Config
winChrome =
    { defaultConfig
        | direction = RightBottom
        , overflowX = Shift
        , overflowY = Mirror
        , containerColor = "#ffffff"
        , hoverColor = "#c7c5c5"
        , invertText = False
        , cursor = Arrow
        , rounded = False
    }