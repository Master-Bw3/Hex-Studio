module Logic.App.Utils.GetIotaValueAsString exposing (..)

import Logic.App.Types exposing (Iota(..))


getIotaValueAsString : Iota -> String
getIotaValueAsString iota =
    case iota of
        Null ->
            "Null"

        Number number ->
            String.fromFloat number

        Vector ( x, y, z ) ->
            "Vector ["
                ++ String.fromFloat x
                ++ ", "
                ++ String.fromFloat y
                ++ ", "
                ++ String.fromFloat z
                ++ "]"

        Boolean bool ->
            if bool == True then
                "True"

            else
                "False"

        Entity _ ->
            "Entity" --fix later

        List _ ->
            Debug.todo "branch 'IotaList _' not implemented"

        Pattern pattern ->
            pattern.displayName

        Garbage ->
            "Garbage"
