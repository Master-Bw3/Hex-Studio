module Logic.App.ImportExport.ImportExportProject exposing (..)

import Array
import Json.Decode as Decode
import Json.Encode as Encode
import Logic.App.Model exposing (Model)
import Logic.App.Types exposing (Iota(..), Pattern)


exportProject : Model -> Encode.Value
exportProject model =
    let
        patternToJsonObject : Pattern -> List ( String, Encode.Value )
        patternToJsonObject pattern =
            [ ( "signature", Encode.string pattern.signature )

            -- , ( "startDirection", Encode.string pattern.startDirection )
            -- , ( "action", pattern.action )
            -- , ( "metaAction", pattern.metaAction )
            -- , ( "displayName", pattern.displayName )
            , ( "internalName", Encode.string pattern.internalName )

            -- , ( "color", pattern.color )
            -- , ( "outputOptions", pattern.outputOptions )
            -- , ( "selectedOutput", pattern.selectedOutput )
            , ( "active", Encode.bool pattern.active )
            ]

        contextToJsonObject context =
            [-- (heldItem, ),
             -- (heldItemContent, Encode.list (Maybe.withDefault [] () ))
             -- , (ravenmind, )
             -- , (macros, )
            ]
    in
    Encode.object
        [ ( "patternArray"
          , Encode.list
                Encode.object
                (List.map
                    (\tuple -> patternToJsonObject (Tuple.first tuple))
                    (Array.toList model.patternArray)
                )
          )
        , ( "castingContext", Encode.object (contextToJsonObject context) )
        ]


iotaToJson iota =
    case iota of
        Vector ( x, y, z ) ->
            Encode.object [ ( "Vector", Encode.list Encode.float [ x, y, z ] ) ]

        Number _ ->
            Debug.todo "branch 'Number _' not implemented"

        Boolean _ ->
            Debug.todo "branch 'Boolean _' not implemented"

        Entity _ ->
            Debug.todo "branch 'Entity _' not implemented"

        IotaList _ ->
            Debug.todo "branch 'IotaList _' not implemented"

        PatternIota _ _ ->
            Debug.todo "branch 'PatternIota _ _' not implemented"

        Null ->
            Debug.todo "branch 'Null' not implemented"

        Garbage _ ->
            Debug.todo "branch 'Garbage _' not implemented"

        OpenParenthesis _ ->
            Debug.todo "branch 'OpenParenthesis _' not implemented"
