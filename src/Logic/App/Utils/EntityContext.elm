module Logic.App.Utils.EntityContext exposing (..)

import Dict
import Logic.App.Types exposing (CastingContext, HeldItem(..), Iota)


getPlayerHeldItemContent : CastingContext -> Maybe Iota
getPlayerHeldItemContent context =
    case Dict.get "Caster" context.entities of
        Just { heldItemContent } ->
            heldItemContent

        _ ->
            Nothing


getPlayerHeldItem : CastingContext -> HeldItem
getPlayerHeldItem context =
    case Dict.get "Caster" context.entities of
        Just { heldItem } ->
            heldItem

        _ ->
            NoItem


setPlayerHeldItem : CastingContext -> HeldItem -> CastingContext
setPlayerHeldItem context item =
    { context
        | entities =
            Dict.update "Caster"
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
            Dict.update "Caster"
                (\v ->
                    case v of
                        Just player ->
                            Just { player | heldItemContent = heldItemContent }

                        Nothing ->
                            v
                )
                context.entities
    }


setEntityHeldItem : CastingContext -> String -> HeldItem -> CastingContext
setEntityHeldItem context entityName item =
    { context
        | entities =
            Dict.update entityName
                (\v ->
                    case v of
                        Just entity ->
                            Just { entity | heldItem = item }

                        Nothing ->
                            v
                )
                context.entities
    }


setEntityHeldItemContent : CastingContext -> String -> Maybe Iota -> CastingContext
setEntityHeldItemContent context entityName heldItemContent =
    { context
        | entities =
            Dict.update entityName
                (\v ->
                    case v of
                        Just entity ->
                            Just { entity | heldItemContent = heldItemContent }

                        Nothing ->
                            v
                )
                context.entities
    }


getEntityHeldItem : CastingContext -> String -> HeldItem
getEntityHeldItem context entityName =
    case Dict.get entityName context.entities of
        Just { heldItem } ->
            heldItem

        _ ->
            NoItem


getEntityHeldItemContent : CastingContext -> String -> Maybe Iota
getEntityHeldItemContent context entityName =
    case Dict.get entityName context.entities of
        Just { heldItemContent } ->
            heldItemContent

        _ ->
            Nothing
