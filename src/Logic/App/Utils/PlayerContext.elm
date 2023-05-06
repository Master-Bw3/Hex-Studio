module Logic.App.Utils.PlayerContext exposing (..)

import Dict
import Logic.App.Types exposing (CastingContext, HeldItem(..), Iota)


getPlayerHeldItemContent : CastingContext -> Maybe Iota
getPlayerHeldItemContent context =
    case Dict.get "Player" context.entities of
        Just { heldItemContent } ->
            heldItemContent

        _ ->
            Nothing


getPlayerHeldItem : CastingContext -> HeldItem
getPlayerHeldItem context =
    case Dict.get "Player" context.entities of
        Just { heldItem } ->
            heldItem

        _ ->
            NoItem


setPlayerHeldItem : CastingContext -> HeldItem -> CastingContext
setPlayerHeldItem context item =
    { context
        | entities =
            Dict.update "Player"
                (\v ->
                    case v of
                        Just player ->
                            Just { player | heldItem = item }

                        Nothing ->
                            v
                )
                context.entities
    }


setPlayerHeldItemContent : CastingContext -> Maybe Iota -> CastingContext
setPlayerHeldItemContent context heldItemContent =
    { context
        | entities =
            Dict.update "Player"
                (\v ->
                    case v of
                        Just player ->
                            Just { player | heldItemContent = heldItemContent }

                        Nothing ->
                            v
                )
                context.entities
    }
