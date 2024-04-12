import gleam/int
import lustre
import lustre/element
import lustre/element/html
import lustre/attribute
import lustre/event
import lustre/effect

pub fn main() {
  let app = lustre.application(init, update, view)
  let assert Ok(_) = lustre.start(app, "#app", Nil)
}

pub type Model {
  Model(count: Int, cats: List(String))
}

fn init(_flags) -> #(Model, effect.Effect(Msg)) {
  #(Model(0, []), effect.none())
}

pub type Msg {
  Increment
  Decrement
}

pub fn update(model: Model, msg: Msg) -> #(Model, effect.Effect(Msg)) {
  case msg {
    Increment -> #(Model(..model, count: model.count + 1), effect.none())
    Decrement -> #(Model(..model, count: model.count - 1), effect.none())
  }
}

pub fn view(model: Model) -> element.Element(Msg) {
  let count = int.to_string(model.count)

  html.div([], [])
}
