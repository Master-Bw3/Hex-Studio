import glearray.{type Array}

pub type Iota {
  Number(Float)
  Vector(x: Float, y: Float, z: Float)
  Boolean(Bool)
  Entity(String)
  List(Array(Iota))
  Pattern
  Garbage
}

pub type IotaType {
  NumberType
  VectorType
  BooleanType
  EntityType
  ListType
  PatternType
  GarbageType
}
