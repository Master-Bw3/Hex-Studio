import gleam/float
import gleam/int

pub opaque type AxialCoordinate {
  AxialCoordinate(q: Int, r: Int)
}

pub fn axial(q: Int, r: Int) -> AxialCoordinate {
  AxialCoordinate(q: q, r: r)
}

pub fn q(coordinate: AxialCoordinate) -> Int {
  coordinate.q
}

pub fn r(coordinate: AxialCoordinate) -> Int {
  coordinate.r
}

pub fn s(coordinate: AxialCoordinate) -> Int {
  -q(coordinate) - r(coordinate)
}

pub fn subtract(a: AxialCoordinate, b: AxialCoordinate) -> AxialCoordinate {
  AxialCoordinate(q(a) - q(b), r(a) - r(b))
}

pub fn distance(a: AxialCoordinate, b: AxialCoordinate) -> Int {
  let vec = subtract(a, b)
  {
    int.absolute_value(q(vec))
    + int.absolute_value(r(vec))
    + int.absolute_value(s(vec))
  }
  / 2
}

fn sqrt_3() -> Float {
  let assert Ok(result) = float.square_root(3.0)
  result
}

pub fn from_pixel(x: Int, y: Int, size: Float) -> AxialCoordinate {
  let qf =
    { sqrt_3() /. 3.0 *. int.to_float(x) -. 0.33333 *. int.to_float(y) } /. size
  let rf = { 0.66666 *. int.to_float(y) } /. size

  let q = float.round(qf)
  let r = float.round(rf)

  let qf = qf -. int.to_float(q)
  let rf = rf -. int.to_float(r)

  case int.absolute_value(q) >= int.absolute_value(r) {
    True -> AxialCoordinate(q + float.round(qf +. 0.5 *. rf), r)
    False -> AxialCoordinate(q, r + float.round(rf +. 0.5 *. qf))
  }
}

pub fn to_pixel(coordinate: AxialCoordinate, size: Float) -> #(Float, Float) {
  let x =
    {
      sqrt_3()
      *. int.to_float(q(coordinate))
      +. sqrt_3()
      /. 2.0
      *. int.to_float(r(coordinate))
    }
    *. size
  let y = { 1.5 *. int.to_float(r(coordinate)) } *. size

  #(x, y)
}
