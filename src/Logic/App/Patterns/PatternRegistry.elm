module Logic.App.Patterns.PatternRegistry exposing (getPatternFromName, getPatternFromSignature, numberLiteralGenerator, patternRegistry, unknownPattern)

import Array exposing (Array)
import Array.Extra as Array
import Dict exposing (Dict)
import FontAwesome.Solid exposing (signature)
import Html exposing (i)
import Logic.App.Patterns.Circles exposing (..)
import Logic.App.Patterns.Lists exposing (..)
import Logic.App.Patterns.Math exposing (..)
import Logic.App.Patterns.Misc exposing (..)
import Logic.App.Patterns.OperatorUtils exposing (action1Input, getAny, getIotaList, getPatternList, getPatternOrIotaList, makeConstant, mapNothingToMissingIota, moveNothingsToFront)
import Logic.App.Patterns.ReadWrite exposing (..)
import Logic.App.Patterns.Selectors exposing (..)
import Logic.App.Patterns.Spells exposing (..)
import Logic.App.Patterns.Stack exposing (..)
import Logic.App.Stack.EvalStack exposing (applyPatternToStack, applyPatternsToStack, applyToStackStopAtErrorOrHalt)
import Logic.App.Types exposing (ActionResult, ApplyToStackResult(..), CastingContext, Direction(..), EntityType(..), HeldItem(..), Iota(..), IotaType(..), MetaActionMsg(..), Mishap(..), Pattern)
import Logic.App.Utils.RegexPatterns exposing (bookkeepersPattern)
import Logic.App.Utils.Utils exposing (ifThenElse, unshift)
import Ports.HexNumGen as HexNumGen
import Regex
import Settings.Theme exposing (..)


noAction : Array Iota -> CastingContext -> ActionResult
noAction stack ctx =
    { stack = stack, ctx = ctx, success = True }


unknownPattern : Pattern
unknownPattern =
    { signature = ""
    , startDirection = East
    , action = \stack ctx -> { stack = unshift (Garbage InvalidPattern) stack, ctx = ctx, success = False }
    , metaAction = None
    , displayName = "Unknown Pattern"
    , internalName = "unknown"
    , color = accent3
    , outputOptions = []
    , selectedOutput = Nothing
    , active = True
    }


getPatternFromSignature : Maybe (Dict String ( String, Direction, Iota )) -> String -> Pattern
getPatternFromSignature maybeMacros signature =
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
                    case maybeMacros of
                        Just macros ->
                            case Dict.get signature macros of
                                Just value ->
                                    case value of
                                        ( displayName, direction, _ ) ->
                                            { signature = signature
                                            , internalName = ""
                                            , action = noAction
                                            , metaAction = None
                                            , displayName = displayName
                                            , color = accent1
                                            , outputOptions = []
                                            , active = True
                                            , selectedOutput = Nothing
                                            , startDirection = direction
                                            }

                                Nothing ->
                                    { unknownPattern | signature = signature, displayName = "Pattern " ++ "\"" ++ signature ++ "\"" }

                        Nothing ->
                            { unknownPattern | signature = signature, displayName = "Pattern " ++ "\"" ++ signature ++ "\"" }


getPatternFromName : Maybe (Dict String ( String, Direction, Iota )) -> String -> ( Pattern, Cmd msg )
getPatternFromName maybeMacros name =
    case List.head <| List.filter (\regPattern -> regPattern.displayName == name || regPattern.internalName == name || regPattern.signature == name) patternRegistry of
        Just a ->
            ( a, Cmd.none )

        Nothing ->
            case String.toFloat name of
                Just number ->
                    ( unknownPattern, HexNumGen.sendNumber number )

                Nothing ->
                    let
                        regexMatch =
                            Regex.find bookkeepersPattern name
                                |> List.map (\x -> x.match)
                                |> List.head
                                |> Maybe.withDefault ""
                                |> String.trim
                    in
                    if regexMatch == String.trim name then
                        ( reverseParseBookkeeper name, Cmd.none )

                    else
                        case maybeMacros of
                            Just macros ->
                                case Dict.get name macros of
                                    Just value ->
                                        case value of
                                            ( displayName, direction, _ ) ->
                                                ( { signature = name
                                                  , internalName = ""
                                                  , action = noAction
                                                  , metaAction = None
                                                  , displayName = displayName
                                                  , color = accent1
                                                  , outputOptions = []
                                                  , active = True
                                                  , selectedOutput = Nothing
                                                  , startDirection = direction
                                                  }
                                                , Cmd.none
                                                )

                                    Nothing ->
                                        if Regex.contains Logic.App.Utils.RegexPatterns.angleSignaturePattern name then
                                            ( getPatternFromSignature maybeMacros name, Cmd.none )

                                        else
                                            ( unknownPattern, Cmd.none )

                            Nothing ->
                                if Regex.contains Logic.App.Utils.RegexPatterns.angleSignaturePattern name then
                                    ( getPatternFromSignature maybeMacros name, Cmd.none )

                                else
                                    ( unknownPattern, Cmd.none )


