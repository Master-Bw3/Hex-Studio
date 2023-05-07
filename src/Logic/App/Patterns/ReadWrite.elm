module Logic.App.Patterns.ReadWrite exposing (..)

import Array exposing (Array)
import Dict
import LineSegment2d exposing (vector)
import Logic.App.Patterns.OperatorUtils exposing (action1Input, action2Inputs, action3Inputs, actionNoInput, getAny, getEntity, getPatternIota, getVector)
import Logic.App.Types exposing (ActionResult, CastingContext, HeldItem(..), Iota(..), Mishap(..))
import Logic.App.Utils.EntityContext exposing (getEntityHeldItem, getEntityHeldItemContent, getPlayerHeldItem, getPlayerHeldItemContent, setEntityHeldItem, setEntityHeldItemContent, setPlayerHeldItemContent)


read : Array Iota -> CastingContext -> ActionResult
read stack ctx =
    let
        action context =
            ( case getPlayerHeldItem context of
                NoItem ->
                    Array.empty

                Trinket ->
                    Array.empty

                Cypher ->
                    Array.empty

                Artifact ->
                    Array.empty

                Focus ->
                    Array.fromList [ Maybe.withDefault Null (getPlayerHeldItemContent context) ]

                Spellbook ->
                    Array.fromList [ Maybe.withDefault Null (getPlayerHeldItemContent context) ]

                Pie ->
                    Array.fromList [ Number pi ]
            , context
            )
    in
    actionNoInput stack ctx action


write : Array Iota -> CastingContext -> ActionResult
write stack ctx =
    let
        action iota context =
            case getPlayerHeldItem context of
                NoItem ->
                    ( Array.fromList [ iota ], context )

                Trinket ->
                    ( Array.fromList [ iota ], context )

                Cypher ->
                    ( Array.fromList [ iota ], context )

                Artifact ->
                    ( Array.fromList [ iota ], context )

                Focus ->
                    ( Array.empty, setPlayerHeldItemContent context (Just iota) )

                Spellbook ->
                    ( Array.empty, setPlayerHeldItemContent context (Just iota) )

                Pie ->
                    ( Array.fromList [ iota ], context )
    in
    action1Input stack ctx getAny action


readable : Array Iota -> CastingContext -> ActionResult
readable stack ctx =
    let
        action context =
            case getPlayerHeldItem context of
                NoItem ->
                    ( Array.repeat 1 (Boolean False), context )

                Trinket ->
                    ( Array.repeat 1 (Boolean False), context )

                Cypher ->
                    ( Array.repeat 1 (Boolean False), context )

                Artifact ->
                    ( Array.repeat 1 (Boolean False), context )

                Focus ->
                    ( Array.repeat 1 (Boolean True), context )

                Spellbook ->
                    ( Array.repeat 1 (Boolean True), context )

                Pie ->
                    ( Array.repeat 1 (Boolean True), context )
    in
    actionNoInput stack ctx action


writable : Array Iota -> CastingContext -> ActionResult
writable stack ctx =
    let
        action context =
            case getPlayerHeldItem context of
                NoItem ->
                    ( Array.repeat 1 (Boolean False), context )

                Trinket ->
                    ( Array.repeat 1 (Boolean False), context )

                Cypher ->
                    ( Array.repeat 1 (Boolean False), context )

                Artifact ->
                    ( Array.repeat 1 (Boolean False), context )

                Focus ->
                    ( Array.repeat 1 (Boolean True), context )

                Spellbook ->
                    ( Array.repeat 1 (Boolean True), context )

                Pie ->
                    ( Array.repeat 1 (Boolean False), context )
    in
    actionNoInput stack ctx action


readLocal : Array Iota -> CastingContext -> ActionResult
readLocal stack ctx =
    let
        action context =
            case context.ravenmind of
                Nothing ->
                    ( Array.repeat 1 Null, context )

                Just iota ->
                    ( Array.repeat 1 iota, context )
    in
    actionNoInput stack ctx action


writeLocal : Array Iota -> CastingContext -> ActionResult
writeLocal stack ctx =
    let
        action iota context =
            ( Array.empty, { context | ravenmind = Just iota } )
    in
    action1Input stack ctx getAny action


readChronical : Array Iota -> CastingContext -> ActionResult
readChronical stack ctx =
    let
        action iota context =
            case iota of
                Entity entity ->
                    ( case getEntityHeldItem context entity of
                        NoItem ->
                            Array.empty

                        Trinket ->
                            Array.empty

                        Cypher ->
                            Array.empty

                        Artifact ->
                            Array.empty

                        Focus ->
                            Array.fromList [ Maybe.withDefault Null (getEntityHeldItemContent context entity) ]

                        Spellbook ->
                            Array.fromList [ Maybe.withDefault Null (getEntityHeldItemContent context entity) ]

                        Pie ->
                            Array.fromList [ Number pi ]
                    , context
                    )

                _ ->
                    ( Garbage CatastrophicFailure
                        |> Array.repeat 1
                    , context
                    )
    in
    action1Input stack ctx getEntity action


writeChronical : Array Iota -> CastingContext -> ActionResult
writeChronical stack ctx =
    let
        action iota1 iota2 context =
            case iota1 of
                Entity entity ->
                    case getEntityHeldItem context entity of
                        NoItem ->
                            ( Array.fromList [ iota2 ], context )

                        Trinket ->
                            ( Array.fromList [ iota2 ], context )

                        Cypher ->
                            ( Array.fromList [ iota2 ], context )

                        Artifact ->
                            ( Array.fromList [ iota2 ], context )

                        Focus ->
                            ( Array.empty, setEntityHeldItemContent context entity (Just iota2) )

                        Spellbook ->
                            ( Array.empty, setEntityHeldItemContent context entity (Just iota2) )

                        Pie ->
                            ( Array.fromList [ iota2 ], context )

                _ ->
                    ( Garbage CatastrophicFailure
                        |> Array.repeat 1
                    , context
                    )
    in
    action2Inputs stack ctx getEntity getAny action


akashicRead : Array Iota -> CastingContext -> ActionResult
akashicRead stack ctx =
    let
        action : Iota -> Iota -> CastingContext -> ( Array Iota, CastingContext )
        action iota1 iota2 context =
            case ( iota1, iota2 ) of
                ( Vector vector, PatternIota pattern _ ) ->
                    case Maybe.map (Dict.get pattern.signature) (Dict.get vector context.libraries) of
                        -- gotta make sure ya know
                        Just (Just (Just iota)) ->
                            ( Array.fromList [ iota ], context )

                        _ ->
                            ( Array.empty, context )

                _ ->
                    ( Garbage CatastrophicFailure
                        |> Array.repeat 1
                    , context
                    )
    in
    action2Inputs stack ctx getVector getPatternIota action


akashicWrite : Array Iota -> CastingContext -> ActionResult
akashicWrite stack ctx =
    let
        action iota1 iota2 iota3 context =
            case ( iota1, iota2 ) of
                ( Vector vector, PatternIota pattern _ ) ->
                    case Dict.get vector context.libraries of
                        Just entries ->
                            ( Array.empty
                            , { context
                                | libraries = Dict.insert vector (Dict.insert pattern.signature (Just iota3) entries) context.libraries
                              }
                            )

                        Nothing ->
                            ( Array.empty, context )

                _ ->
                    ( Garbage CatastrophicFailure
                        |> Array.repeat 1
                    , context
                    )
    in
    action3Inputs stack ctx getVector getPatternIota getAny action
