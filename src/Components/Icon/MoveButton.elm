module Components.Icon.MoveButton exposing (moveButton)
import Svg exposing (svg)
import Svg.Attributes as SvgAttr
import Html.Attributes exposing (attribute)
import Html exposing (..)

moveButton =
    svg
        [ SvgAttr.viewBox "0 0 21.36 16.29"
        ]
        [ Svg.g
            [ SvgAttr.opacity "0.7"
            ]
            [ Svg.line
                [ SvgAttr.y1 "14.79"
                , SvgAttr.x2 "21.36"
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
            ]
        ]
