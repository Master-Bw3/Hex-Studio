module Components.Icon.ParagraphDropdown exposing (..)

import Html exposing (Html, div)
import Html.Attributes as Attr
import Svg exposing (svg)
import Svg.Attributes as SvgAttr


paragraphDropdown : Html msg
paragraphDropdown =
    div [ Attr.id "paragraph_dropdown" ]
        [ svg
            [ SvgAttr.id "Layer_1"
            , Attr.attribute "data-name" "Layer 1"
            , SvgAttr.viewBox "0 0 21.36 16.37"
            ]
            [ Svg.g
                [ SvgAttr.opacity "0.7"
                ]
                [ Svg.line
                    [ SvgAttr.y1 "14.79"
                    , SvgAttr.x2 "14.11"
                    , SvgAttr.y2 "14.79"
                    , SvgAttr.fill "none"
                    , SvgAttr.stroke "#f5faff"
                    , SvgAttr.strokeMiterlimit "10"
                    , SvgAttr.strokeWidth "3"
                    ]
                    []
                , Svg.line
                    [ SvgAttr.y1 "8.15"
                    , SvgAttr.x2 "21.36"
                    , SvgAttr.y2 "8.15"
                    , SvgAttr.fill "none"
                    , SvgAttr.stroke "#f5faff"
                    , SvgAttr.strokeMiterlimit "10"
                    , SvgAttr.strokeWidth "3"
                    ]
                    []
                , Svg.line
                    [ SvgAttr.y1 "1.5"
                    , SvgAttr.x2 "21.36"
                    , SvgAttr.y2 "1.5"
                    , SvgAttr.fill "none"
                    , SvgAttr.stroke "#f5faff"
                    , SvgAttr.strokeMiterlimit "10"
                    , SvgAttr.strokeWidth "3"
                    ]
                    []
                , Svg.polygon
                    [ SvgAttr.points "18.49 16.36 21.36 13.27 15.62 13.27 18.49 16.36"
                    , SvgAttr.fill "#f5faff"
                    ]
                    []
                ]
            ]
        ]
