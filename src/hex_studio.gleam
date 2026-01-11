/// 2D Game Example - Orthographic Camera
import gleam/float
import gleam/int
import gleam/list
import gleam/option
import gleam/result
import gleam/time/duration
import hexcoord/hexcoord
import tiramisu
import tiramisu/background
import tiramisu/camera
import tiramisu/effect.{type Effect}
import tiramisu/geometry
import tiramisu/input
import tiramisu/light
import tiramisu/material
import tiramisu/scene
import tiramisu/transform
import vec/vec2
import vec/vec3

pub type Model {
  Model(time: Float)
}

pub type Msg {
  Tick
  BackgroundSet
}

pub fn main() -> Nil {
  let assert Ok(Nil) =
    tiramisu.application(init:, update:, view:)
    |> tiramisu.start("#app", tiramisu.FullScreen, option.None)
  Nil
}

fn init(ctx: tiramisu.Context) -> #(Model, Effect(Msg), option.Option(_)) {
  let bg_effect =
    background.set(
      ctx.scene,
      background.Color(0x1a1a2e),
      BackgroundSet,
      BackgroundSet,
    )
  #(
    Model(time: 0.0),
    effect.batch([bg_effect, effect.dispatch(Tick)]),
    option.None,
  )
}

fn update(
  model: Model,
  msg: Msg,
  ctx: tiramisu.Context,
) -> #(Model, Effect(Msg), option.Option(_)) {
  case msg {
    Tick -> {
      let delta_seconds = duration.to_seconds(ctx.delta_time)
      let new_time = model.time +. delta_seconds
      #(Model(time: new_time), effect.dispatch(Tick), option.None)
    }
    BackgroundSet -> #(model, effect.none(), option.None)
  }
}

fn view(model: Model, ctx: tiramisu.Context) -> scene.Node {
  let cam =
    camera.camera_2d(size: vec2.Vec2(
      float.round(ctx.canvas_size.x),
      float.round(ctx.canvas_size.y),
    ))

  let scale = 40.0

  let dots_positions =
    list.range(-5, 5)
    |> list.flat_map(fn(y) {
      list.range(-5, 5) |> list.map(fn(x) { hexcoord.axial(x, y) })
    })

  let dot_meshes =
    list.map(dots_positions, fn(pos) {
      let coord = hexcoord.to_pixel(pos, scale)
      let mouse = input.mouse_position(ctx.input)

      echo #(coord.0, coord.1, mouse.x, mouse.y)

      let dot_size =
        echo float.clamp(
          200.0
            /. distance(
            coord.0,
            coord.1,
            mouse.x -. ctx.canvas_size.x /. 2.0,
            ctx.canvas_size.y /. 2.0 -. mouse.y,
          ),
          0.1,
          10.0,
        )
      dot(coord.0, coord.1, dot_size)
    })

  scene.empty(id: "Scene", transform: transform.identity, children: [
    scene.camera(
      id: "camera",
      camera: cam,
      transform: transform.at(position: vec3.Vec3(0.0, 0.0, 20.0)),
      active: True,
      viewport: option.None,
      postprocessing: option.None,
    ),
    scene.light(
      id: "ambient",
      light: {
        let assert Ok(light) = light.ambient(color: 0xffffff, intensity: 1.0)
        light
      },
      transform: transform.identity,
    ),
    ..dot_meshes
  ])
}

fn dot(x: Float, y: Float, dot_size: Float) {
  let assert Ok(sprite_geom) = geometry.circle(dot_size, 6)
  let assert Ok(sprite_mat) =
    material.basic(
      color: 0xff0066,
      transparent: False,
      opacity: 1.0,
      map: option.None,
      side: material.FrontSide,
      alpha_test: 0.0,
      depth_write: True,
    )

  scene.mesh(
    id: float.to_string(x) <> float.to_string(y),
    geometry: sprite_geom,
    material: sprite_mat,
    transform: transform.at(position: vec3.Vec3(x, y, 0.0)),
    physics: option.None,
  )
}

fn distance(x1, y1, x2, y2) {
  let dist = {
    use x <- result.try(float.power(x1 -. x2, 2.0))
    use y <- result.try(float.power(y1 -. y2, 2.0))
    float.square_root(x +. y)
  }

  case dist {
    Ok(dist) -> dist
    Error(Nil) -> 0.0
  }
}
