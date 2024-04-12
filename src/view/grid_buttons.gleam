import lustre/element/html.{button, text}
import lustre/attribute.{id}

pub fn sort_button() {
  button([id("sort")], [text("sort")])
}

pub fn zoom_out_button() {
  button([id("zoom_out")], [text("zoom_out")])
}

pub fn zoom_in_button() {
  button([id("zoom_in")], [text("zoom_in")])
}
