module Logic.App.PatternRegistry exposing (patternRegistry, tempPattern)

import Logic.App.Types exposing (Iota, PatternType)


test : List Iota -> List Iota
test stack =
    stack

tempPattern = { signature = "wawawddew", action = test, displayName = "", internalName = "interop/gravity/get" }

patternRegistry : List PatternType
patternRegistry =
    [ { signature = "wawawddew", action = test, displayName = "", internalName = "interop/gravity/get" }
    , { signature = "wdwdwaaqw", action = test, displayName = "", internalName = "interop/gravity/set" }
    , { signature = "aawawwawwa", action = test, displayName = "", internalName = "interop/pehkui/get" }
    , { signature = "ddwdwwdwwd", action = test, displayName = "", internalName = "interop/pehkui/set" }
    , { signature = "qaq", action = test, displayName = "", internalName = "get_caster" }
    , { signature = "aa", action = test, displayName = "", internalName = "get_entity_pos" }
    , { signature = "wa", action = test, displayName = "", internalName = "get_entity_look" }
    , { signature = "awq", action = test, displayName = "", internalName = "get_entity_height" }
    , { signature = "wq", action = test, displayName = "", internalName = "get_entity_velocity" }
    , { signature = "wqaawdd", action = test, displayName = "", internalName = "raycast" }
    , { signature = "weddwaa", action = test, displayName = "", internalName = "raycast/axis" }
    , { signature = "weaqa", action = test, displayName = "", internalName = "raycast/entity" }
    , { signature = "eaqwqae", action = test, displayName = "", internalName = "circle/impetus_pos" }
    , { signature = "eaqwqaewede", action = test, displayName = "", internalName = "circle/impetus_dir" }
    , { signature = "eaqwqaewdd", action = test, displayName = "", internalName = "circle/bounds/min" }
    , { signature = "aqwqawaaqa", action = test, displayName = "", internalName = "circle/bounds/max" }
    , { signature = "aadaa", action = test, displayName = "", internalName = "duplicate" }
    , { signature = "aadaadaa", action = test, displayName = "", internalName = "duplicate_n" }
    , { signature = "qwaeawqaeaqa", action = test, displayName = "", internalName = "stack_len" }
    , { signature = "aawdd", action = test, displayName = "", internalName = "swap" }
    , { signature = "ddad", action = test, displayName = "", internalName = "fisherman" }
    , { signature = "qaawdde", action = test, displayName = "", internalName = "swizzle" }
    , { signature = "waaw", action = test, displayName = "", internalName = "add" }
    , { signature = "wddw", action = test, displayName = "", internalName = "sub" }
    , { signature = "waqaw", action = test, displayName = "", internalName = "mul_dot" }
    , { signature = "wdedw", action = test, displayName = "", internalName = "div_cross" }
    , { signature = "wqaqw", action = test, displayName = "", internalName = "abs_len" }
    , { signature = "wedew", action = test, displayName = "", internalName = "pow_proj" }
    , { signature = "ewq", action = test, displayName = "", internalName = "floor" }
    , { signature = "qwe", action = test, displayName = "", internalName = "ceil" }
    , { signature = "eqqqqq", action = test, displayName = "", internalName = "construct_vec" }
    , { signature = "qeeeee", action = test, displayName = "", internalName = "deconstruct_vec" }
    , { signature = "qqqqqaww", action = test, displayName = "", internalName = "coerce_axial" }
    , { signature = "wdw", action = test, displayName = "", internalName = "and" }
    , { signature = "waw", action = test, displayName = "", internalName = "or" }
    , { signature = "dwa", action = test, displayName = "", internalName = "xor" }
    , { signature = "e", action = test, displayName = "", internalName = "greater" }
    , { signature = "q", action = test, displayName = "", internalName = "less" }
    , { signature = "ee", action = test, displayName = "", internalName = "greater_eq" }
    , { signature = "qq", action = test, displayName = "", internalName = "less_eq" }
    , { signature = "ad", action = test, displayName = "", internalName = "equals" }
    , { signature = "da", action = test, displayName = "", internalName = "not_equals" }
    , { signature = "dw", action = test, displayName = "", internalName = "not" }
    , { signature = "aw", action = test, displayName = "", internalName = "identity" }
    , { signature = "eqqq", action = test, displayName = "", internalName = "random" }
    , { signature = "qqqqqaa", action = test, displayName = "", internalName = "sin" }
    , { signature = "qqqqqad", action = test, displayName = "", internalName = "cos" }
    , { signature = "wqqqqqadq", action = test, displayName = "", internalName = "tan" }
    , { signature = "ddeeeee", action = test, displayName = "", internalName = "arcsin" }
    , { signature = "adeeeee", action = test, displayName = "", internalName = "arccos" }
    , { signature = "eadeeeeew", action = test, displayName = "", internalName = "arctan" }
    , { signature = "eqaqe", action = test, displayName = "", internalName = "logarithm" }
    , { signature = "addwaad", action = test, displayName = "", internalName = "modulo" }
    , { signature = "wdweaqa", action = test, displayName = "", internalName = "and_bit" }
    , { signature = "waweaqa", action = test, displayName = "", internalName = "or_bit" }
    , { signature = "dwaeaqa", action = test, displayName = "", internalName = "xor_bit" }
    , { signature = "dweaqa", action = test, displayName = "", internalName = "not_bit" }
    , { signature = "aweaqa", action = test, displayName = "", internalName = "to_set" }
    , { signature = "de", action = test, displayName = "", internalName = "print" }
    , { signature = "aawaawaa", action = test, displayName = "", internalName = "explode" }
    , { signature = "ddwddwdd", action = test, displayName = "", internalName = "explode/fire" }
    , { signature = "awqqqwaqw", action = test, displayName = "", internalName = "add_motion" }
    , { signature = "awqqqwaq", action = test, displayName = "", internalName = "blink" }
    , { signature = "qaqqqqq", action = test, displayName = "", internalName = "break_block" }
    , { signature = "eeeeede", action = test, displayName = "", internalName = "place_block" }
    , { signature = "awddwqawqwawq", action = test, displayName = "", internalName = "colorize" }
    , { signature = "aqawqadaq", action = test, displayName = "", internalName = "create_water" }
    , { signature = "dedwedade", action = test, displayName = "", internalName = "destroy_water" }
    , { signature = "aaqawawa", action = test, displayName = "", internalName = "ignite" }
    , { signature = "ddedwdwd", action = test, displayName = "", internalName = "extinguish" }
    , { signature = "qqa", action = test, displayName = "", internalName = "conjure_block" }
    , { signature = "qqd", action = test, displayName = "", internalName = "conjure_light" }
    , { signature = "wqaqwawqaqw", action = test, displayName = "", internalName = "bonemeal" }
    , { signature = "qqqqqwaeaeaeaeaea", action = test, displayName = "", internalName = "recharge" }
    , { signature = "qdqawwaww", action = test, displayName = "", internalName = "erase" }
    , { signature = "wqaqwd", action = test, displayName = "", internalName = "edify" }
    , { signature = "adaa", action = test, displayName = "", internalName = "beep" }
    , { signature = "waqqqqq", action = test, displayName = "", internalName = "craft/cypher" }
    , { signature = "wwaqqqqqeaqeaeqqqeaeq", action = test, displayName = "", internalName = "craft/trinket" }
    , { signature = "wwaqqqqqeawqwqwqwqwqwwqqeadaeqqeqqeadaeqq", action = test, displayName = "", internalName = "craft/artifact" }
    , { signature = "aqqqaqwwaqqqqqeqaqqqawwqwqwqwqwqw", action = test, displayName = "", internalName = "craft/battery" }
    , { signature = "qqqqqaqwawaw", action = test, displayName = "", internalName = "potion/weakness" }
    , { signature = "qqqqqawwawawd", action = test, displayName = "", internalName = "potion/levitation" }
    , { signature = "qqqqqaewawawe", action = test, displayName = "", internalName = "potion/wither" }
    , { signature = "qqqqqadwawaww", action = test, displayName = "", internalName = "potion/poison" }
    , { signature = "qqqqqadwawaw", action = test, displayName = "", internalName = "potion/slowness" }
    , { signature = "qqqqaawawaedd", action = test, displayName = "", internalName = "potion/regeneration" }
    , { signature = "qqqaawawaeqdd", action = test, displayName = "", internalName = "potion/night_vision" }
    , { signature = "qqaawawaeqqdd", action = test, displayName = "", internalName = "potion/absorption" }
    , { signature = "qaawawaeqqqdd", action = test, displayName = "", internalName = "potion/haste" }
    , { signature = "aawawaeqqqqdd", action = test, displayName = "", internalName = "potion/strength" }
    , { signature = "waeawae", action = test, displayName = "", internalName = "sentinel/create" }
    , { signature = "qdwdqdw", action = test, displayName = "", internalName = "sentinel/destroy" }
    , { signature = "waeawaede", action = test, displayName = "", internalName = "sentinel/get_pos" }
    , { signature = "waeawaedwa", action = test, displayName = "", internalName = "sentinel/wayfind" }
    , { signature = "waadwawdaaweewq", action = test, displayName = "", internalName = "lightning" }
    , { signature = "eawwaeawawaa", action = test, displayName = "", internalName = "flight" }
    , { signature = "eaqawqadaqd", action = test, displayName = "", internalName = "create_lava" }
    , { signature = "wwwqqqwwwqqeqqwwwqqwqqdqqqqqdqq", action = test, displayName = "", internalName = "teleport" }
    , { signature = "waeawaeqqqwqwqqwq", action = test, displayName = "", internalName = "sentinel/create/great" }
    , { signature = "eeewwweeewwaqqddqdqd", action = test, displayName = "", internalName = "dispel_rain" }
    , { signature = "wwweeewwweewdawdwad", action = test, displayName = "", internalName = "summon_rain" }
    , { signature = "qeqwqwqwqwqeqaeqeaqeqaeqaqded", action = test, displayName = "", internalName = "brainsweep" }
    , { signature = "qqqwqqqqqaq", action = test, displayName = "", internalName = "akashic/read" }
    , { signature = "eeeweeeeede", action = test, displayName = "", internalName = "akashic/write" }
    , { signature = "qqq", action = test, displayName = "", internalName = "open_paren" }
    , { signature = "eee", action = test, displayName = "", internalName = "close_paren" }
    , { signature = "qqqaw", action = test, displayName = "", internalName = "escape" }
    , { signature = "deaqq", action = test, displayName = "", internalName = "eval" }
    , { signature = "aqdee", action = test, displayName = "", internalName = "halt" }
    , { signature = "aqqqqq", action = test, displayName = "", internalName = "read" }
    , { signature = "deeeee", action = test, displayName = "", internalName = "write" }
    , { signature = "aqqqqqe", action = test, displayName = "", internalName = "readable" }
    , { signature = "deeeeeq", action = test, displayName = "", internalName = "writable" }
    , { signature = "wawqwqwqwqwqw", action = test, displayName = "", internalName = "read/entity" }
    , { signature = "wawqwqwqwqwqwew", action = test, displayName = "", internalName = "readable/entity" }
    , { signature = "qeewdweddw", action = test, displayName = "", internalName = "read/local" }
    , { signature = "eqqwawqaaw", action = test, displayName = "", internalName = "write/local" }
    , { signature = "d", action = test, displayName = "", internalName = "const/null" }
    , { signature = "qqqqqea", action = test, displayName = "", internalName = "const/vec/px" }
    , { signature = "qqqqqew", action = test, displayName = "", internalName = "const/vec/py" }
    , { signature = "qqqqqed", action = test, displayName = "", internalName = "const/vec/pz" }
    , { signature = "eeeeeqa", action = test, displayName = "", internalName = "const/vec/nx" }
    , { signature = "eeeeeqw", action = test, displayName = "", internalName = "const/vec/ny" }
    , { signature = "eeeeeqd", action = test, displayName = "", internalName = "const/vec/nz" }
    , { signature = "qqqqq", action = test, displayName = "", internalName = "const/vec/0" }
    , { signature = "qdwdq", action = test, displayName = "", internalName = "const/double/pi" }
    , { signature = "eawae", action = test, displayName = "", internalName = "const/double/tau" }
    , { signature = "aaq", action = test, displayName = "", internalName = "const/double/e" }
    , { signature = "qqqqqdaqa", action = test, displayName = "", internalName = "get_entity" }
    , { signature = "qqqqqdaqaawa", action = test, displayName = "", internalName = "get_entity/animal" }
    , { signature = "qqqqqdaqaawq", action = test, displayName = "", internalName = "get_entity/monster" }
    , { signature = "qqqqqdaqaaww", action = test, displayName = "", internalName = "get_entity/item" }
    , { signature = "qqqqqdaqaawe", action = test, displayName = "", internalName = "get_entity/player" }
    , { signature = "qqqqqdaqaawd", action = test, displayName = "", internalName = "get_entity/living" }
    , { signature = "qqqqqwded", action = test, displayName = "", internalName = "zone_entity" }
    , { signature = "qqqqqwdeddwa", action = test, displayName = "", internalName = "zone_entity/animal" }
    , { signature = "eeeeewaqaawa", action = test, displayName = "", internalName = "zone_entity/not_animal" }
    , { signature = "qqqqqwdeddwq", action = test, displayName = "", internalName = "zone_entity/monster" }
    , { signature = "eeeeewaqaawq", action = test, displayName = "", internalName = "zone_entity/not_monster" }
    , { signature = "qqqqqwdeddww", action = test, displayName = "", internalName = "zone_entity/item" }
    , { signature = "eeeeewaqaaww", action = test, displayName = "", internalName = "zone_entity/not_item" }
    , { signature = "qqqqqwdeddwe", action = test, displayName = "", internalName = "zone_entity/player" }
    , { signature = "eeeeewaqaawe", action = test, displayName = "", internalName = "zone_entity/not_player" }
    , { signature = "qqqqqwdeddwd", action = test, displayName = "", internalName = "zone_entity/living" }
    , { signature = "eeeeewaqaawd", action = test, displayName = "", internalName = "zone_entity/not_living" }
    , { signature = "edqde", action = test, displayName = "", internalName = "append" }
    , { signature = "qaeaq", action = test, displayName = "", internalName = "concat" }
    , { signature = "deeed", action = test, displayName = "", internalName = "index" }
    , { signature = "dadad", action = test, displayName = "", internalName = "for_each" }
    , { signature = "aqaeaq", action = test, displayName = "", internalName = "list_size" }
    , { signature = "adeeed", action = test, displayName = "", internalName = "singleton" }
    , { signature = "qqaeaae", action = test, displayName = "", internalName = "empty_list" }
    , { signature = "qqqaede", action = test, displayName = "", internalName = "reverse_list" }
    , { signature = "ewdqdwe", action = test, displayName = "", internalName = "last_n_list" }
    , { signature = "qwaeawq", action = test, displayName = "", internalName = "splat" }
    , { signature = "dedqde", action = test, displayName = "", internalName = "index_of" }
    , { signature = "edqdewaqa", action = test, displayName = "", internalName = "list_remove" }
    , { signature = "qaeaqwded", action = test, displayName = "", internalName = "slice" }
    , { signature = "wqaeaqw", action = test, displayName = "", internalName = "modify_in_place" }
    , { signature = "ddewedd", action = test, displayName = "", internalName = "construct" }
    , { signature = "aaqwqaa", action = test, displayName = "", internalName = "deconstruct" }
    , { signature = "aqaa", action = test, displayName = "", internalName = "num/positive" }
    , { signature = "dedd", action = test, displayName = "", internalName = "num/negative" }
    ]
