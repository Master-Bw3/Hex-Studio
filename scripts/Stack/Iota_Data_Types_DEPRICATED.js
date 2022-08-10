//iota data types
class Vector {
    constructor (v1, v2, v3) {
        this.value = [v1, v2, v3]
        this.type = "vector"
    }
}

class Num {
    constructor(value) {
        this.value = value;
        this.type = "number"
    }
}
class Entity {
    constructor(value) {
        this.value = value;
        this.type = "entity"

    }
}
class Null {
    constructor(value) {
        this.value = "null";
        this.type = "null"
    }
}
class Pattern_ {
    constructor(value) {
        this.value = value;
        this.type = "pattern"

    }
}
class List {
    constructor(value) {
        this.value = value;
        this.type = "List"
    }
}

export {Vector, Num, Entity, Null, Pattern_, List}