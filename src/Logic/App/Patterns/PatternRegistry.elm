module Logic.App.Patterns.PatternRegistry exposing (patternRegistry, unknownPattern)

import Array exposing (Array)
import Logic.App.Patterns.Misc exposing (entityPos, raycast)
import Logic.App.Patterns.OperatorUtils exposing (makeConstant)
import Logic.App.Patterns.Selectors exposing (getCaster)
import Logic.App.Types exposing (Iota(..), PatternType)


test : Array Iota -> Array Iota
test stack =
    stack


unknownPattern : PatternType
unknownPattern =
    { signature = "", action = test, displayName = "", internalName = "OwO whats this" }


patternRegistry : List PatternType
patternRegistry =
    [ { signature = "wawawddew", internalName = "interop/gravity/get", action = test, displayName = "" }
    , { signature = "wdwdwaaqw", internalName = "interop/gravity/set", action = test, displayName = "" }
    , { signature = "aawawwawwa", internalName = "interop/pehkui/get", action = test, displayName = "" }
    , { signature = "ddwdwwdwwd", internalName = "interop/pehkui/set", action = test, displayName = "" }
    , { signature = "qaq", internalName = "get_caster", action = getCaster, displayName = "Mind's Reflection" }
    , { signature = "aa", internalName = "entity_pos/eye", action = entityPos, displayName = "Compass' Purification" }
    , { signature = "dd", internalName = "entity_pos/foot", action = entityPos, displayName = "Compass' Purification II" }
    , { signature = "wa", internalName = "get_entity_look", action = test, displayName = "" }
    , { signature = "awq", internalName = "get_entity_height", action = test, displayName = "" }
    , { signature = "wq", internalName = "get_entity_velocity", action = test, displayName = "" }
    , { signature = "wqaawdd", internalName = "raycast", action = raycast, displayName = "Archer's Distillation" }
    , { signature = "weddwaa", internalName = "raycast/axis", action = test, displayName = "" }
    , { signature = "weaqa", internalName = "raycast/entity", action = test, displayName = "" }
    , { signature = "eaqwqae", internalName = "circle/impetus_pos", action = test, displayName = "" }
    , { signature = "eaqwqaewede", internalName = "circle/impetus_dir", action = test, displayName = "" }
    , { signature = "eaqwqaewdd", internalName = "circle/bounds/min", action = test, displayName = "" }
    , { signature = "aqwqawaaqa", internalName = "circle/bounds/max", action = test, displayName = "" }
    , { signature = "aawdd", internalName = "swap", action = test, displayName = "" }
    , { signature = "aaeaa", internalName = "rotate", action = test, displayName = "" }
    , { signature = "ddqdd", internalName = "rotate_reverse", action = test, displayName = "" }
    , { signature = "aadaa", internalName = "duplicate", action = test, displayName = "" }
    , { signature = "aaedd", internalName = "over", action = test, displayName = "" }
    , { signature = "ddqaa", internalName = "tuck", action = test, displayName = "" }
    , { signature = "aadadaaw", internalName = "2dup", action = test, displayName = "" }
    , { signature = "qwaeawqaeaqa", internalName = "stack_len", action = test, displayName = "" }
    , { signature = "aadaadaa", internalName = "duplicate_n", action = test, displayName = "" }
    , { signature = "ddad", internalName = "fisherman", action = test, displayName = "" }
    , { signature = "aada", internalName = "fisherman/copy", action = test, displayName = "" }
    , { signature = "qaawdde", internalName = "swizzle", action = test, displayName = "" }
    , { signature = "waaw", internalName = "add", action = test, displayName = "" }
    , { signature = "wddw", internalName = "sub", action = test, displayName = "" }
    , { signature = "waqaw", internalName = "mul_dot", action = test, displayName = "" }
    , { signature = "wdedw", internalName = "div_cross", action = test, displayName = "" }
    , { signature = "wqaqw", internalName = "abs_len", action = test, displayName = "" }
    , { signature = "wedew", internalName = "pow_proj", action = test, displayName = "" }
    , { signature = "ewq", internalName = "floor", action = test, displayName = "" }
    , { signature = "qwe", internalName = "ceil", action = test, displayName = "" }
    , { signature = "eqqqqq", internalName = "construct_vec", action = test, displayName = "" }
    , { signature = "qeeeee", internalName = "deconstruct_vec", action = test, displayName = "" }
    , { signature = "qqqqqaww", internalName = "coerce_axial", action = test, displayName = "" }
    , { signature = "wdw", internalName = "and", action = test, displayName = "" }
    , { signature = "waw", internalName = "or", action = test, displayName = "" }
    , { signature = "dwa", internalName = "xor", action = test, displayName = "" }
    , { signature = "e", internalName = "greater", action = test, displayName = "" }
    , { signature = "q", internalName = "less", action = test, displayName = "" }
    , { signature = "ee", internalName = "greater_eq", action = test, displayName = "" }
    , { signature = "qq", internalName = "less_eq", action = test, displayName = "" }
    , { signature = "ad", internalName = "equals", action = test, displayName = "" }
    , { signature = "da", internalName = "not_equals", action = test, displayName = "" }
    , { signature = "dw", internalName = "not", action = test, displayName = "" }
    , { signature = "aw", internalName = "bool_coerce", action = test, displayName = "" }
    , { signature = "awdd", internalName = "if", action = test, displayName = "" }
    , { signature = "eqqq", internalName = "random", action = test, displayName = "" }
    , { signature = "qqqqqaa", internalName = "sin", action = test, displayName = "" }
    , { signature = "qqqqqad", internalName = "cos", action = test, displayName = "" }
    , { signature = "wqqqqqadq", internalName = "tan", action = test, displayName = "" }
    , { signature = "ddeeeee", internalName = "arcsin", action = test, displayName = "" }
    , { signature = "adeeeee", internalName = "arccos", action = test, displayName = "" }
    , { signature = "eadeeeeew", internalName = "arctan", action = test, displayName = "" }
    , { signature = "eqaqe", internalName = "logarithm", action = test, displayName = "" }
    , { signature = "addwaad", internalName = "modulo", action = test, displayName = "" }
    , { signature = "wdweaqa", internalName = "and_bit", action = test, displayName = "" }
    , { signature = "waweaqa", internalName = "or_bit", action = test, displayName = "" }
    , { signature = "dwaeaqa", internalName = "xor_bit", action = test, displayName = "" }
    , { signature = "dweaqa", internalName = "not_bit", action = test, displayName = "" }
    , { signature = "aweaqa", internalName = "to_set", action = test, displayName = "" }
    , { signature = "de", internalName = "print", action = test, displayName = "" }
    , { signature = "aawaawaa", internalName = "explode", action = test, displayName = "" }
    , { signature = "ddwddwdd", internalName = "explode/fire", action = test, displayName = "" }
    , { signature = "awqqqwaqw", internalName = "add_motion", action = test, displayName = "" }
    , { signature = "awqqqwaq", internalName = "blink", action = test, displayName = "" }
    , { signature = "qaqqqqq", internalName = "break_block", action = test, displayName = "" }
    , { signature = "eeeeede", internalName = "place_block", action = test, displayName = "" }
    , { signature = "awddwqawqwawq", internalName = "colorize", action = test, displayName = "" }
    , { signature = "aqawqadaq", internalName = "create_water", action = test, displayName = "" }
    , { signature = "dedwedade", internalName = "destroy_water", action = test, displayName = "" }
    , { signature = "aaqawawa", internalName = "ignite", action = test, displayName = "" }
    , { signature = "ddedwdwd", internalName = "extinguish", action = test, displayName = "" }
    , { signature = "qqa", internalName = "conjure_block", action = test, displayName = "" }
    , { signature = "qqd", internalName = "conjure_light", action = test, displayName = "" }
    , { signature = "wqaqwawqaqw", internalName = "bonemeal", action = test, displayName = "" }
    , { signature = "qqqqqwaeaeaeaeaea", internalName = "recharge", action = test, displayName = "" }
    , { signature = "qdqawwaww", internalName = "erase", action = test, displayName = "" }
    , { signature = "wqaqwd", internalName = "edify", action = test, displayName = "" }
    , { signature = "adaa", internalName = "beep", action = test, displayName = "" }
    , { signature = "waqqqqq", internalName = "craft/cypher", action = test, displayName = "" }
    , { signature = "wwaqqqqqeaqeaeqqqeaeq", internalName = "craft/trinket", action = test, displayName = "" }
    , { signature = "wwaqqqqqeawqwqwqwqwqwwqqeadaeqqeqqeadaeqq", internalName = "craft/artifact", action = test, displayName = "" }
    , { signature = "qqqqqaqwawaw", internalName = "potion/weakness", action = test, displayName = "" }
    , { signature = "qqqqqawwawawd", internalName = "potion/levitation", action = test, displayName = "" }
    , { signature = "qqqqqaewawawe", internalName = "potion/wither", action = test, displayName = "" }
    , { signature = "qqqqqadwawaww", internalName = "potion/poison", action = test, displayName = "" }
    , { signature = "qqqqqadwawaw", internalName = "potion/slowness", action = test, displayName = "" }
    , { signature = "waeawae", internalName = "sentinel/create", action = test, displayName = "" }
    , { signature = "qdwdqdw", internalName = "sentinel/destroy", action = test, displayName = "" }
    , { signature = "waeawaede", internalName = "sentinel/get_pos", action = test, displayName = "" }
    , { signature = "waeawaedwa", internalName = "sentinel/wayfind", action = test, displayName = "" }
    , { signature = "qqqwqqqqqaq", internalName = "akashic/read", action = test, displayName = "" }
    , { signature = "eeeweeeeede", internalName = "akashic/write", action = test, displayName = "" }
    , { signature = "deaqq", internalName = "eval", action = test, displayName = "" }
    , { signature = "aqdee", internalName = "halt", action = test, displayName = "" }
    , { signature = "aqqqqq", internalName = "read", action = test, displayName = "" }
    , { signature = "wawqwqwqwqwqw", internalName = "read/entity", action = test, displayName = "" }
    , { signature = "deeeee", internalName = "write", action = test, displayName = "" }
    , { signature = "wdwewewewewew", internalName = "write/entity", action = test, displayName = "" }
    , { signature = "aqqqqqe", internalName = "readable", action = test, displayName = "" }
    , { signature = "wawqwqwqwqwqwew", internalName = "readable/entity", action = test, displayName = "" }
    , { signature = "deeeeeq", internalName = "writable", action = test, displayName = "" }
    , { signature = "wdwewewewewewqw", internalName = "writable/entity", action = test, displayName = "" }
    , { signature = "qeewdweddw", internalName = "read/local", action = test, displayName = "" }
    , { signature = "eqqwawqaaw", internalName = "write/local", action = test, displayName = "" }
    , { signature = "d", internalName = "const/null", action = makeConstant Null, displayName = "" }
    , { signature = "aqae", internalName = "const/true", action = makeConstant (Boolean True), displayName = "" }
    , { signature = "dedq", internalName = "const/false", action = makeConstant (Boolean False), displayName = "" }
    , { signature = "qqqqqea", internalName = "const/vec/px", action = test, displayName = "" }
    , { signature = "qqqqqew", internalName = "const/vec/py", action = test, displayName = "" }
    , { signature = "qqqqqed", internalName = "const/vec/pz", action = test, displayName = "" }
    , { signature = "eeeeeqa", internalName = "const/vec/nx", action = test, displayName = "" }
    , { signature = "eeeeeqw", internalName = "const/vec/ny", action = test, displayName = "" }
    , { signature = "eeeeeqd", internalName = "const/vec/nz", action = test, displayName = "" }
    , { signature = "qqqqq", internalName = "const/vec/0", action = makeConstant (Vector ( 0, 0, 0 )), displayName = "" }
    , { signature = "qdwdq", internalName = "const/double/pi", action = test, displayName = "" }
    , { signature = "eawae", internalName = "const/double/tau", action = test, displayName = "" }
    , { signature = "aaq", internalName = "const/double/e", action = test, displayName = "" }
    , { signature = "qqqqqdaqa", internalName = "get_entity", action = test, displayName = "" }
    , { signature = "qqqqqdaqaawa", internalName = "get_entity/animal", action = test, displayName = "" }
    , { signature = "qqqqqdaqaawq", internalName = "get_entity/monster", action = test, displayName = "" }
    , { signature = "qqqqqdaqaaww", internalName = "get_entity/item", action = test, displayName = "" }
    , { signature = "qqqqqdaqaawe", internalName = "get_entity/player", action = test, displayName = "" }
    , { signature = "qqqqqdaqaawd", internalName = "get_entity/living", action = test, displayName = "" }
    , { signature = "qqqqqwded", internalName = "zone_entity", action = test, displayName = "" }
    , { signature = "qqqqqwdeddwa", internalName = "zone_entity/animal", action = test, displayName = "" }
    , { signature = "eeeeewaqaawa", internalName = "zone_entity/not_animal", action = test, displayName = "" }
    , { signature = "qqqqqwdeddwq", internalName = "zone_entity/monster", action = test, displayName = "" }
    , { signature = "eeeeewaqaawq", internalName = "zone_entity/not_monster", action = test, displayName = "" }
    , { signature = "qqqqqwdeddww", internalName = "zone_entity/item", action = test, displayName = "" }
    , { signature = "eeeeewaqaaww", internalName = "zone_entity/not_item", action = test, displayName = "" }
    , { signature = "qqqqqwdeddwe", internalName = "zone_entity/player", action = test, displayName = "" }
    , { signature = "eeeeewaqaawe", internalName = "zone_entity/not_player", action = test, displayName = "" }
    , { signature = "qqqqqwdeddwd", internalName = "zone_entity/living", action = test, displayName = "" }
    , { signature = "eeeeewaqaawd", internalName = "zone_entity/not_living", action = test, displayName = "" }
    , { signature = "edqde", internalName = "append", action = test, displayName = "" }
    , { signature = "qaeaq", internalName = "concat", action = test, displayName = "" }
    , { signature = "deeed", internalName = "index", action = test, displayName = "" }
    , { signature = "dadad", internalName = "for_each", action = test, displayName = "" }
    , { signature = "aqaeaq", internalName = "list_size", action = test, displayName = "" }
    , { signature = "adeeed", internalName = "singleton", action = test, displayName = "" }
    , { signature = "qqaeaae", internalName = "empty_list", action = test, displayName = "" }
    , { signature = "qqqaede", internalName = "reverse_list", action = test, displayName = "" }
    , { signature = "ewdqdwe", internalName = "last_n_list", action = test, displayName = "" }
    , { signature = "qwaeawq", internalName = "splat", action = test, displayName = "" }
    , { signature = "dedqde", internalName = "index_of", action = test, displayName = "" }
    , { signature = "edqdewaqa", internalName = "list_remove", action = test, displayName = "" }
    , { signature = "qaeaqwded", internalName = "slice", action = test, displayName = "" }
    , { signature = "wqaeaqw", internalName = "modify_in_place", action = test, displayName = "" }
    , { signature = "ddewedd", internalName = "construct", action = test, displayName = "" }
    , { signature = "aaqwqaa", internalName = "deconstruct", action = test, displayName = "" }
    ]
