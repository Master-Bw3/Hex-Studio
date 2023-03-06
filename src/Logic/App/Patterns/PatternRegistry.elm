module Logic.App.Patterns.PatternRegistry exposing (getPatternFromName, getPatternFromSignature, numberLiteralGenerator, patternRegistry, unknownPattern)

import Array exposing (Array)
import Array.Extra as Array
import FontAwesome.Solid exposing (signature)
import Html exposing (i)
import Logic.App.Patterns.Circles exposing (..)
import Logic.App.Patterns.Lists exposing (..)
import Logic.App.Patterns.Math exposing (..)
import Logic.App.Patterns.Misc exposing (..)
import Logic.App.Patterns.OperatorUtils exposing (action1Input, getAny, getIotaList, getPatternList, makeConstant, mapNothingToMissingIota, moveNothingsToFront)
import Logic.App.Patterns.ReadWrite exposing (..)
import Logic.App.Patterns.Selectors exposing (..)
import Logic.App.Patterns.Spells exposing (..)
import Logic.App.Patterns.Stack exposing (..)
import Logic.App.Stack.Stack exposing (applyPatternToStack, applyPatternsToStack, applyPatternsToStackStopAtErrorOrHalt)
import Logic.App.Types exposing (ActionResult, ApplyToStackResult(..), CastingContext, EntityType(..), HeldItem(..), Iota(..), Mishap(..), PatternType)
import Logic.App.Utils.Utils exposing (unshift)
import Ports.HexNumGen as HexNumGen
import Settings.Theme exposing (..)
import Logic.App.Patterns.OperatorUtils exposing (getPatternOrIotaList)


noAction : Array Iota -> CastingContext -> ActionResult
noAction stack ctx =
    { stack = stack, ctx = ctx, success = True }


unknownPattern : PatternType
unknownPattern =
    { signature = ""
    , action = \stack ctx -> { stack = unshift (Garbage InvalidPattern) stack, ctx = ctx, success = False }
    , displayName = "Unknown Pattern"
    , internalName = "unknown"
    , color = accent3
    , outputOptions = []
    , selectedOutput = Nothing
    }


getPatternFromSignature : String -> PatternType
getPatternFromSignature signature =
    case List.head <| List.filter (\regPattern -> regPattern.signature == signature) patternRegistry of
        Just a ->
            a

        Nothing ->
            if String.startsWith "aqaa" signature then
                numberLiteralGenerator signature False

            else if String.startsWith "dedd" signature then
                numberLiteralGenerator signature True

            else
                let
                    parseBookkeeperResult =
                        parseBookkeeper signature
                in
                if parseBookkeeperResult.internalName /= "unknown" then
                    parseBookkeeperResult

                else
                    { unknownPattern | signature = signature, displayName = "Pattern " ++ "\"" ++ signature ++ "\"" }


getPatternFromName : String -> ( PatternType, Cmd msg )
getPatternFromName name =
    case List.head <| List.filter (\regPattern -> regPattern.displayName == name || regPattern.internalName == name || regPattern.signature == name) patternRegistry of
        Just a ->
            ( a, Cmd.none )

        Nothing ->
            case String.toFloat name of
                Just number ->
                    ( unknownPattern, HexNumGen.sendNumber number )

                Nothing ->
                    ( unknownPattern, Cmd.none )


parseBookkeeper : String -> PatternType
parseBookkeeper signature =
    if signature == "" then
        { signature = signature, internalName = "mask", action = mask [ "-" ], displayName = "Bookkeeper's -", color = accent1, outputOptions = [], selectedOutput = Nothing }

    else
        let
            angleList =
                String.split "" signature

            parseSignature angle accumulatorResult =
                case accumulatorResult of
                    Ok accumulator ->
                        if List.length accumulator == 0 then
                            if angle == "e" then
                                Ok <| [ "\\", "-" ] ++ accumulator

                            else if angle == "w" then
                                Ok <| [ "-", "-" ] ++ accumulator

                            else if angle == "a" then
                                Ok <| "v" :: accumulator

                            else
                                Err accumulator

                        else
                            case Maybe.withDefault "" (List.head accumulator) of
                                "\\" ->
                                    if angle == "a" then
                                        Ok <| "v" :: Maybe.withDefault [] (List.tail accumulator)

                                    else
                                        Err accumulator

                                "v" ->
                                    if angle == "e" then
                                        Ok <| "-" :: accumulator

                                    else if angle == "d" then
                                        Ok <| "\\" :: accumulator

                                    else
                                        Err accumulator

                                "-" ->
                                    if angle == "w" then
                                        Ok <| "-" :: accumulator

                                    else if angle == "e" then
                                        Ok <| [ "\\", "-" ] ++ Maybe.withDefault [] (List.tail accumulator)

                                    else
                                        Err accumulator

                                _ ->
                                    Err accumulator

                    Err _ ->
                        accumulatorResult

            maskCodeResult =
                case List.foldl parseSignature (Ok []) angleList of
                    Ok maskCode ->
                        if Maybe.withDefault "" (List.head maskCode) == "\\" then
                            Err <| List.reverse maskCode

                        else
                            Ok <| List.reverse maskCode

                    Err maskCode ->
                        Err <| List.reverse maskCode
        in
        case maskCodeResult of
            Ok maskCode ->
                { signature = signature
                , internalName = "mask"
                , action = mask maskCode
                , displayName = "Bookkeeper's " ++ String.concat maskCode
                , color = accent1
                , outputOptions = []
                , selectedOutput = Nothing
                }

            Err _ ->
                unknownPattern


