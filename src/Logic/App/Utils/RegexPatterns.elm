module Logic.App.Utils.RegexPatterns exposing (..)

import Regex


commentPattern =
    Maybe.withDefault Regex.never <| Regex.fromString "\\/\\/.*"


numberValuePattern =
    Maybe.withDefault Regex.never <| Regex.fromString ":(?=[^\\n]*\\d)[\\d\\s.]*"


bookkeepersValuePattern =
    Maybe.withDefault Regex.never <| Regex.fromString ":(?=[^\\n]*[-v])[\\sv-]*"


bookkeepersPattern =
    Maybe.withDefault Regex.never <| Regex.fromString "^[v-]+$"
