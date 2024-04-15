import iota.{type Iota, type IotaType}

pub type Pattern {
  Pattern(
    signature: String,
    start_direction: Direction,
    internal_name: String,
    display_name: String,
    output_options: List(IotaType),
    selected_output: List(#(IotaType, Iota)),
  )
}

pub type Direction {
  Northeast
  Northwest
  East
  West
  Southeast
  Southwest
}
