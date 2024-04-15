pub type GridPoint {
  GridPoint(
    offset: OffsetCoordinate,
    radius: Float,
    used: Bool,
    color: String,
    connected_points: List(PointConnection),
  )
}

pub type PointConnection {
  PointConnection(
    color: String,
    offset: OffsetCoordinate,
    between_values: #(OffsetCoordinate, OffsetCoordinate, OffsetCoordinate),
  )
}

pub type OffsetCoordinate {
  OffsetCoordinate(x: Int, y: Int)
}

pub type Coordinate {
  Coordinate(x: Float, y: Float)
}
