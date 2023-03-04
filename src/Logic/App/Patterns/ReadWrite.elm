module Logic.App.Patterns.ReadWrite exposing (..)

import Array exposing (Array)
import Logic.App.Patterns.OperatorUtils exposing (action1Input, actionNoInput, getAny)
import Logic.App.Types exposing (ActionResult, CastingContext, EntityType(..), HeldItem(..), Iota(..), Mishap(..))


read : Array Iota -> CastingContext -> ActionResult
read stack ctx =
    let
        action context =
            ( case context.heldItem of
                NoItem ->
                    Array.empty

                Trinket ->
                    Array.empty

                Cypher ->
                    Array.empty

                Artifact ->
                    Array.empty

                Focus ->
                    Array.fromList [ Maybe.withDefault Null context.heldItemContent ]

                Spellbook ->
                    Array.fromList [ Maybe.withDefault Null context.heldItemContent ]

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
            case context.heldItem of
                NoItem ->
                    (Array.fromList [iota], context)

                Trinket ->
                    (Array.fromList [iota], context)

                Cypher ->
                    (Array.fromList [iota], context)

                Artifact ->
                    (Array.fromList [iota], context)

                Focus ->
                    (Array.empty, { context | heldItemContent = Just iota })

                Spellbook ->
                    (Array.empty, { context | heldItemContent = Just iota })

                Pie ->
                    (Array.fromList [iota], context)

    in
    action1Input stack ctx getAny action
