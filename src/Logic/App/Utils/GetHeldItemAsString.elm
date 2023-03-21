module Logic.App.Utils.GetHeldItemAsString exposing (..)
import Logic.App.Types exposing (HeldItem(..))


getHeldItemAsString : HeldItem -> String
getHeldItemAsString heldItem = case heldItem of
                        Trinket ->
                            "Trinket"

                        Cypher ->
                            "Cypher"

                        Artifact ->
                            "Artifact"

                        Spellbook ->
                            "Spellbook"

                        Focus ->
                            "Focus"

                        Pie ->
                            "Pie"

                        NoItem ->
                            "NoItem"