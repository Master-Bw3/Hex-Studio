import lustre/element/html.{button, div, text}
import lustre/attribute.{id}

pub fn view_grid_buttons() {
  div([id("canvas_buttons")], [
    sort_button(),
    zoom_out_button(),
    zoom_in_button(),
  ])
}

fn sort_button() {
  button([id("sort")], [text("sort")])
}

fn zoom_out_button() {
  button([id("zoom_out")], [text("zoom_out")])
}

fn zoom_in_button() {
  button([id("zoom_in")], [text("zoom_in")])
}
