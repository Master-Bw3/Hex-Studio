module Logic.App.Patterns.PatternRegistry exposing (getPatternFromName, getPatternFromSignature, numberLiteralGenerator, patternRegistry, unknownPattern)

import Array exposing (Array)
import Logic.App.Patterns.Circles exposing (..)
import Logic.App.Patterns.Math exposing (..)
import Logic.App.Patterns.Misc exposing (..)
import Logic.App.Patterns.OperatorUtils exposing (action1Input, getPatternOrPatternList, makeConstant)
import Logic.App.Patterns.Selectors exposing (..)
import Logic.App.Patterns.Stack exposing (..)
import Logic.App.Stack.Stack exposing (applyPatternToStack, applyPatternsToStack)
import Logic.App.Types exposing (Iota(..), Mishap(..), PatternType)
import Logic.App.Utils.Utils exposing (unshift)
import Ports.HexNumGen as HexNumGen
import Settings.Theme exposing (..)


noAction : Array Iota -> Array Iota
noAction stack =
    stack


unknownPattern : PatternType
unknownPattern =
    { signature = "", action = makeConstant (Garbage InvalidPattern), displayName = "Unknown Pattern", internalName = "", color = accent3 }


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
                { unknownPattern | signature = signature, displayName = "Pattern " ++ "\"" ++ signature ++ "\"" }


getPatternFromName : String -> ( PatternType, Cmd msg )
getPatternFromName name =
    case List.head <| List.filter (\regPattern -> regPattern.displayName == name || regPattern.internalName == name || regPattern.signature == name) patternRegistry of
        Just a ->
            ( a, Cmd.none )

        Nothing ->
            case String.toFloat name of
                Just number ->
                    ( unknownPattern, HexNumGen.call number )

                Nothing ->
                    ( unknownPattern, Cmd.none )


