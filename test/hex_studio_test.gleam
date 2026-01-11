import gleeunit
import hexcoord/hexcoord

pub fn main() -> Nil {
  gleeunit.main()
}

// gleeunit test functions end in `_test`
pub fn hello_world_test() {
  let name = "Joe"
  let greeting = "Hello, " <> name <> "!"

  assert greeting == "Hello, Joe!"
}

pub fn axial_distance_1_test() {
  let a = hexcoord.axial(1, -1)
  let b = hexcoord.axial(2, -1)
  let expected_distance = 1

  let result = hexcoord.distance(a, b)

  assert result == expected_distance
}

pub fn axial_distance_2_test() {
  let a = hexcoord.axial(1, -1)
  let b = hexcoord.axial(3, -2)
  let expected_distance = 2

  let result = hexcoord.distance(a, b)

  assert result == expected_distance
}
