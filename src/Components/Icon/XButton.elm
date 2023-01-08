module Components.Icon.XButton exposing (xButton)
import Svg exposing (svg)
import Svg.Attributes as SvgAttr
import Html.Attributes exposing (attribute)
import Html exposing (..)
xButton : Html msg
xButton =
    svg
        [ SvgAttr.viewBox "0 0 10.98 10.98"
        ]
        [ Svg.defs []
            [ Svg.style []
                [ text ".cls-1{opacity:0.51;}.cls-2{fill:none;stroke:#f5faff;stroke-miterlimit:10;stroke-width:3px;}" ]
            ]
        , Svg.g
            [ SvgAttr.id "Layer_2"
            , attribute "data-name" "Layer 2"
            ]
            [ Svg.g
                [ SvgAttr.id "Code"
                ]
                [ Svg.g
                    [ SvgAttr.class "cls-1"
                    ]
                    [ Svg.line
                        [ SvgAttr.class "cls-2"
                        , SvgAttr.x1 "1.06"
                        , SvgAttr.y1 "1.06"
                        , SvgAttr.x2 "9.92"
                        , SvgAttr.y2 "9.92"
                        ]
                        []
                    , Svg.line
                        [ SvgAttr.class "cls-2"
                        , SvgAttr.x1 "9.92"
                        , SvgAttr.y1 "1.06"
                        , SvgAttr.x2 "1.06"
                        , SvgAttr.y2 "9.92"
                        ]
                        []
                    ]
                ]
            ]
        ]