patternRegistry : List PatternType
patternRegistry =
    [ { signature = "wawawddew", internalName = "interop/gravity/get", action = noAction, displayName = "", color = accent1 }
    , { signature = "wdwdwaaqw", internalName = "interop/gravity/set", action = noAction, displayName = "", color = accent1 }
    , { signature = "aawawwawwa", internalName = "interop/pehkui/get", action = noAction, displayName = "", color = accent1 }
    , { signature = "ddwdwwdwwd", internalName = "interop/pehkui/set", action = noAction, displayName = "", color = accent1 }
    , { signature = "qaq", internalName = "get_caster", action = getCaster, displayName = "Mind's Reflection", color = accent1 }
    , { signature = "aa", internalName = "entity_pos/eye", action = entityPos, displayName = "Compass' Purification", color = accent1 }
    , { signature = "dd", internalName = "entity_pos/foot", action = entityPos, displayName = "Compass' Purification II", color = accent1 }
    , { signature = "wa", internalName = "get_entity_look", action = getEntityLook, displayName = "Alidade's Purification", color = accent1 }
    , { signature = "awq", internalName = "get_entity_height", action = getEntityHeight, displayName = "Stadiometer's Purification", color = accent1 }
    , { signature = "wq", internalName = "get_entity_velocity", action = getEntityVelocity, displayName = "Pace Purification", color = accent1 }
    , { signature = "wqaawdd", internalName = "raycast", action = raycast, displayName = "Archer's Distillation", color = accent1 }
    , { signature = "weddwaa", internalName = "raycast/axis", action = raycastAxis, displayName = "Architect's Distillation", color = accent1 }
    , { signature = "weaqa", internalName = "raycast/entity", action = raycastEntity, displayName = "Scout's Distillation", color = accent1 }
    , { signature = "eaqwqae", internalName = "circle/impetus_pos", action = noAction, displayName = "Waystone Reflection", color = accent1 }
    , { signature = "eaqwqaewede", internalName = "circle/impetus_dir", action = circleImpetusDirection, displayName = "Lodestone Reflection", color = accent1 }
    , { signature = "eaqwqaewdd", internalName = "circle/bounds/min", action = circleBoundsMin, displayName = "Lesser Fold Reflection", color = accent1 }
    , { signature = "aqwqawaaqa", internalName = "circle/bounds/max", action = circleBoundsMax, displayName = "Greater Fold Reflection", color = accent1 }
    , { signature = "aawdd", internalName = "swap", action = swap, displayName = "Jester's Gambit", color = accent1 }
    , { signature = "aaeaa", internalName = "rotate", action = rotate, displayName = "Rotation Gambit", color = accent1 }
    , { signature = "ddqdd", internalName = "rotate_reverse", action = rotateReverse, displayName = "Rotation Gambit II", color = accent1 }
    , { signature = "aadaa", internalName = "duplicate", action = duplicate, displayName = "Gemini Decomposition", color = accent1 }
    , { signature = "aaedd", internalName = "over", action = over, displayName = "Prospector's Gambit", color = accent1 }
    , { signature = "ddqaa", internalName = "tuck", action = tuck, displayName = "Undertaker's Gambit", color = accent1 }
    , { signature = "aadadaaw", internalName = "2dup", action = dup2, displayName = "Dioscuri Gambi", color = accent1 }
    , { signature = "qwaeawqaeaqa", internalName = "stack_len", action = stackLength, displayName = "Flock's Reflection", color = accent1 }
    , { signature = "aadaadaa", internalName = "duplicate_n", action = duplicateN, displayName = "Gemini Gambit", color = accent1 }
    , { signature = "ddad", internalName = "fisherman", action = fisherman, displayName = "Fisherman's Gambit", color = accent1 }
    , { signature = "aada", internalName = "fisherman/copy", action = fishermanCopy, displayName = "Fisherman's Gambit II", color = accent1 }
    , { signature = "qaawdde", internalName = "swizzle", action = noAction, displayName = "", color = accent1 }
    , { signature = "waaw", internalName = "add", action = add, displayName = "Additive Distillation", color = accent1 }
    , { signature = "wddw", internalName = "sub", action = subtract, displayName = "Subtractive Distillation", color = accent1 }
    , { signature = "waqaw", internalName = "mul_dot", action = mulDot, displayName = "Multiplicative Distillation", color = accent1 }
    , { signature = "wdedw", internalName = "div_cross", action = divCross, displayName = "Division Distillation", color = accent1 }
    , { signature = "wqaqw", internalName = "abs_len", action = noAction, displayName = "", color = accent1 }
    , { signature = "wedew", internalName = "pow_proj", action = noAction, displayName = "", color = accent1 }
    , { signature = "ewq", internalName = "floor", action = noAction, displayName = "", color = accent1 }
    , { signature = "qwe", internalName = "ceil", action = noAction, displayName = "", color = accent1 }
    , { signature = "eqqqqq", internalName = "construct_vec", action = noAction, displayName = "", color = accent1 }
    , { signature = "qeeeee", internalName = "deconstruct_vec", action = noAction, displayName = "", color = accent1 }
    , { signature = "qqqqqaww", internalName = "coerce_axial", action = noAction, displayName = "", color = accent1 }
    , { signature = "wdw", internalName = "and", action = noAction, displayName = "", color = accent1 }
    , { signature = "waw", internalName = "or", action = noAction, displayName = "", color = accent1 }
    , { signature = "dwa", internalName = "xor", action = noAction, displayName = "", color = accent1 }
    , { signature = "e", internalName = "greater", action = noAction, displayName = "", color = accent1 }
    , { signature = "q", internalName = "less", action = noAction, displayName = "", color = accent1 }
    , { signature = "ee", internalName = "greater_eq", action = noAction, displayName = "", color = accent1 }
    , { signature = "qq", internalName = "less_eq", action = noAction, displayName = "", color = accent1 }
    , { signature = "ad", internalName = "equals", action = noAction, displayName = "", color = accent1 }
    , { signature = "da", internalName = "not_equals", action = noAction, displayName = "", color = accent1 }
    , { signature = "dw", internalName = "not", action = noAction, displayName = "", color = accent1 }
    , { signature = "aw", internalName = "bool_coerce", action = noAction, displayName = "", color = accent1 }
    , { signature = "awdd", internalName = "if", action = noAction, displayName = "", color = accent1 }
    , { signature = "eqqq", internalName = "random", action = noAction, displayName = "", color = accent1 }
    , { signature = "qqqqqaa", internalName = "sin", action = noAction, displayName = "", color = accent1 }
    , { signature = "qqqqqad", internalName = "cos", action = noAction, displayName = "", color = accent1 }
    , { signature = "wqqqqqadq", internalName = "tan", action = noAction, displayName = "", color = accent1 }
    , { signature = "ddeeeee", internalName = "arcsin", action = noAction, displayName = "", color = accent1 }
    , { signature = "adeeeee", internalName = "arccos", action = noAction, displayName = "", color = accent1 }
    , { signature = "eadeeeeew", internalName = "arctan", action = noAction, displayName = "", color = accent1 }
    , { signature = "eqaqe", internalName = "logarithm", action = noAction, displayName = "", color = accent1 }
    , { signature = "addwaad", internalName = "modulo", action = noAction, displayName = "", color = accent1 }
    , { signature = "wdweaqa", internalName = "and_bit", action = noAction, displayName = "", color = accent1 }
    , { signature = "waweaqa", internalName = "or_bit", action = noAction, displayName = "", color = accent1 }
    , { signature = "dwaeaqa", internalName = "xor_bit", action = noAction, displayName = "", color = accent1 }
    , { signature = "dweaqa", internalName = "not_bit", action = noAction, displayName = "", color = accent1 }
    , { signature = "aweaqa", internalName = "to_set", action = noAction, displayName = "", color = accent1 }
    , { signature = "de", internalName = "print", action = noAction, displayName = "", color = accent1 }
    , { signature = "aawaawaa", internalName = "explode", action = noAction, displayName = "", color = accent1 }
    , { signature = "ddwddwdd", internalName = "explode/fire", action = noAction, displayName = "", color = accent1 }
    , { signature = "awqqqwaqw", internalName = "add_motion", action = noAction, displayName = "", color = accent1 }
    , { signature = "awqqqwaq", internalName = "blink", action = noAction, displayName = "", color = accent1 }
    , { signature = "qaqqqqq", internalName = "break_block", action = noAction, displayName = "", color = accent1 }
    , { signature = "eeeeede", internalName = "place_block", action = noAction, displayName = "", color = accent1 }
    , { signature = "awddwqawqwawq", internalName = "colorize", action = noAction, displayName = "", color = accent1 }
    , { signature = "aqawqadaq", internalName = "create_water", action = noAction, displayName = "", color = accent1 }
    , { signature = "dedwedade", internalName = "destroy_water", action = noAction, displayName = "", color = accent1 }
    , { signature = "aaqawawa", internalName = "ignite", action = noAction, displayName = "", color = accent1 }
    , { signature = "ddedwdwd", internalName = "extinguish", action = noAction, displayName = "", color = accent1 }
    , { signature = "qqa", internalName = "conjure_block", action = noAction, displayName = "", color = accent1 }
    , { signature = "qqd", internalName = "conjure_light", action = noAction, displayName = "", color = accent1 }
    , { signature = "wqaqwawqaqw", internalName = "bonemeal", action = noAction, displayName = "", color = accent1 }
    , { signature = "qqqqqwaeaeaeaeaea", internalName = "recharge", action = noAction, displayName = "", color = accent1 }
    , { signature = "qdqawwaww", internalName = "erase", action = noAction, displayName = "", color = accent1 }
    , { signature = "wqaqwd", internalName = "edify", action = noAction, displayName = "", color = accent1 }
    , { signature = "adaa", internalName = "beep", action = noAction, displayName = "", color = accent1 }
    , { signature = "waqqqqq", internalName = "craft/cypher", action = noAction, displayName = "", color = accent1 }
    , { signature = "wwaqqqqqeaqeaeqqqeaeq", internalName = "craft/trinket", action = noAction, displayName = "", color = accent1 }
    , { signature = "wwaqqqqqeawqwqwqwqwqwwqqeadaeqqeqqeadaeqq", internalName = "craft/artifact", action = noAction, displayName = "", color = accent1 }
    , { signature = "qqqqqaqwawaw", internalName = "potion/weakness", action = noAction, displayName = "", color = accent1 }
    , { signature = "qqqqqawwawawd", internalName = "potion/levitation", action = noAction, displayName = "", color = accent1 }
    , { signature = "qqqqqaewawawe", internalName = "potion/wither", action = noAction, displayName = "", color = accent1 }
    , { signature = "qqqqqadwawaww", internalName = "potion/poison", action = noAction, displayName = "", color = accent1 }
    , { signature = "qqqqqadwawaw", internalName = "potion/slowness", action = noAction, displayName = "", color = accent1 }
    , { signature = "waeawae", internalName = "sentinel/create", action = noAction, displayName = "", color = accent1 }
    , { signature = "qdwdqdw", internalName = "sentinel/destroy", action = noAction, displayName = "", color = accent1 }
    , { signature = "waeawaede", internalName = "sentinel/get_pos", action = noAction, displayName = "", color = accent1 }
    , { signature = "waeawaedwa", internalName = "sentinel/wayfind", action = noAction, displayName = "", color = accent1 }
    , { signature = "qqqwqqqqqaq", internalName = "akashic/read", action = noAction, displayName = "", color = accent1 }
    , { signature = "eeeweeeeede", internalName = "akashic/write", action = noAction, displayName = "", color = accent1 }
    , { signature = "aqdee", internalName = "halt", action = noAction, displayName = "", color = accent1 }
    , { signature = "aqqqqq", internalName = "read", action = noAction, displayName = "", color = accent1 }
    , { signature = "wawqwqwqwqwqw", internalName = "read/entity", action = noAction, displayName = "", color = accent1 }
    , { signature = "deeeee", internalName = "write", action = noAction, displayName = "", color = accent1 }
    , { signature = "wdwewewewewew", internalName = "write/entity", action = noAction, displayName = "", color = accent1 }
    , { signature = "aqqqqqe", internalName = "readable", action = noAction, displayName = "", color = accent1 }
    , { signature = "wawqwqwqwqwqwew", internalName = "readable/entity", action = noAction, displayName = "", color = accent1 }
    , { signature = "deeeeeq", internalName = "writable", action = noAction, displayName = "", color = accent1 }
    , { signature = "wdwewewewewewqw", internalName = "writable/entity", action = noAction, displayName = "", color = accent1 }
    , { signature = "qeewdweddw", internalName = "read/local", action = noAction, displayName = "", color = accent1 }
    , { signature = "eqqwawqaaw", internalName = "write/local", action = noAction, displayName = "", color = accent1 }
    , { signature = "d", internalName = "const/null", action = makeConstant Null, displayName = "Nullary Reflection", color = accent1 }
    , { signature = "aqae", internalName = "const/true", action = makeConstant (Boolean True), displayName = "True Reflection", color = accent1 }
    , { signature = "dedq", internalName = "const/false", action = makeConstant (Boolean False), displayName = "False Reflection", color = accent1 }
    , { signature = "qqqqqea", internalName = "const/vec/px", action = makeConstant (Vector ( 1, 0, 0 )), displayName = "Vector Reflection +X", color = accent1 }
    , { signature = "qqqqqew", internalName = "const/vec/py", action = makeConstant (Vector ( 0, 1, 0 )), displayName = "Vector Reflection +Y", color = accent1 }
    , { signature = "qqqqqed", internalName = "const/vec/pz", action = makeConstant (Vector ( 0, 0, 1 )), displayName = "Vector Reflection +Z", color = accent1 }
    , { signature = "eeeeeqa", internalName = "const/vec/nx", action = makeConstant (Vector ( -1, 0, 0 )), displayName = "Vector Reflection -X", color = accent1 }
    , { signature = "eeeeeqw", internalName = "const/vec/ny", action = makeConstant (Vector ( 0, -1, 0 )), displayName = "Vector Reflection -Y", color = accent1 }
    , { signature = "eeeeeqd", internalName = "const/vec/nz", action = makeConstant (Vector ( 0, 0, -1 )), displayName = "Vector Reflection -Z", color = accent1 }
    , { signature = "qqqqq", internalName = "const/vec/0", action = makeConstant (Vector ( 0, 0, 0 )), displayName = "Vector Reflection Zero", color = accent1 }
    , { signature = "qdwdq", internalName = "const/double/pi", action = makeConstant (Number pi), displayName = "Arc's Reflection", color = accent1 }
    , { signature = "eawae", internalName = "const/double/tau", action = makeConstant (Number (pi * 2)), displayName = "Euler's Reflection", color = accent1 }
    , { signature = "aaq", internalName = "const/double/e", action = makeConstant (Number e), displayName = "Numerical Reflection", color = accent1 }
    , { signature = "qqqqqdaqa", internalName = "get_entity", action = noAction, displayName = "", color = accent1 }
    , { signature = "qqqqqdaqaawa", internalName = "get_entity/animal", action = noAction, displayName = "", color = accent1 }
    , { signature = "qqqqqdaqaawq", internalName = "get_entity/monster", action = noAction, displayName = "", color = accent1 }
    , { signature = "qqqqqdaqaaww", internalName = "get_entity/item", action = noAction, displayName = "", color = accent1 }
    , { signature = "qqqqqdaqaawe", internalName = "get_entity/player", action = noAction, displayName = "", color = accent1 }
    , { signature = "qqqqqdaqaawd", internalName = "get_entity/living", action = noAction, displayName = "", color = accent1 }
    , { signature = "qqqqqwded", internalName = "zone_entity", action = noAction, displayName = "", color = accent1 }
    , { signature = "qqqqqwdeddwa", internalName = "zone_entity/animal", action = noAction, displayName = "", color = accent1 }
    , { signature = "eeeeewaqaawa", internalName = "zone_entity/not_animal", action = noAction, displayName = "", color = accent1 }
    , { signature = "qqqqqwdeddwq", internalName = "zone_entity/monster", action = noAction, displayName = "", color = accent1 }
    , { signature = "eeeeewaqaawq", internalName = "zone_entity/not_monster", action = noAction, displayName = "", color = accent1 }
    , { signature = "qqqqqwdeddww", internalName = "zone_entity/item", action = noAction, displayName = "", color = accent1 }
    , { signature = "eeeeewaqaaww", internalName = "zone_entity/not_item", action = noAction, displayName = "", color = accent1 }
    , { signature = "qqqqqwdeddwe", internalName = "zone_entity/player", action = noAction, displayName = "", color = accent1 }
    , { signature = "eeeeewaqaawe", internalName = "zone_entity/not_player", action = noAction, displayName = "", color = accent1 }
    , { signature = "qqqqqwdeddwd", internalName = "zone_entity/living", action = noAction, displayName = "", color = accent1 }
    , { signature = "eeeeewaqaawd", internalName = "zone_entity/not_living", action = noAction, displayName = "", color = accent1 }
    , { signature = "edqde", internalName = "append", action = noAction, displayName = "", color = accent1 }
    , { signature = "qaeaq", internalName = "concat", action = noAction, displayName = "", color = accent1 }
    , { signature = "deeed", internalName = "index", action = noAction, displayName = "", color = accent1 }
    , { signature = "dadad", internalName = "for_each", action = noAction, displayName = "", color = accent1 }
    , { signature = "aqaeaq", internalName = "list_size", action = noAction, displayName = "", color = accent1 }
    , { signature = "adeeed", internalName = "singleton", action = noAction, displayName = "", color = accent1 }
    , { signature = "qqaeaae", internalName = "empty_list", action = noAction, displayName = "", color = accent1 }
    , { signature = "qqqaede", internalName = "reverse_list", action = noAction, displayName = "", color = accent1 }
    , { signature = "ewdqdwe", internalName = "last_n_list", action = noAction, displayName = "", color = accent1 }
    , { signature = "qwaeawq", internalName = "splat", action = noAction, displayName = "", color = accent1 }
    , { signature = "dedqde", internalName = "index_of", action = noAction, displayName = "", color = accent1 }
    , { signature = "edqdewaqa", internalName = "list_remove", action = noAction, displayName = "", color = accent1 }
    , { signature = "qaeaqwded", internalName = "slice", action = noAction, displayName = "", color = accent1 }
    , { signature = "wqaeaqw", internalName = "modify_in_place", action = noAction, displayName = "", color = accent1 }
    , { signature = "ddewedd", internalName = "construct", action = noAction, displayName = "", color = accent1 }
    , { signature = "aaqwqaa", internalName = "deconstruct", action = noAction, displayName = "", color = accent1 }
    , { signature = "qqqaw", internalName = "escape", action = noAction, displayName = "Consideration", color = accent1 }
    , { signature = "qqq", internalName = "open_paren", action = makeConstant (OpenParenthesis Array.empty), displayName = "Introspection", color = accent1 }
    , { signature = "eee", internalName = "close_paren", action = noAction, displayName = "Retrospection", color = accent1 }
    , { signature = "deaqq", internalName = "eval", action = eval, displayName = "Hermes' Gambit", color = accent1 }
    ]


eval : Array Iota -> Array Iota
eval stack =
    let
        maybeIota =
            Array.get 0 stack

        newStack =
            Array.slice 1 (Array.length stack) stack
    in
    case maybeIota of
        Nothing ->
            unshift (Garbage NotEnoughIotas) newStack

        Just iota ->
            case getPatternOrPatternList <| iota of
                Garbage IncorrectIota ->
                    unshift (Garbage IncorrectIota) newStack

                _ ->
                    case iota of
                        IotaList list ->
                            applyPatternsToStack newStack
                                (List.reverse <|
                                    Array.toList <|
                                        Array.map
                                            (\i ->
                                                case i of
                                                    Pattern pattern ->
                                                        pattern

                                                    _ ->
                                                        unknownPattern
                                            )
                                            list
                                )
                                False

                        Pattern pattern ->
                            applyPatternsToStack newStack [ pattern ] False

                        _ ->
                            Array.fromList [ Garbage CatastrophicFailure ]


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
    }
