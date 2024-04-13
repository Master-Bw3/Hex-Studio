import lustre/element/html.{div}
import lustre/attribute.{id}
import view/panels/pattern_panel.{view_pattern_panel}

pub fn view_panels() {
  div([id("panels")], [view_pattern_panel()])
}
