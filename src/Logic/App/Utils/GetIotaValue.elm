module Logic.App.Utils.GetIotaValue exposing (..)

import Array
import Html exposing (div, p, text)
import Html.Attributes exposing (class, style)
import Logic.App.Types exposing (Iota(..), IotaType(..), Mishap(..))
import Settings.Theme exposing (iotaColorMap)


getIotaValueAsHtmlMsg : Int -> Iota -> Int -> List (Html.Html msg)
getIotaValueAsHtmlMsg index iota indent =
    let
        renderList list =
            Array.toList list
                |> List.indexedMap (\i x -> getIotaValueAsHtmlMsg (i - 1) x (indent + 1))
                |> List.concat
                |> (++)
                    [ div [ class "outer_box", style "background-color" (iotaColorMap iota), style "margin-left" (String.fromInt (indent * 26) ++ "px") ]
                        [ div [ class "inner_box" ]
                            [ div [ class "index_display" ] [ text (String.fromInt (index + 1)) ]
                            , div [ class "text", style "margin-right" "6.8px" ] [ div [] [ p [] [ text "List" ] ] ]
                            ]
                        ]
                    ]
    in
    case iota of
        IotaList list ->
            renderList list

        OpenParenthesis list ->
            renderList list

        _ ->
            [ div [ class "outer_box", style "background-color" (iotaColorMap iota), style "margin-left" (String.fromInt (indent * 26) ++ "px") ]
                [ div [ class "inner_box" ]
                    [ div [ class "index_display" ] [ text (String.fromInt (index + 1)) ]
                    , div [ class "text", style "margin-right" "6.8px" ] [ div [] [ p [] [ text (getIotaValueAsString iota) ] ] ]
                    ]
                ]
            ]


getIotaTypeAsString : IotaType -> String
getIotaTypeAsString iota =
    case iota of
        NullType ->
            "Null"

        NumberType ->
            "Number"

        VectorType ->
            "Vector"

        BooleanType ->
            "Boolean"

        EntityType ->
            "Entity"

        IotaListType iotaType ->
            "List: " ++ getIotaTypeAsString iotaType

        PatternType ->
            "Pattern"

        GarbageType ->
            "Garbage"


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

        Entity name ->
            "Entity \"" ++ name ++ "\""

        --fix later
        IotaList list ->
            (++) "List: " <|
                String.join ", " <|
                    List.map
                        (\item ->
                            case item of
                                PatternIota pattern _ ->
                                    pattern.displayName

                                x ->
                                    getIotaValueAsString x
                        )
                    <|
                        Array.toList list

        PatternIota pattern _ ->
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
                    List.map
                        (\item ->
                            case item of
                                PatternIota pattern _ ->
                                    pattern.displayName

                                x ->
                                    getIotaValueAsString x
                        )
                    <|
                        Array.toList list



-- (++) "List: " <|
--     String.join "| " <|
--         List.map
--             (\item ->
--                 case item of
--                     PatternIota pattern _ ->
--                         pattern.displayName
--                     _ ->
--                         ""
--             )
--         <|
--             Array.toList list


getIotaFromString : String -> Iota
getIotaFromString string =
    if string == "Null" then
        Null

    else if string == "Entity" then
        Entity "Caster"

    else if string == "Vector" then
        Vector ( 0, 0, 0 )

    else if String.toFloat string /= Nothing then
        Number <| Maybe.withDefault 0 <| String.toFloat string

    else
        Null


getIotaTypeFromString : String -> IotaType
getIotaTypeFromString string =
    if string == "Null" then
        NullType

    else if string == "Entity" then
        EntityType

    else if string == "Vector" then
        VectorType

    else if String.toFloat string /= Nothing then
        NumberType

    else
        NullType