reverseParseBookkeeper : String -> Pattern
reverseParseBookkeeper code =
    -- I'm very good at naming things
    if code == "-" then
        { signature = ""
        , internalName = "mask"
        , action = mask [ "-" ]
        , metaAction = None
        , displayName = "Bookkeeper's Gambit: -"
        , color = accent1
        , outputOptions = []
        , selectedOutput = Nothing
        , active = True
        , startDirection = East
        }

    else
        let
            codeList =
                String.split "" code

            codeGroupedByTwos =
                Debug.log "twos" <|
                    List.reverse <|
                        List.foldl
                            (\letter accumulator ->
                                let
                                    head =
                                        Maybe.withDefault "" (List.head accumulator)

                                    tail =
                                        Maybe.withDefault [] (List.tail accumulator)
                                in
                                if String.length head == 0 then
                                    letter :: tail

                                else if String.length head == 1 then
                                    (head ++ letter) :: tail

                                else
                                    letter :: accumulator
                            )
                            []
                            codeList

            toAngleSignature codeChunk accumulator =
                -- this function is slightly cursed
                let
                    _ =
                        Debug.log codeChunk accumulator
                in
                case codeChunk of
                    "--" ->
                        if String.endsWith "a" accumulator then
                            String.append accumulator "ew"

                        else if String.endsWith "w" accumulator then
                            String.append accumulator "ww"

                        else if String.endsWith "e" accumulator then
                            String.append accumulator "ww"

                        else
                            String.append accumulator "w"

                    "vv" ->
                        if String.endsWith "w" accumulator then
                            String.append accumulator "eada"

                        else if String.endsWith "a" accumulator then
                            String.append accumulator "dad"

                        else if String.endsWith "e" accumulator then
                            String.append accumulator "ada"

                        else
                            String.append accumulator "ada"

                    "v-" ->
                        if String.endsWith "w" accumulator then
                            String.append accumulator "eae"

                        else if String.endsWith "a" accumulator then
                            String.append accumulator "dae"

                        else if String.endsWith "e" accumulator then
                            String.append accumulator "eae"

                        else
                            String.append accumulator "ae"

                    "-v" ->
                        if String.endsWith "w" accumulator then
                            String.append accumulator "wea"

                        else if String.endsWith "a" accumulator then
                            String.append accumulator "eea"

                        else if String.endsWith "e" accumulator then
                            String.append accumulator "wea"

                        else
                            String.append accumulator "ea"

                    "v" ->
                        if String.endsWith "a" accumulator then
                            String.append accumulator "da"

                        else if String.endsWith "w" accumulator then
                            String.append accumulator "ea"

                        else if String.endsWith "e" accumulator then
                            String.append accumulator "ea"

                        else
                            String.append accumulator "a"

                    "-" ->
                        if String.endsWith "a" accumulator then
                            String.append accumulator "e"

                        else if String.endsWith "w" accumulator then
                            String.append accumulator "w"

                        else if String.endsWith "e" accumulator then
                            String.append accumulator "w"

                        else
                            String.append accumulator ""

                    _ ->
                        accumulator

            signature =
                List.foldl toAngleSignature "" codeGroupedByTwos
        in
        { signature = Debug.log "signature" signature
        , internalName = "mask"
        , action = mask (String.split "" code)
        , metaAction = None
        , displayName = "Bookkeeper's Gambit: " ++ code
        , color = accent1
        , outputOptions = []
        , selectedOutput = Nothing
        , active = True
        , startDirection = ifThenElse (String.startsWith "v" code) Southeast East
        }


parseBookkeeper : String -> Pattern
parseBookkeeper signature =
    if signature == "" then
        { signature = signature
        , internalName = "mask"
        , action = mask [ "-" ]
        , metaAction = None
        , displayName = "Bookkeeper's Gambit: -"
        , color = accent1
        , outputOptions = []
        , selectedOutput = Nothing
        , active = True
        , startDirection = East
        }

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
                , metaAction = None
                , displayName = "Bookkeeper's Gambit: " ++ String.concat maskCode
                , color = accent1
                , outputOptions = []
                , selectedOutput = Nothing
                , active = True
                , startDirection = East -- Todo: make this southeast if starting with v
                }

            Err _ ->
                unknownPattern