patternRegistry : List PatternType
patternRegistry =
    [ { signature = "wawawddew", internalName = "interop/gravity/get", action = noAction, displayName = "", color = accent1, outputOptions = [], selectedOutput = Nothing }
    , { signature = "wdwdwaaqw", internalName = "interop/gravity/set", action = noAction, displayName = "", color = accent1, outputOptions = [], selectedOutput = Nothing }
    , { signature = "aawawwawwa", internalName = "interop/pehkui/get", action = noAction, displayName = "", color = accent1, outputOptions = [], selectedOutput = Nothing }
    , { signature = "ddwdwwdwwd", internalName = "interop/pehkui/set", action = noAction, displayName = "", color = accent1, outputOptions = [], selectedOutput = Nothing }
    , { signature = "qaq", internalName = "get_caster", action = getCaster, displayName = "Mind's Reflection", color = accent1, outputOptions = [], selectedOutput = Nothing }
    , { signature = "aa", internalName = "entity_pos/eye", action = entityPos, displayName = "Compass' Purification", color = accent1, outputOptions = [ Vector ( 0, 0, 0 ) ], selectedOutput = Just (Vector ( 0, 0, 0 )) }
    , { signature = "dd", internalName = "entity_pos/foot", action = entityPos, displayName = "Compass' Purification II", color = accent1, outputOptions = [ Vector ( 0, 0, 0 ) ], selectedOutput = Just (Vector ( 0, 0, 0 )) }
    , { signature = "wa", internalName = "get_entity_look", action = getEntityLook, displayName = "Alidade's Purification", color = accent1, outputOptions = [ Vector ( 0, 0, 0 ) ], selectedOutput = Just (Vector ( 0, 0, 0 )) }
    , { signature = "awq", internalName = "get_entity_height", action = getEntityHeight, displayName = "Stadiometer's Purification", color = accent1, outputOptions = [ Number 0 ], selectedOutput = Just (Number 0) }
    , { signature = "wq", internalName = "get_entity_velocity", action = getEntityVelocity, displayName = "Pace Purification", color = accent1, outputOptions = [ Vector ( 0, 0, 0 ) ], selectedOutput = Just (Vector ( 0, 0, 0 )) }
    , { signature = "wqaawdd", internalName = "raycast", action = raycast, displayName = "Archer's Distillation", color = accent1, outputOptions = [ Vector ( 0, 0, 0 ), Null ], selectedOutput = Just (Vector ( 0, 0, 0 )) }
    , { signature = "weddwaa", internalName = "raycast/axis", action = raycastAxis, displayName = "Architect's Distillation", color = accent1, outputOptions = [ Vector ( 0, 0, 0 ), Null ], selectedOutput = Just (Vector ( 0, 0, 0 )) }
    , { signature = "weaqa", internalName = "raycast/entity", action = raycastEntity, displayName = "Scout's Distillation", color = accent1, outputOptions = [ Entity Unset, Null ], selectedOutput = Just (Entity Unset) }
    , { signature = "eaqwqae", internalName = "circle/impetus_pos", action = noAction, displayName = "Waystone Reflection", color = accent1, outputOptions = [], selectedOutput = Nothing }
    , { signature = "eaqwqaewede", internalName = "circle/impetus_dir", action = circleImpetusDirection, displayName = "Lodestone Reflection", color = accent1, outputOptions = [], selectedOutput = Nothing }
    , { signature = "eaqwqaewdd", internalName = "circle/bounds/min", action = circleBoundsMin, displayName = "Lesser Fold Reflection", color = accent1, outputOptions = [], selectedOutput = Nothing }
    , { signature = "aqwqawaaqa", internalName = "circle/bounds/max", action = circleBoundsMax, displayName = "Greater Fold Reflection", color = accent1, outputOptions = [], selectedOutput = Nothing }
    , { signature = "aawdd", internalName = "swap", action = swap, displayName = "Jester's Gambit", color = accent1, outputOptions = [], selectedOutput = Nothing }
    , { signature = "aaeaa", internalName = "rotate", action = rotate, displayName = "Rotation Gambit", color = accent1, outputOptions = [], selectedOutput = Nothing }
    , { signature = "ddqdd", internalName = "rotate_reverse", action = rotateReverse, displayName = "Rotation Gambit II", color = accent1, outputOptions = [], selectedOutput = Nothing }
    , { signature = "aadaa", internalName = "duplicate", action = duplicate, displayName = "Gemini Decomposition", color = accent1, outputOptions = [], selectedOutput = Nothing }
    , { signature = "aaedd", internalName = "over", action = over, displayName = "Prospector's Gambit", color = accent1, outputOptions = [], selectedOutput = Nothing }
    , { signature = "ddqaa", internalName = "tuck", action = tuck, displayName = "Undertaker's Gambit", color = accent1, outputOptions = [], selectedOutput = Nothing }
    , { signature = "aadadaaw", internalName = "two_dup", action = dup2, displayName = "Dioscuri Gambi", color = accent1, outputOptions = [], selectedOutput = Nothing }
    , { signature = "qwaeawqaeaqa", internalName = "stack_len", action = stackLength, displayName = "Flock's Reflection", color = accent1, outputOptions = [], selectedOutput = Nothing }
    , { signature = "aadaadaa", internalName = "duplicate_n", action = duplicateN, displayName = "Gemini Gambit", color = accent1, outputOptions = [], selectedOutput = Nothing }
    , { signature = "ddad", internalName = "fisherman", action = fisherman, displayName = "Fisherman's Gambit", color = accent1, outputOptions = [], selectedOutput = Nothing }
    , { signature = "aada", internalName = "fisherman/copy", action = fishermanCopy, displayName = "Fisherman's Gambit II", color = accent1, outputOptions = [], selectedOutput = Nothing }
    , { signature = "qaawdde", internalName = "swizzle", action = noAction, displayName = "", color = accent1, outputOptions = [], selectedOutput = Nothing } -- do this
    , { signature = "waaw", internalName = "add", action = add, displayName = "Additive Distillation", color = accent1, outputOptions = [], selectedOutput = Nothing }
    , { signature = "wddw", internalName = "sub", action = subtract, displayName = "Subtractive Distillation", color = accent1, outputOptions = [], selectedOutput = Nothing }
    , { signature = "waqaw", internalName = "mul_dot", action = mulDot, displayName = "Multiplicative Distillation", color = accent1, outputOptions = [], selectedOutput = Nothing }
    , { signature = "wdedw", internalName = "div_cross", action = divCross, displayName = "Division Distillation", color = accent1, outputOptions = [], selectedOutput = Nothing }
    , { signature = "wqaqw", internalName = "abs_len", action = absLen, displayName = "Length Purification", color = accent1, outputOptions = [], selectedOutput = Nothing }
    , { signature = "wedew", internalName = "pow_proj", action = powProj, displayName = "Power Distillation", color = accent1, outputOptions = [], selectedOutput = Nothing }
    , { signature = "ewq", internalName = "floor", action = floorAction, displayName = "Floor Purification", color = accent1, outputOptions = [], selectedOutput = Nothing }
    , { signature = "qwe", internalName = "ceil", action = ceilAction, displayName = "Ceiling Purification", color = accent1, outputOptions = [], selectedOutput = Nothing }
    , { signature = "eqqqqq", internalName = "construct_vec", action = constructVector, displayName = "Vector Exaltation", color = accent1, outputOptions = [], selectedOutput = Nothing }
    , { signature = "qeeeee", internalName = "deconstruct_vec", action = deconstructVector, displayName = "Vector Disintegration", color = accent1, outputOptions = [], selectedOutput = Nothing }
    , { signature = "qqqqqaww", internalName = "coerce_axial", action = coerceAxial, displayName = "Axial Purification", color = accent1, outputOptions = [], selectedOutput = Nothing }
    , { signature = "wdw", internalName = "and", action = andBool, displayName = "Conjunction Distillation", color = accent1, outputOptions = [], selectedOutput = Nothing }
    , { signature = "waw", internalName = "or", action = orBool, displayName = "Disjunction Distillation", color = accent1, outputOptions = [], selectedOutput = Nothing }
    , { signature = "dwa", internalName = "xor", action = xorBool, displayName = "Exclusion Distillation", color = accent1, outputOptions = [], selectedOutput = Nothing }
    , { signature = "e", internalName = "greater", action = greaterThan, displayName = "Maximus Distillation", color = accent1, outputOptions = [], selectedOutput = Nothing }
    , { signature = "q", internalName = "less", action = lessThan, displayName = "Minimus Distillation", color = accent1, outputOptions = [], selectedOutput = Nothing }
    , { signature = "ee", internalName = "greater_eq", action = greaterThanOrEqualTo, displayName = "Maximus Distillation II", color = accent1, outputOptions = [], selectedOutput = Nothing }
    , { signature = "qq", internalName = "less_eq", action = lessThanOrEqualTo, displayName = "Minimus Distillation II", color = accent1, outputOptions = [], selectedOutput = Nothing }
    , { signature = "ad", internalName = "equals", action = equalTo, displayName = "Equality Distillation", color = accent1, outputOptions = [], selectedOutput = Nothing }
    , { signature = "da", internalName = "not_equals", action = notEqualTo, displayName = "Inequality Distillation", color = accent1, outputOptions = [], selectedOutput = Nothing }
    , { signature = "dw", internalName = "not", action = invertBool, displayName = "Negation Purification", color = accent1, outputOptions = [], selectedOutput = Nothing }
    , { signature = "aw", internalName = "bool_coerce", action = boolCoerce, displayName = "Augur's Purification", color = accent1, outputOptions = [], selectedOutput = Nothing }
    , { signature = "awdd", internalName = "if", action = ifBool, displayName = "Augur's Exaltation", color = accent1, outputOptions = [], selectedOutput = Nothing }
    , { signature = "eqqq", internalName = "random", action = makeConstant (Number 0.5), displayName = "Entropy Reflection", color = accent1, outputOptions = [], selectedOutput = Nothing }
    , { signature = "qqqqqaa", internalName = "sin", action = sine, displayName = "Sine Purification", color = accent1, outputOptions = [], selectedOutput = Nothing }
    , { signature = "qqqqqad", internalName = "cos", action = cosine, displayName = "Cosine Purification", color = accent1, outputOptions = [], selectedOutput = Nothing }
    , { signature = "wqqqqqadq", internalName = "tan", action = tangent, displayName = "Tangent Purification", color = accent1, outputOptions = [], selectedOutput = Nothing }
    , { signature = "ddeeeee", internalName = "arcsin", action = arcsin, displayName = "Inverse Sine Purification", color = accent1, outputOptions = [], selectedOutput = Nothing }
    , { signature = "adeeeee", internalName = "arccos", action = arccos, displayName = "Inverse Cosine Purification", color = accent1, outputOptions = [], selectedOutput = Nothing }
    , { signature = "eadeeeeew", internalName = "arctan", action = arctan, displayName = "Inverse Tangent Purification", color = accent1, outputOptions = [], selectedOutput = Nothing }
    , { signature = "eqaqe", internalName = "logarithm", action = logarithm, displayName = "Logarithmic Distillation", color = accent1, outputOptions = [], selectedOutput = Nothing }
    , { signature = "addwaad", internalName = "modulo", action = modulo, displayName = "Modulus Distillation", color = accent1, outputOptions = [], selectedOutput = Nothing }
    , { signature = "wdweaqa", internalName = "and_bit", action = andBit, displayName = "Intersection Distillation", color = accent1, outputOptions = [], selectedOutput = Nothing }
    , { signature = "waweaqa", internalName = "or_bit", action = orBit, displayName = "Unifying Distillation", color = accent1, outputOptions = [], selectedOutput = Nothing }
    , { signature = "dwaeaqa", internalName = "xor_bit", action = xorBit, displayName = "Exclusionary Distillation", color = accent1, outputOptions = [], selectedOutput = Nothing }
    , { signature = "dweaqa", internalName = "not_bit", action = notBit, displayName = "Inversion Purification", color = accent1, outputOptions = [], selectedOutput = Nothing }
    , { signature = "aweaqa", internalName = "to_set", action = toSet, displayName = "Uniqueness Purification", color = accent1, outputOptions = [], selectedOutput = Nothing }
    , { signature = "de", internalName = "print", action = print, displayName = "Reveal", color = accent1, outputOptions = [], selectedOutput = Nothing }
    , { signature = "aawaawaa", internalName = "explode", action = explode, displayName = "Explosion", color = accent1, outputOptions = [], selectedOutput = Nothing }
    , { signature = "ddwddwdd", internalName = "explode/fire", action = explodeFire, displayName = "Fireball", color = accent1, outputOptions = [], selectedOutput = Nothing }
    , { signature = "awqqqwaqw", internalName = "add_motion", action = addMotion, displayName = "Impulse", color = accent1, outputOptions = [], selectedOutput = Nothing }
    , { signature = "awqqqwaq", internalName = "blink", action = blink, displayName = "Blink", color = accent1, outputOptions = [], selectedOutput = Nothing }
    , { signature = "qaqqqqq", internalName = "break_block", action = breakBlock, displayName = "Break Block", color = accent1, outputOptions = [], selectedOutput = Nothing }
    , { signature = "eeeeede", internalName = "place_block", action = placeBlock, displayName = "Place Block", color = accent1, outputOptions = [], selectedOutput = Nothing }
    , { signature = "awddwqawqwawq", internalName = "colorize", action = colorize, displayName = "Internalize Pigment", color = accent1, outputOptions = [], selectedOutput = Nothing }
    , { signature = "aqawqadaq", internalName = "create_water", action = createWater, displayName = "Create Water", color = accent1, outputOptions = [], selectedOutput = Nothing }
    , { signature = "dedwedade", internalName = "destroy_water", action = destroyWater, displayName = "Destroy Liquid", color = accent1, outputOptions = [], selectedOutput = Nothing }
    , { signature = "aaqawawa", internalName = "ignite", action = ignite, displayName = "Ignite Block", color = accent1, outputOptions = [], selectedOutput = Nothing }
    , { signature = "ddedwdwd", internalName = "extinguish", action = extinguish, displayName = "Extinguish Area", color = accent1, outputOptions = [], selectedOutput = Nothing }
    , { signature = "qqa", internalName = "conjure_block", action = conjureBlock, displayName = "Conjure Block", color = accent1, outputOptions = [], selectedOutput = Nothing }
    , { signature = "qqd", internalName = "conjure_light", action = conjureLight, displayName = "Conjure Light", color = accent1, outputOptions = [], selectedOutput = Nothing }
    , { signature = "wqaqwawqaqw", internalName = "bonemeal", action = bonemeal, displayName = "Overgrow", color = accent1, outputOptions = [], selectedOutput = Nothing }
    , { signature = "qqqqqwaeaeaeaeaea", internalName = "recharge", action = recharge, displayName = "Recharge Item", color = accent1, outputOptions = [], selectedOutput = Nothing }
    , { signature = "qdqawwaww", internalName = "erase", action = erase, displayName = "Erase Item", color = accent1, outputOptions = [], selectedOutput = Nothing }
    , { signature = "wqaqwd", internalName = "edify", action = edify, displayName = "Edify Sapling", color = accent1, outputOptions = [], selectedOutput = Nothing }
    , { signature = "adaa", internalName = "beep", action = beep, displayName = "Make Note", color = accent1, outputOptions = [], selectedOutput = Nothing }
    , { signature = "waqqqqq", internalName = "craft/cypher", action = craftArtifact Cypher, displayName = "Craft Cypher", color = accent1, outputOptions = [], selectedOutput = Nothing }
    , { signature = "wwaqqqqqeaqeaeqqqeaeq", internalName = "craft/trinket", action = craftArtifact Trinket, displayName = "Craft Trinket", color = accent1, outputOptions = [], selectedOutput = Nothing }
    , { signature = "wwaqqqqqeawqwqwqwqwqwwqqeadaeqqeqqeadaeqq", internalName = "craft/artifact", action = craftArtifact Artifact, displayName = "Craft Artifact", color = accent1, outputOptions = [], selectedOutput = Nothing }
    , { signature = "qqqqqaqwawaw", internalName = "potion/weakness", action = potion, displayName = "White Sun's Nadir", color = accent1, outputOptions = [], selectedOutput = Nothing }
    , { signature = "qqqqqawwawawd", internalName = "potion/levitation", action = potionFixedPotency, displayName = "Blue Sun's Nadir", color = accent1, outputOptions = [], selectedOutput = Nothing }
    , { signature = "qqqqqaewawawe", internalName = "potion/wither", action = potion, displayName = "Black Sun's Nadir", color = accent1, outputOptions = [], selectedOutput = Nothing }
    , { signature = "qqqqqadwawaww", internalName = "potion/poison", action = potion, displayName = "Red Sun's Nadir", color = accent1, outputOptions = [], selectedOutput = Nothing }
    , { signature = "qqqqqadwawaw", internalName = "potion/slowness", action = potion, displayName = "Green Sun's Nadir", color = accent1, outputOptions = [], selectedOutput = Nothing }
    , { signature = "waeawae", internalName = "sentinel/create", action = sentinelCreate, displayName = "Summon Sentinel", color = accent1, outputOptions = [], selectedOutput = Nothing }
    , { signature = "qdwdqdw", internalName = "sentinel/destroy", action = sentinelDestroy, displayName = "Banish Sentinel", color = accent1, outputOptions = [], selectedOutput = Nothing }
    , { signature = "waeawaede", internalName = "sentinel/get_pos", action = sentinelGetPos, displayName = "Locate Sentinel", color = accent1, outputOptions = [], selectedOutput = Nothing }
    , { signature = "waeawaedwa", internalName = "sentinel/wayfind", action = sentinelWayfind, displayName = "Wayfind Sentinel", color = accent1, outputOptions = [], selectedOutput = Nothing }
    , { signature = "qqqwqqqqqaq", internalName = "akashic/read", action = noAction, displayName = "", color = accent1, outputOptions = [], selectedOutput = Nothing }
    , { signature = "eeeweeeeede", internalName = "akashic/write", action = noAction, displayName = "", color = accent1, outputOptions = [], selectedOutput = Nothing }
    , { signature = "aqdee", internalName = "halt", action = noAction, displayName = "Charon's Gambit", color = accent1, outputOptions = [], selectedOutput = Nothing }
    , { signature = "aqqqqq", internalName = "read", action = read, displayName = "Scribe's Reflection", color = accent1, outputOptions = [], selectedOutput = Nothing }
    , { signature = "wawqwqwqwqwqw", internalName = "read/entity", action = noAction, displayName = "Chronicler's Purification", color = accent1, outputOptions = [], selectedOutput = Nothing }
    , { signature = "deeeee", internalName = "write", action = write, displayName = "Scribe's Gambit", color = accent1, outputOptions = [], selectedOutput = Nothing }
    , { signature = "wdwewewewewew", internalName = "write/entity", action = noAction, displayName = "Chronicler's Gambit", color = accent1, outputOptions = [], selectedOutput = Nothing }
    , { signature = "aqqqqqe", internalName = "readable", action = readable, displayName = "Auditor's Reflection", color = accent1, outputOptions = [], selectedOutput = Nothing }
    , { signature = "wawqwqwqwqwqwew", internalName = "readable/entity", action = makeConstant (Boolean False), displayName = "Auditor's Purification", color = accent1, outputOptions = [], selectedOutput = Nothing }
    , { signature = "deeeeeq", internalName = "writable", action = writable, displayName = "Assessor's Reflection", color = accent1, outputOptions = [], selectedOutput = Nothing }
    , { signature = "wdwewewewewewqw", internalName = "writable/entity", action = makeConstant (Boolean False), displayName = "Assessor's Purification", color = accent1, outputOptions = [], selectedOutput = Nothing }
    , { signature = "qeewdweddw", internalName = "read/local", action = readLocal, displayName = "Muninn's Reflection", color = accent1, outputOptions = [], selectedOutput = Nothing }
    , { signature = "eqqwawqaaw", internalName = "write/local", action = writeLocal, displayName = "Huginn's Gambit", color = accent1, outputOptions = [], selectedOutput = Nothing }
    , { signature = "d", internalName = "const/null", action = makeConstant Null, displayName = "Nullary Reflection", color = accent1, outputOptions = [], selectedOutput = Nothing }
    , { signature = "aqae", internalName = "const/true", action = makeConstant (Boolean True), displayName = "True Reflection", color = accent1, outputOptions = [], selectedOutput = Nothing }
    , { signature = "dedq", internalName = "const/false", action = makeConstant (Boolean False), displayName = "False Reflection", color = accent1, outputOptions = [], selectedOutput = Nothing }
    , { signature = "qqqqqea", internalName = "const/vec/px", action = makeConstant (Vector ( 1, 0, 0 )), displayName = "Vector Reflection +X", color = accent1, outputOptions = [], selectedOutput = Nothing }
    , { signature = "qqqqqew", internalName = "const/vec/py", action = makeConstant (Vector ( 0, 1, 0 )), displayName = "Vector Reflection +Y", color = accent1, outputOptions = [], selectedOutput = Nothing }
    , { signature = "qqqqqed", internalName = "const/vec/pz", action = makeConstant (Vector ( 0, 0, 1 )), displayName = "Vector Reflection +Z", color = accent1, outputOptions = [], selectedOutput = Nothing }
    , { signature = "eeeeeqa", internalName = "const/vec/nx", action = makeConstant (Vector ( -1, 0, 0 )), displayName = "Vector Reflection -X", color = accent1, outputOptions = [], selectedOutput = Nothing }
    , { signature = "eeeeeqw", internalName = "const/vec/ny", action = makeConstant (Vector ( 0, -1, 0 )), displayName = "Vector Reflection -Y", color = accent1, outputOptions = [], selectedOutput = Nothing }
    , { signature = "eeeeeqd", internalName = "const/vec/nz", action = makeConstant (Vector ( 0, 0, -1 )), displayName = "Vector Reflection -Z", color = accent1, outputOptions = [], selectedOutput = Nothing }
    , { signature = "qqqqq", internalName = "const/vec/0", action = makeConstant (Vector ( 0, 0, 0 )), displayName = "Vector Reflection Zero", color = accent1, outputOptions = [], selectedOutput = Nothing }
    , { signature = "qdwdq", internalName = "const/double/pi", action = makeConstant (Number pi), displayName = "Arc's Reflection", color = accent1, outputOptions = [], selectedOutput = Nothing }
    , { signature = "eawae", internalName = "const/double/tau", action = makeConstant (Number (pi * 2)), displayName = "Circle's Reflection", color = accent1, outputOptions = [], selectedOutput = Nothing }
    , { signature = "aaq", internalName = "const/double/e", action = makeConstant (Number e), displayName = "Euler's Reflection", color = accent1, outputOptions = [], selectedOutput = Nothing }
    , { signature = "qqqqqdaqa", internalName = "get_entity", action = getEntity, displayName = "Entity Purification", color = accent1, outputOptions = [ Entity Unset, Null ], selectedOutput = Just (Entity Unset) }
    , { signature = "qqqqqdaqaawa", internalName = "get_entity/animal", action = getEntity, displayName = "Entity Purification: Animal", color = accent1, outputOptions = [ Entity Unset, Null ], selectedOutput = Just (Entity Unset) }
    , { signature = "qqqqqdaqaawq", internalName = "get_entity/monster", action = getEntity, displayName = "Entity Purification: Monster", color = accent1, outputOptions = [ Entity Unset, Null ], selectedOutput = Just (Entity Unset) }
    , { signature = "qqqqqdaqaaww", internalName = "get_entity/item", action = getEntity, displayName = "Entity Purification: Item", color = accent1, outputOptions = [ Entity Unset, Null ], selectedOutput = Just (Entity Unset) }
    , { signature = "qqqqqdaqaawe", internalName = "get_entity/player", action = getEntity, displayName = "Entity Purification: Player", color = accent1, outputOptions = [ Entity Unset, Null ], selectedOutput = Just (Entity Unset) }
    , { signature = "qqqqqdaqaawd", internalName = "get_entity/living", action = getEntity, displayName = "Entity Purification: Living", color = accent1, outputOptions = [ Entity Unset, Null ], selectedOutput = Just (Entity Unset) }
    , { signature = "qqqqqwded", internalName = "zone_entity", action = noAction, displayName = "", color = accent1, outputOptions = [], selectedOutput = Nothing }
    , { signature = "qqqqqwdeddwa", internalName = "zone_entity/animal", action = noAction, displayName = "", color = accent1, outputOptions = [], selectedOutput = Nothing }
    , { signature = "eeeeewaqaawa", internalName = "zone_entity/not_animal", action = noAction, displayName = "", color = accent1, outputOptions = [], selectedOutput = Nothing }
    , { signature = "qqqqqwdeddwq", internalName = "zone_entity/monster", action = noAction, displayName = "", color = accent1, outputOptions = [], selectedOutput = Nothing }
    , { signature = "eeeeewaqaawq", internalName = "zone_entity/not_monster", action = noAction, displayName = "", color = accent1, outputOptions = [], selectedOutput = Nothing }
    , { signature = "qqqqqwdeddww", internalName = "zone_entity/item", action = noAction, displayName = "", color = accent1, outputOptions = [], selectedOutput = Nothing }
    , { signature = "eeeeewaqaaww", internalName = "zone_entity/not_item", action = noAction, displayName = "", color = accent1, outputOptions = [], selectedOutput = Nothing }
    , { signature = "qqqqqwdeddwe", internalName = "zone_entity/player", action = noAction, displayName = "", color = accent1, outputOptions = [], selectedOutput = Nothing }
    , { signature = "eeeeewaqaawe", internalName = "zone_entity/not_player", action = noAction, displayName = "", color = accent1, outputOptions = [], selectedOutput = Nothing }
    , { signature = "qqqqqwdeddwd", internalName = "zone_entity/living", action = noAction, displayName = "", color = accent1, outputOptions = [], selectedOutput = Nothing }
    , { signature = "eeeeewaqaawd", internalName = "zone_entity/not_living", action = noAction, displayName = "", color = accent1, outputOptions = [], selectedOutput = Nothing }
    , { signature = "edqde", internalName = "append", action = append, displayName = "Integration Distillation", color = accent1, outputOptions = [], selectedOutput = Nothing }
    , { signature = "qaeaq", internalName = "concat", action = concat, displayName = "Combination Distillation", color = accent1, outputOptions = [], selectedOutput = Nothing }
    , { signature = "deeed", internalName = "index", action = index, displayName = "Selection Distillation", color = accent1, outputOptions = [], selectedOutput = Nothing }
    , { signature = "dadad", internalName = "for_each", action = forEach, displayName = "Thoth's Gambit", color = accent1, outputOptions = [], selectedOutput = Nothing }
    , { signature = "aqaeaq", internalName = "list_size", action = listSize, displayName = "Abacus Purification", color = accent1, outputOptions = [], selectedOutput = Nothing }
    , { signature = "adeeed", internalName = "singleton", action = singleton, displayName = "Single's Purification", color = accent1, outputOptions = [], selectedOutput = Nothing }
    , { signature = "qqaeaae", internalName = "empty_list", action = makeConstant (IotaList Array.empty), displayName = "Vacant Reflection", color = accent1, outputOptions = [], selectedOutput = Nothing }
    , { signature = "qqqaede", internalName = "reverse_list", action = reverseList, displayName = "Retrograde Purification", color = accent1, outputOptions = [], selectedOutput = Nothing }
    , { signature = "ewdqdwe", internalName = "last_n_list", action = lastNList, displayName = "Flock's Gambit", color = accent1, outputOptions = [], selectedOutput = Nothing }
    , { signature = "qwaeawq", internalName = "splat", action = splat, displayName = "Flock's Disintegration", color = accent1, outputOptions = [], selectedOutput = Nothing }
    , { signature = "dedqde", internalName = "index_of", action = indexOf, displayName = "Locator's Distillation", color = accent1, outputOptions = [], selectedOutput = Nothing }
    , { signature = "edqdewaqa", internalName = "list_remove", action = listRemove, displayName = "Excisor's Distillation", color = accent1, outputOptions = [], selectedOutput = Nothing }
    , { signature = "qaeaqwded", internalName = "slice", action = slice, displayName = "Selection Exaltation", color = accent1, outputOptions = [], selectedOutput = Nothing }
    , { signature = "wqaeaqw", internalName = "modify_in_place", action = modifyinPlace, displayName = "Surgeon's Exaltation", color = accent1, outputOptions = [], selectedOutput = Nothing }
    , { signature = "ddewedd", internalName = "construct", action = construct, displayName = "Speaker's Distillation", color = accent1, outputOptions = [], selectedOutput = Nothing }
    , { signature = "aaqwqaa", internalName = "deconstruct", action = deconstruct, displayName = "Speaker's Decomposition", color = accent1, outputOptions = [], selectedOutput = Nothing }
    , { signature = "qqqaw", internalName = "escape", action = noAction, displayName = "Consideration", color = accent1, outputOptions = [], selectedOutput = Nothing }
    , { signature = "qqq", internalName = "open_paren", action = makeConstant (OpenParenthesis Array.empty), displayName = "Introspection", color = accent1, outputOptions = [], selectedOutput = Nothing }
    , { signature = "eee", internalName = "close_paren", action = noAction, displayName = "Retrospection", color = accent1, outputOptions = [], selectedOutput = Nothing }
    , { signature = "deaqq", internalName = "eval", action = eval, displayName = "Hermes' Gambit", color = accent1, outputOptions = [], selectedOutput = Nothing }
    ]



