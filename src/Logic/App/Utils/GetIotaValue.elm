module Logic.App.Utils.GetIotaValue exposing (..)

import Array
import Html exposing (br, li, ol, p, text)
import Html.Attributes exposing (style)
import Logic.App.Types exposing (Iota(..), Mishap(..))


getIotaValueAsHtmlMsg : Iota -> List (Html.Html msg)
getIotaValueAsHtmlMsg iota =
    let
        string =
            getIotaValueAsString iota
    in
    if String.startsWith "List: " string then
        if string == "List: " then
            [ p [] [ text "List:" ] ]

        else
            String.dropLeft 6 string
                |> String.split ", "
                |> List.map (\str -> li [] [ text str ])
                |> ol []
                |> List.singleton
                |> (::) (p [] [ text "List:" ])

    else
        [ p [] [ text string ] ]


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
            "Entity"

        --fix later
        IotaList list ->
            (++) "List: " <|
                String.join ", " <|
                    List.reverse <|
                        List.map
                            (\item ->
                                case item of
                                    Pattern pattern ->
                                        pattern.displayName

                                    x ->
                                        getIotaValueAsString x
                            )
                        <|
                            Array.toList list

        Pattern pattern ->
            pattern.displayName

        Garbage mishap ->
            let
                mishapMessage =
                    case mishap of
                        InvalidPattern ->
                            "Invalid Pattern"

                        NotEnoughIotas ->
                            "Not Enough Iotas"

                        IncorrectIota ->
                            "Incorrect Iota"

                        VectorOutOfAmbit ->
                            "Vector Out of Ambit"

                        EntityOutOfAmbit ->
                            "Entity Out of Ambit"

                        EntityIsImmune ->
                            "Entity is Immune"

                        MathematicalError ->
                            "Mathematical Error"

                        IncorrectItem ->
                            "Incorrect Item"

                        IncorrectBlock ->
                            "Incorrect Block"

                        DelveTooDeep ->
                            "Delve Too Deep"

                        TransgressOther ->
                            "Transgress Other"

                        DisallowedAction ->
                            "Disallowed Action"

                        CatastrophicFailure ->
                            "Catastrophic Failure"
            in
            "Garbage (" ++ mishapMessage ++ ")"

        OpenParenthesis list ->
            (++) "List: " <|
                String.join ", " <|
                    List.reverse <|
                        List.map
                            (\item ->
                                case item of
                                    Pattern pattern ->
                                        pattern.displayName

                                    _ ->
                                        ""
                            )
                        <|
                            Array.toList list