patternRegistry : List Pattern
patternRegistry =
    [ { signature = "wawawddew", internalName = "interop/gravity/get", action = noAction, displayName = "", outputOptions = [], selectedOutput = Nothing, startDirection = East }
    , { signature = "wdwdwaaqw", internalName = "interop/gravity/set", action = noAction, displayName = "", outputOptions = [], selectedOutput = Nothing, startDirection = East }
    , { signature = "aawawwawwa", internalName = "interop/pehkui/get", action = noAction, displayName = "", outputOptions = [], selectedOutput = Nothing, startDirection = East }
    , { signature = "ddwdwwdwwd", internalName = "interop/pehkui/set", action = noAction, displayName = "", outputOptions = [], selectedOutput = Nothing, startDirection = East }
    , { signature = "qaq", internalName = "get_caster", action = getCaster, displayName = "Mind's Reflection", outputOptions = [], selectedOutput = Nothing, startDirection = Northeast }
    , { signature = "aa", internalName = "entity_pos/eye", action = entityPos, displayName = "Compass' Purification", outputOptions = [ VectorType ], selectedOutput = Just ( VectorType, Vector ( 0, 0, 0 ) ), startDirection = East }
    , { signature = "dd", internalName = "entity_pos/foot", action = entityPos, displayName = "Compass' Purification II", outputOptions = [ VectorType ], selectedOutput = Just ( VectorType, Vector ( 0, 0, 0 ) ), startDirection = East }
    , { signature = "wa", internalName = "get_entity_look", action = getEntityLook, displayName = "Alidade's Purification", outputOptions = [ VectorType ], selectedOutput = Just ( VectorType, Vector ( 0, 0, 0 ) ), startDirection = East }
    , { signature = "awq", internalName = "get_entity_height", action = getEntityHeight, displayName = "Stadiometer's Purification", outputOptions = [ NumberType ], selectedOutput = Just ( NumberType, Number 0 ), startDirection = East }
    , { signature = "wq", internalName = "get_entity_velocity", action = getEntityVelocity, displayName = "Pace Purification", outputOptions = [ VectorType ], selectedOutput = Just ( VectorType, Vector ( 0, 0, 0 ) ), startDirection = East }
    , { signature = "wqaawdd", internalName = "raycast", action = raycast, displayName = "Archer's Distillation", outputOptions = [ VectorType, NullType ], selectedOutput = Just ( VectorType, Vector ( 0, 0, 0 ) ), startDirection = East }
    , { signature = "weddwaa", internalName = "raycast/axis", action = raycastAxis, displayName = "Architect's Distillation", outputOptions = [ VectorType, NullType ], selectedOutput = Just ( VectorType, Vector ( 0, 0, 0 ) ), startDirection = East }
    , { signature = "weaqa", internalName = "raycast/entity", action = raycastEntity, displayName = "Scout's Distillation", outputOptions = [ EntityType, NullType ], selectedOutput = Just ( EntityType, Entity Unset ), startDirection = East }
    , { signature = "eaqwqae", internalName = "circle/impetus_pos", action = noAction, displayName = "Waystone Reflection", outputOptions = [], selectedOutput = Nothing, startDirection = East }
    , { signature = "eaqwqaewede", internalName = "circle/impetus_dir", action = circleImpetusDirection, displayName = "Lodestone Reflection", outputOptions = [], selectedOutput = Nothing, startDirection = East }
    , { signature = "eaqwqaewdd", internalName = "circle/bounds/min", action = circleBoundsMin, displayName = "Lesser Fold Reflection", outputOptions = [], selectedOutput = Nothing, startDirection = East }
    , { signature = "aqwqawaaqa", internalName = "circle/bounds/max", action = circleBoundsMax, displayName = "Greater Fold Reflection", outputOptions = [], selectedOutput = Nothing, startDirection = East }
    , { signature = "aawdd", internalName = "swap", action = swap, displayName = "Jester's Gambit", outputOptions = [], selectedOutput = Nothing, startDirection = Northeast }
    , { signature = "aaeaa", internalName = "rotate", action = rotate, displayName = "Rotation Gambit", outputOptions = [], selectedOutput = Nothing, startDirection = East }
    , { signature = "ddqdd", internalName = "rotate_reverse", action = rotateReverse, displayName = "Rotation Gambit II", outputOptions = [], selectedOutput = Nothing, startDirection = East }
    , { signature = "aadaa", internalName = "duplicate", action = duplicate, displayName = "Gemini Decomposition", outputOptions = [], selectedOutput = Nothing, startDirection = East }
    , { signature = "aaedd", internalName = "over", action = over, displayName = "Prospector's Gambit", outputOptions = [], selectedOutput = Nothing, startDirection = East }
    , { signature = "ddqaa", internalName = "tuck", action = tuck, displayName = "Undertaker's Gambit", outputOptions = [], selectedOutput = Nothing, startDirection = East }
    , { signature = "aadadaaw", internalName = "two_dup", action = dup2, displayName = "Dioscuri Gambit", outputOptions = [], selectedOutput = Nothing, startDirection = East }
    , { signature = "qwaeawqaeaqa", internalName = "stack_len", action = stackLength, displayName = "Flock's Reflection", outputOptions = [], selectedOutput = Nothing, startDirection = East }
    , { signature = "aadaadaa", internalName = "duplicate_n", action = duplicateN, displayName = "Gemini Gambit", outputOptions = [], selectedOutput = Nothing, startDirection = East }
    , { signature = "ddad", internalName = "fisherman", action = fisherman, displayName = "Fisherman's Gambit", outputOptions = [], selectedOutput = Nothing, startDirection = East }
    , { signature = "aada", internalName = "fisherman/copy", action = fishermanCopy, displayName = "Fisherman's Gambit II", outputOptions = [], selectedOutput = Nothing, startDirection = East }
    , { signature = "qaawdde", internalName = "swizzle", action = noAction, displayName = "", outputOptions = [], selectedOutput = Nothing, startDirection = East } -- do this
    , { signature = "waaw", internalName = "add", action = add, displayName = "Additive Distillation", outputOptions = [], selectedOutput = Nothing, startDirection = East }
    , { signature = "wddw", internalName = "sub", action = subtract, displayName = "Subtractive Distillation", outputOptions = [], selectedOutput = Nothing, startDirection = East }
    , { signature = "waqaw", internalName = "mul_dot", action = mulDot, displayName = "Multiplicative Distillation", outputOptions = [], selectedOutput = Nothing, startDirection = East }
    , { signature = "wdedw", internalName = "div_cross", action = divCross, displayName = "Division Distillation", outputOptions = [], selectedOutput = Nothing, startDirection = East }
    , { signature = "wqaqw", internalName = "abs_len", action = absLen, displayName = "Length Purification", outputOptions = [], selectedOutput = Nothing, startDirection = East }
    , { signature = "wedew", internalName = "pow_proj", action = powProj, displayName = "Power Distillation", outputOptions = [], selectedOutput = Nothing, startDirection = East }
    , { signature = "ewq", internalName = "floor", action = floorAction, displayName = "Floor Purification", outputOptions = [], selectedOutput = Nothing, startDirection = East }
    , { signature = "qwe", internalName = "ceil", action = ceilAction, displayName = "Ceiling Purification", outputOptions = [], selectedOutput = Nothing, startDirection = East }
    , { signature = "eqqqqq", internalName = "construct_vec", action = constructVector, displayName = "Vector Exaltation", outputOptions = [], selectedOutput = Nothing, startDirection = East }
    , { signature = "qeeeee", internalName = "deconstruct_vec", action = deconstructVector, displayName = "Vector Disintegration", outputOptions = [], selectedOutput = Nothing, startDirection = East }
    , { signature = "qqqqqaww", internalName = "coerce_axial", action = coerceAxial, displayName = "Axial Purification", outputOptions = [], selectedOutput = Nothing, startDirection = East }
    , { signature = "wdw", internalName = "and", action = andBool, displayName = "Conjunction Distillation", outputOptions = [], selectedOutput = Nothing, startDirection = East }
    , { signature = "waw", internalName = "or", action = orBool, displayName = "Disjunction Distillation", outputOptions = [], selectedOutput = Nothing, startDirection = East }
    , { signature = "dwa", internalName = "xor", action = xorBool, displayName = "Exclusion Distillation", outputOptions = [], selectedOutput = Nothing, startDirection = East }
    , { signature = "e", internalName = "greater", action = greaterThan, displayName = "Maximus Distillation", outputOptions = [], selectedOutput = Nothing, startDirection = East }
    , { signature = "q", internalName = "less", action = lessThan, displayName = "Minimus Distillation", outputOptions = [], selectedOutput = Nothing, startDirection = East }
    , { signature = "ee", internalName = "greater_eq", action = greaterThanOrEqualTo, displayName = "Maximus Distillation II", outputOptions = [], selectedOutput = Nothing, startDirection = East }
    , { signature = "qq", internalName = "less_eq", action = lessThanOrEqualTo, displayName = "Minimus Distillation II", outputOptions = [], selectedOutput = Nothing, startDirection = East }
    , { signature = "ad", internalName = "equals", action = equalTo, displayName = "Equality Distillation", outputOptions = [], selectedOutput = Nothing, startDirection = East }
    , { signature = "da", internalName = "not_equals", action = notEqualTo, displayName = "Inequality Distillation", outputOptions = [], selectedOutput = Nothing, startDirection = East }
    , { signature = "dw", internalName = "not", action = invertBool, displayName = "Negation Purification", outputOptions = [], selectedOutput = Nothing, startDirection = East }
    , { signature = "aw", internalName = "bool_coerce", action = boolCoerce, displayName = "Augur's Purification", outputOptions = [], selectedOutput = Nothing, startDirection = East }
    , { signature = "awdd", internalName = "if", action = ifBool, displayName = "Augur's Exaltation", outputOptions = [], selectedOutput = Nothing, startDirection = East }
    , { signature = "eqqq", internalName = "random", action = makeConstant (Number 0.5), displayName = "Entropy Reflection", outputOptions = [], selectedOutput = Nothing, startDirection = East }
    , { signature = "qqqqqaa", internalName = "sin", action = sine, displayName = "Sine Purification", outputOptions = [], selectedOutput = Nothing, startDirection = East }
    , { signature = "qqqqqad", internalName = "cos", action = cosine, displayName = "Cosine Purification", outputOptions = [], selectedOutput = Nothing, startDirection = East }
    , { signature = "wqqqqqadq", internalName = "tan", action = tangent, displayName = "Tangent Purification", outputOptions = [], selectedOutput = Nothing, startDirection = East }
    , { signature = "ddeeeee", internalName = "arcsin", action = arcsin, displayName = "Inverse Sine Purification", outputOptions = [], selectedOutput = Nothing, startDirection = East }
    , { signature = "adeeeee", internalName = "arccos", action = arccos, displayName = "Inverse Cosine Purification", outputOptions = [], selectedOutput = Nothing, startDirection = East }
    , { signature = "eadeeeeew", internalName = "arctan", action = arctan, displayName = "Inverse Tangent Purification", outputOptions = [], selectedOutput = Nothing, startDirection = East }
    , { signature = "eqaqe", internalName = "logarithm", action = logarithm, displayName = "Logarithmic Distillation", outputOptions = [], selectedOutput = Nothing, startDirection = East }
    , { signature = "addwaad", internalName = "modulo", action = modulo, displayName = "Modulus Distillation", outputOptions = [], selectedOutput = Nothing, startDirection = East }
    , { signature = "wdweaqa", internalName = "and_bit", action = andBit, displayName = "Intersection Distillation", outputOptions = [], selectedOutput = Nothing, startDirection = East }
    , { signature = "waweaqa", internalName = "or_bit", action = orBit, displayName = "Unifying Distillation", outputOptions = [], selectedOutput = Nothing, startDirection = East }
    , { signature = "dwaeaqa", internalName = "xor_bit", action = xorBit, displayName = "Exclusionary Distillation", outputOptions = [], selectedOutput = Nothing, startDirection = East }
    , { signature = "dweaqa", internalName = "not_bit", action = notBit, displayName = "Inversion Purification", outputOptions = [], selectedOutput = Nothing, startDirection = East }
    , { signature = "aweaqa", internalName = "to_set", action = toSet, displayName = "Uniqueness Purification", outputOptions = [], selectedOutput = Nothing, startDirection = East }
    , { signature = "de", internalName = "print", action = print, displayName = "Reveal", outputOptions = [], selectedOutput = Nothing, startDirection = East }
    , { signature = "aawaawaa", internalName = "explode", action = explode, displayName = "Explosion", outputOptions = [], selectedOutput = Nothing, startDirection = East }
    , { signature = "ddwddwdd", internalName = "explode/fire", action = explodeFire, displayName = "Fireball", outputOptions = [], selectedOutput = Nothing, startDirection = East }
    , { signature = "awqqqwaqw", internalName = "add_motion", action = addMotion, displayName = "Impulse", outputOptions = [], selectedOutput = Nothing, startDirection = East }
    , { signature = "awqqqwaq", internalName = "blink", action = blink, displayName = "Blink", outputOptions = [], selectedOutput = Nothing, startDirection = East }
    , { signature = "qaqqqqq", internalName = "break_block", action = breakBlock, displayName = "Break Block", outputOptions = [], selectedOutput = Nothing, startDirection = East }
    , { signature = "eeeeede", internalName = "place_block", action = placeBlock, displayName = "Place Block", outputOptions = [], selectedOutput = Nothing, startDirection = East }
    , { signature = "awddwqawqwawq", internalName = "colorize", action = colorize, displayName = "Internalize Pigment", outputOptions = [], selectedOutput = Nothing, startDirection = East }
    , { signature = "aqawqadaq", internalName = "create_water", action = createWater, displayName = "Create Water", outputOptions = [], selectedOutput = Nothing, startDirection = East }
    , { signature = "dedwedade", internalName = "destroy_water", action = destroyWater, displayName = "Destroy Liquid", outputOptions = [], selectedOutput = Nothing, startDirection = East }
    , { signature = "aaqawawa", internalName = "ignite", action = ignite, displayName = "Ignite Block", outputOptions = [], selectedOutput = Nothing, startDirection = East }
    , { signature = "ddedwdwd", internalName = "extinguish", action = extinguish, displayName = "Extinguish Area", outputOptions = [], selectedOutput = Nothing, startDirection = East }
    , { signature = "qqa", internalName = "conjure_block", action = conjureBlock, displayName = "Conjure Block", outputOptions = [], selectedOutput = Nothing, startDirection = East }
    , { signature = "qqd", internalName = "conjure_light", action = conjureLight, displayName = "Conjure Light", outputOptions = [], selectedOutput = Nothing, startDirection = East }
    , { signature = "wqaqwawqaqw", internalName = "bonemeal", action = bonemeal, displayName = "Overgrow", outputOptions = [], selectedOutput = Nothing, startDirection = East }
    , { signature = "qqqqqwaeaeaeaeaea", internalName = "recharge", action = recharge, displayName = "Recharge Item", outputOptions = [], selectedOutput = Nothing, startDirection = East }
    , { signature = "qdqawwaww", internalName = "erase", action = erase, displayName = "Erase Item", outputOptions = [], selectedOutput = Nothing, startDirection = East }
    , { signature = "wqaqwd", internalName = "edify", action = edify, displayName = "Edify Sapling", outputOptions = [], selectedOutput = Nothing, startDirection = East }
    , { signature = "adaa", internalName = "beep", action = beep, displayName = "Make Note", outputOptions = [], selectedOutput = Nothing, startDirection = East }
    , { signature = "waqqqqq", internalName = "craft/cypher", action = craftArtifact Cypher, displayName = "Craft Cypher", outputOptions = [], selectedOutput = Nothing, startDirection = East }
    , { signature = "wwaqqqqqeaqeaeqqqeaeq", internalName = "craft/trinket", action = craftArtifact Trinket, displayName = "Craft Trinket", outputOptions = [], selectedOutput = Nothing, startDirection = East }
    , { signature = "wwaqqqqqeawqwqwqwqwqwwqqeadaeqqeqqeadaeqq", internalName = "craft/artifact", action = craftArtifact Artifact, displayName = "Craft Artifact", outputOptions = [], selectedOutput = Nothing, startDirection = East }
    , { signature = "qqqqqaqwawaw", internalName = "potion/weakness", action = potion, displayName = "White Sun's Nadir", outputOptions = [], selectedOutput = Nothing, startDirection = East }
    , { signature = "qqqqqawwawawd", internalName = "potion/levitation", action = potionFixedPotency, displayName = "Blue Sun's Nadir", outputOptions = [], selectedOutput = Nothing, startDirection = East }
    , { signature = "qqqqqaewawawe", internalName = "potion/wither", action = potion, displayName = "Black Sun's Nadir", outputOptions = [], selectedOutput = Nothing, startDirection = East }
    , { signature = "qqqqqadwawaww", internalName = "potion/poison", action = potion, displayName = "Red Sun's Nadir", outputOptions = [], selectedOutput = Nothing, startDirection = East }
    , { signature = "qqqqqadwawaw", internalName = "potion/slowness", action = potion, displayName = "Green Sun's Nadir", outputOptions = [], selectedOutput = Nothing, startDirection = East }
    , { signature = "waeawae", internalName = "sentinel/create", action = sentinelCreate, displayName = "Summon Sentinel", outputOptions = [], selectedOutput = Nothing, startDirection = East }
    , { signature = "qdwdqdw", internalName = "sentinel/destroy", action = sentinelDestroy, displayName = "Banish Sentinel", outputOptions = [], selectedOutput = Nothing, startDirection = East }
    , { signature = "waeawaede", internalName = "sentinel/get_pos", action = sentinelGetPos, displayName = "Locate Sentinel", outputOptions = [], selectedOutput = Nothing, startDirection = East }
    , { signature = "waeawaedwa", internalName = "sentinel/wayfind", action = sentinelWayfind, displayName = "Wayfind Sentinel", outputOptions = [], selectedOutput = Nothing, startDirection = East }
    , { signature = "qqqwqqqqqaq", internalName = "akashic/read", action = noAction, displayName = "", outputOptions = [], selectedOutput = Nothing, startDirection = East }
    , { signature = "eeeweeeeede", internalName = "akashic/write", action = noAction, displayName = "", outputOptions = [], selectedOutput = Nothing, startDirection = East }
    , { signature = "aqdee", internalName = "halt", action = noAction, displayName = "Charon's Gambit", outputOptions = [], selectedOutput = Nothing, startDirection = Southwest }
    , { signature = "aqqqqq", internalName = "read", action = read, displayName = "Scribe's Reflection", outputOptions = [], selectedOutput = Nothing, startDirection = East }
    , { signature = "wawqwqwqwqwqw", internalName = "read/entity", action = noAction, displayName = "Chronicler's Purification", outputOptions = [], selectedOutput = Nothing, startDirection = East }
    , { signature = "deeeee", internalName = "write", action = write, displayName = "Scribe's Gambit", outputOptions = [], selectedOutput = Nothing, startDirection = East }
    , { signature = "wdwewewewewew", internalName = "write/entity", action = noAction, displayName = "Chronicler's Gambit", outputOptions = [], selectedOutput = Nothing, startDirection = East }
    , { signature = "aqqqqqe", internalName = "readable", action = readable, displayName = "Auditor's Reflection", outputOptions = [], selectedOutput = Nothing, startDirection = East }
    , { signature = "wawqwqwqwqwqwew", internalName = "readable/entity", action = makeConstant (Boolean False), displayName = "Auditor's Purification", outputOptions = [], selectedOutput = Nothing, startDirection = East }
    , { signature = "deeeeeq", internalName = "writable", action = writable, displayName = "Assessor's Reflection", outputOptions = [], selectedOutput = Nothing, startDirection = East }
    , { signature = "wdwewewewewewqw", internalName = "writable/entity", action = makeConstant (Boolean False), displayName = "Assessor's Purification", outputOptions = [], selectedOutput = Nothing, startDirection = East }
    , { signature = "qeewdweddw", internalName = "read/local", action = readLocal, displayName = "Muninn's Reflection", outputOptions = [], selectedOutput = Nothing, startDirection = East }
    , { signature = "eqqwawqaaw", internalName = "write/local", action = writeLocal, displayName = "Huginn's Gambit", outputOptions = [], selectedOutput = Nothing, startDirection = East }
    , { signature = "d", internalName = "const/null", action = makeConstant Null, displayName = "Nullary Reflection", outputOptions = [], selectedOutput = Nothing, startDirection = East }
    , { signature = "aqae", internalName = "const/true", action = makeConstant (Boolean True), displayName = "True Reflection", outputOptions = [], selectedOutput = Nothing, startDirection = East }
    , { signature = "dedq", internalName = "const/false", action = makeConstant (Boolean False), displayName = "False Reflection", outputOptions = [], selectedOutput = Nothing, startDirection = East }
    , { signature = "qqqqqea", internalName = "const/vec/px", action = makeConstant (Vector ( 1, 0, 0 )), displayName = "Vector Reflection +X", outputOptions = [], selectedOutput = Nothing, startDirection = East }
    , { signature = "qqqqqew", internalName = "const/vec/py", action = makeConstant (Vector ( 0, 1, 0 )), displayName = "Vector Reflection +Y", outputOptions = [], selectedOutput = Nothing, startDirection = East }
    , { signature = "qqqqqed", internalName = "const/vec/pz", action = makeConstant (Vector ( 0, 0, 1 )), displayName = "Vector Reflection +Z", outputOptions = [], selectedOutput = Nothing, startDirection = East }
    , { signature = "eeeeeqa", internalName = "const/vec/nx", action = makeConstant (Vector ( -1, 0, 0 )), displayName = "Vector Reflection -X", outputOptions = [], selectedOutput = Nothing, startDirection = East }
    , { signature = "eeeeeqw", internalName = "const/vec/ny", action = makeConstant (Vector ( 0, -1, 0 )), displayName = "Vector Reflection -Y", outputOptions = [], selectedOutput = Nothing, startDirection = East }
    , { signature = "eeeeeqd", internalName = "const/vec/nz", action = makeConstant (Vector ( 0, 0, -1 )), displayName = "Vector Reflection -Z", outputOptions = [], selectedOutput = Nothing, startDirection = East }
    , { signature = "qqqqq", internalName = "const/vec/0", action = makeConstant (Vector ( 0, 0, 0 )), displayName = "Vector Reflection Zero", outputOptions = [], selectedOutput = Nothing, startDirection = East }
    , { signature = "qdwdq", internalName = "const/double/pi", action = makeConstant (Number pi), displayName = "Arc's Reflection", outputOptions = [], selectedOutput = Nothing, startDirection = East }
    , { signature = "eawae", internalName = "const/double/tau", action = makeConstant (Number (pi * 2)), displayName = "Circle's Reflection", outputOptions = [], selectedOutput = Nothing, startDirection = East }
    , { signature = "aaq", internalName = "const/double/e", action = makeConstant (Number e), displayName = "Euler's Reflection", outputOptions = [], selectedOutput = Nothing, startDirection = East }
    , { signature = "qqqqqdaqa", internalName = "get_entity", action = getEntity, displayName = "Entity Purification", outputOptions = [ EntityType, NullType ], selectedOutput = Just ( EntityType, Entity Unset ), startDirection = East }
    , { signature = "qqqqqdaqaawa", internalName = "get_entity/animal", action = getEntity, displayName = "Entity Purification: Animal", outputOptions = [ EntityType, NullType ], selectedOutput = Just ( EntityType, Entity Unset ), startDirection = East }
    , { signature = "qqqqqdaqaawq", internalName = "get_entity/monster", action = getEntity, displayName = "Entity Purification: Monster", outputOptions = [ EntityType, NullType ], selectedOutput = Just ( EntityType, Entity Unset ), startDirection = East }
    , { signature = "qqqqqdaqaaww", internalName = "get_entity/item", action = getEntity, displayName = "Entity Purification: Item", outputOptions = [ EntityType, NullType ], selectedOutput = Just ( EntityType, Entity Unset ), startDirection = East }
    , { signature = "qqqqqdaqaawe", internalName = "get_entity/player", action = getEntity, displayName = "Entity Purification: Player", outputOptions = [ EntityType, NullType ], selectedOutput = Just ( EntityType, Entity Unset ), startDirection = East }
    , { signature = "qqqqqdaqaawd", internalName = "get_entity/living", action = getEntity, displayName = "Entity Purification: Living", outputOptions = [ EntityType, NullType ], selectedOutput = Just ( EntityType, Entity Unset ), startDirection = East }
    , { signature = "qqqqqwded", internalName = "zone_entity", action = zoneEntity, displayName = "Zone Distillation: Any", outputOptions = [ IotaListType EntityType ], selectedOutput = Just ( IotaListType EntityType, IotaList Array.empty ), startDirection = East }
    , { signature = "qqqqqwdeddwa", internalName = "zone_entity/animal", action = zoneEntity, displayName = "Zone Distillation: Animal", outputOptions = [ IotaListType EntityType ], selectedOutput = Just ( IotaListType EntityType, IotaList Array.empty ), startDirection = East }
    , { signature = "eeeeewaqaawa", internalName = "zone_entity/not_animal", action = zoneEntity, displayName = "Zone Distillation: Non-Animal", outputOptions = [ IotaListType EntityType ], selectedOutput = Just ( IotaListType EntityType, IotaList Array.empty ), startDirection = East }
    , { signature = "qqqqqwdeddwq", internalName = "zone_entity/monster", action = zoneEntity, displayName = "Zone Distillation: Monster", outputOptions = [ IotaListType EntityType ], selectedOutput = Just ( IotaListType EntityType, IotaList Array.empty ), startDirection = East }
    , { signature = "eeeeewaqaawq", internalName = "zone_entity/not_monster", action = zoneEntity, displayName = "Zone Distillation: Non-Monster", outputOptions = [ IotaListType EntityType ], selectedOutput = Just ( IotaListType EntityType, IotaList Array.empty ), startDirection = East }
    , { signature = "qqqqqwdeddww", internalName = "zone_entity/item", action = zoneEntity, displayName = "Zone Distillation: Item", outputOptions = [ IotaListType EntityType ], selectedOutput = Just ( IotaListType EntityType, IotaList Array.empty ), startDirection = East }
    , { signature = "eeeeewaqaaww", internalName = "zone_entity/not_item", action = zoneEntity, displayName = "Zone Distillation: Non-Item", outputOptions = [ IotaListType EntityType ], selectedOutput = Just ( IotaListType EntityType, IotaList Array.empty ), startDirection = East }
    , { signature = "qqqqqwdeddwe", internalName = "zone_entity/player", action = zoneEntity, displayName = "Zone Distillation: Player", outputOptions = [ IotaListType EntityType ], selectedOutput = Just ( IotaListType EntityType, IotaList Array.empty ), startDirection = East }
    , { signature = "eeeeewaqaawe", internalName = "zone_entity/not_player", action = zoneEntity, displayName = "Zone Distillation: Non-Player", outputOptions = [ IotaListType EntityType ], selectedOutput = Just ( IotaListType EntityType, IotaList Array.empty ), startDirection = East }
    , { signature = "qqqqqwdeddwd", internalName = "zone_entity/living", action = zoneEntity, displayName = "Zone Distillation: Living", outputOptions = [ IotaListType EntityType ], selectedOutput = Just ( IotaListType EntityType, IotaList Array.empty ), startDirection = East }
    , { signature = "eeeeewaqaawd", internalName = "zone_entity/not_living", action = zoneEntity, displayName = "Zone Distillation: Non-Living", outputOptions = [ IotaListType EntityType ], selectedOutput = Just ( IotaListType EntityType, IotaList Array.empty ), startDirection = East }
    , { signature = "edqde", internalName = "append", action = append, displayName = "Integration Distillation", outputOptions = [], selectedOutput = Nothing, startDirection = East }
    , { signature = "qaeaq", internalName = "concat", action = concat, displayName = "Combination Distillation", outputOptions = [], selectedOutput = Nothing, startDirection = East }
    , { signature = "deeed", internalName = "index", action = index, displayName = "Selection Distillation", outputOptions = [], selectedOutput = Nothing, startDirection = East }
    , { signature = "aqaeaq", internalName = "list_size", action = listSize, displayName = "Abacus Purification", outputOptions = [], selectedOutput = Nothing, startDirection = East }
    , { signature = "adeeed", internalName = "singleton", action = singleton, displayName = "Single's Purification", outputOptions = [], selectedOutput = Nothing, startDirection = East }
    , { signature = "qqaeaae", internalName = "empty_list", action = makeConstant (IotaList Array.empty), displayName = "Vacant Reflection", outputOptions = [], selectedOutput = Nothing, startDirection = East }
    , { signature = "qqqaede", internalName = "reverse_list", action = reverseList, displayName = "Retrograde Purification", outputOptions = [], selectedOutput = Nothing, startDirection = East }
    , { signature = "ewdqdwe", internalName = "last_n_list", action = lastNList, displayName = "Flock's Gambit", outputOptions = [], selectedOutput = Nothing, startDirection = East }
    , { signature = "qwaeawq", internalName = "splat", action = splat, displayName = "Flock's Disintegration", outputOptions = [], selectedOutput = Nothing, startDirection = East }
    , { signature = "dedqde", internalName = "index_of", action = indexOf, displayName = "Locator's Distillation", outputOptions = [], selectedOutput = Nothing, startDirection = East }
    , { signature = "edqdewaqa", internalName = "list_remove", action = listRemove, displayName = "Excisor's Distillation", outputOptions = [], selectedOutput = Nothing, startDirection = East }
    , { signature = "qaeaqwded", internalName = "slice", action = slice, displayName = "Selection Exaltation", outputOptions = [], selectedOutput = Nothing, startDirection = East }
    , { signature = "wqaeaqw", internalName = "modify_in_place", action = modifyinPlace, displayName = "Surgeon's Exaltation", outputOptions = [], selectedOutput = Nothing, startDirection = East }
    , { signature = "ddewedd", internalName = "construct", action = construct, displayName = "Speaker's Distillation", outputOptions = [], selectedOutput = Nothing, startDirection = East }
    , { signature = "aaqwqaa", internalName = "deconstruct", action = deconstruct, displayName = "Speaker's Decomposition", outputOptions = [], selectedOutput = Nothing, startDirection = East }
    , { signature = "qqqaw", internalName = "escape", action = noAction, displayName = "Consideration", outputOptions = [], selectedOutput = Nothing, startDirection = West }
    , { signature = "qqq", internalName = "open_paren", action = makeConstant (OpenParenthesis Array.empty), displayName = "Introspection", outputOptions = [], selectedOutput = Nothing, startDirection = West }
    , { signature = "eee", internalName = "close_paren", action = noAction, displayName = "Retrospection", outputOptions = [], selectedOutput = Nothing, startDirection = East }
    , { signature = "deaqq", internalName = "eval", action = noAction, displayName = "Hermes' Gambit", outputOptions = [], selectedOutput = Nothing, startDirection = Southeast }
    , { signature = "dadad", internalName = "for_each", action = noAction, displayName = "Thoth's Gambit", outputOptions = [], selectedOutput = Nothing, startDirection = Northeast }
    , { signature = "awaawa", internalName = "save_macro", action = saveMacro, displayName = "Save Macro", outputOptions = [], selectedOutput = Nothing, startDirection = Southeast }
    ]
        |> List.map
            (\pattern ->
                { signature = pattern.signature
                , startDirection = pattern.startDirection
                , internalName = pattern.internalName
                , action = pattern.action
                , metaAction = None
                , displayName = pattern.displayName
                , outputOptions = pattern.outputOptions
                , selectedOutput = pattern.selectedOutput
                , color = accent1
                , active = True
                }
            )
        |> (++) metapatternRegistry


