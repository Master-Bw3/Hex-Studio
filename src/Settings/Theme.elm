module Settings.Theme exposing (..)

import Logic.App.Types exposing (Iota(..))


accent1 =
    "#BAC5E2"


accent2 =
    "#D8B8E0"


accent2_saturated =
    "#D786EA"


accent3 =
    "#e0b8b8"


accent4 =
    "#dd6666"


iotaColorMap iota =
    case iota of
        Null ->
            "#354C3F"

        Number _ ->
            "#4C3541"

        Vector _ ->
            "#4C3541"

        Boolean _ ->
            "#4B4C35"

        Entity _ ->
            "#354B4C"

        List _ ->
            "#354C3F"

        Pattern _ ->
            "#354C3F"

        Garbage ->
            "#4F3737"