-- eval patterns


eval : Array Iota -> CastingContext -> ActionResult
eval stack ctx =
    let
        maybeIota =
            Array.get 0 stack

        newStack =
            Array.slice 1 (Array.length stack) stack
    in
    case maybeIota of
        Nothing ->
            { stack = unshift (Garbage NotEnoughIotas) newStack, ctx = ctx, success = False }

        Just iota ->
            case getPatternOrIotaList <| iota of
                Nothing ->
                    { stack = unshift (Garbage IncorrectIota) newStack, ctx = ctx, success = False }

                _ ->
                    case iota of
                        IotaList list ->
                            let
                                applyResult =
                                    applyPatternsToStackStopAtErrorOrHalt
                                        newStack
                                        ctx
                                        (Array.toList <|
                                            Array.map
                                                (\i ->
                                                    case i of
                                                        Pattern pattern _ ->
                                                            pattern

                                                        _ ->
                                                            unknownPattern
                                                )
                                                list
                                        )
                            in
                            { stack =
                                Array.filter
                                    (\i ->
                                        case i of
                                            OpenParenthesis _ ->
                                                False

                                            _ ->
                                                True
                                    )
                                    applyResult.stack
                            , ctx = applyResult.ctx
                            , success = not applyResult.error
                            }

                        Pattern pattern _ ->
                            let
                                applyResult =
                                    applyPatternsToStackStopAtErrorOrHalt newStack ctx [ pattern ]
                            in
                            { stack = applyResult.stack, ctx = applyResult.ctx, success = not applyResult.error }

                        _ ->
                            { stack = Array.fromList [ Garbage CatastrophicFailure ], ctx = ctx, success = False }