metapatternRegistry : List Pattern
metapatternRegistry =
    [ { signature = "qqqq", internalName = "clearPatterns", action = noAction, metaAction = ClearPatterns, displayName = "Clear", outputOptions = [], selectedOutput = Nothing }
    , { signature = "qqqqqa", internalName = "resetApp", action = noAction, metaAction = Reset, displayName = "Reset", outputOptions = [], selectedOutput = Nothing }
    , { signature = "qa", internalName = "backspace", action = noAction, metaAction = Backspace, displayName = "Backspace", outputOptions = [], selectedOutput = Nothing }
    , { signature = "qwqqqwq", internalName = "wrap", action = noAction, metaAction = Wrap, displayName = "Wrap", outputOptions = [], selectedOutput = Nothing }
    ]
        |> List.map
            (\pattern ->
                { signature = pattern.signature
                , internalName = pattern.internalName
                , action = pattern.action
                , metaAction = pattern.metaAction
                , displayName = pattern.displayName
                , outputOptions = pattern.outputOptions
                , selectedOutput = pattern.selectedOutput
                , color = accent1
                , active = True
                , startDirection = East
                }
            )


numberLiteralGenerator : String -> Bool -> Pattern
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
    , metaAction = None
    , displayName = "Numerical Reflection: " ++ String.fromFloat number
    , internalName = String.fromFloat number
    , color = accent1
    , outputOptions = []
    , selectedOutput = Nothing
    , active = True
    , startDirection = Southeast
    }