forEach : Array Iota -> CastingContext -> ActionResult
forEach stack ctx =
    let
        maybeIota1 =
            Array.get 1 stack

        maybeIota2 =
            Array.get 0 stack

        newStack =
            Array.slice 2 (Array.length stack) stack
    in
    if maybeIota1 == Nothing || maybeIota2 == Nothing then
        { stack = Array.append (Array.map mapNothingToMissingIota <| Array.fromList <| moveNothingsToFront [ maybeIota1, maybeIota2 ]) newStack
        , ctx = ctx
        , success = False
        }

    else
        case ( Maybe.map getPatternList maybeIota1, Maybe.map getIotaList maybeIota2 ) of
            ( Just iota1, Just iota2 ) ->
                if iota1 == Nothing || iota2 == Nothing then
                    { stack =
                        Array.append
                            (Array.fromList
                                [ Maybe.withDefault (Garbage IncorrectIota) iota1
                                , Maybe.withDefault (Garbage IncorrectIota) iota2
                                ]
                            )
                            newStack
                    , ctx = ctx
                    , success = False
                    }

                else
                    case ( iota1, iota2 ) of
                        ( Just (IotaList patternList), Just (IotaList iotaList) ) ->
                            let
                                applyResult =
                                    Array.foldl
                                        (\iota accumulator ->
                                            if accumulator.continue == False then
                                                accumulator

                                            else
                                                let
                                                    subApplyResult =
                                                        applyPatternsToStackStopAtErrorOrHalt
                                                            (unshift iota newStack)
                                                            accumulator.ctx
                                                            (Array.toList <|
                                                                Array.map
                                                                    (\i ->
                                                                        case i of
                                                                            Pattern pattern _ ->
                                                                                pattern

                                                                            _ ->
                                                                                unknownPattern
                                                                    )
                                                                    patternList
                                                            )

                                                    thothList =
                                                        case Array.get 0 accumulator.stack of
                                                            Just (IotaList list) ->
                                                                list

                                                            _ ->
                                                                Array.empty

                                                    success =
                                                        if accumulator.success == True && subApplyResult.error then
                                                            False

                                                        else
                                                            accumulator.success
                                                in
                                                { stack = Array.set 0 (IotaList (Array.append thothList (Array.reverse subApplyResult.stack))) accumulator.stack
                                                , ctx = subApplyResult.ctx
                                                , success = success
                                                , continue =
                                                    if not success || subApplyResult.halted then
                                                        False

                                                    else
                                                        True
                                                }
                                        )
                                        { stack = unshift (IotaList Array.empty) newStack, ctx = ctx, success = True, continue = True }
                                        iotaList
                            in
                            { stack =
                                Array.filter
                                    (\i ->
                                        case i of
                                            OpenParenthesis _ ->
                                                False

                                            _ ->
                                                True
                                    )
                                    applyResult.stack
                            , ctx = applyResult.ctx
                            , success = applyResult.success
                            }

                        _ ->
                            { stack = Array.fromList [ Garbage CatastrophicFailure ], ctx = ctx, success = False }

            _ ->
                -- this should never happen
                { stack = unshift (Garbage CatastrophicFailure) newStack
                , ctx = ctx
                , success = False
                }


numberLiteralGenerator : String -> Bool -> PatternType
numberLiteralGenerator angleSignature isNegative =
    let
        letterMap : Char -> (Float -> Float)
        letterMap letter =
            case letter of
                'w' ->
                    (+) 1

                'q' ->
                    (+) 5

                'e' ->
                    (+) 10

                'a' ->
                    (*) 2

                'd' ->
                    (*) 0.5

                _ ->
                    (+) 0

        numberAbs =
            List.foldl letterMap 0 <| String.toList <| String.dropLeft 4 angleSignature

        number =
            if isNegative then
                -numberAbs

            else
                numberAbs
    in
    { signature = angleSignature
    , action = numberLiteral number
    , displayName = "Numerical Reflection: " ++ String.fromFloat number
    , internalName = String.fromFloat number
    , color = accent1
    , outputOptions = []
    , selectedOutput = Nothing
    }
