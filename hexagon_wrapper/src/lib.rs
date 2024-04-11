use std::{collections::HashMap, rc::Rc};

use hexagon::{interpreter::{interpret, mishap::Mishap}, iota::{hex_casting::{garbage::GarbageIota, null::NullIota, vector::VectorIota}, Iota}, parse_config::Config, parser::{ActionValue, AstNode, Location}, pattern_registry::{PatternRegistry, PatternRegistryExt}};
use nalgebra::matrix;
use serde_json::{Map, Value};
use wasm_bindgen::prelude::wasm_bindgen;

#[wasm_bindgen]
pub fn evaluate(json: String) -> String {
    let instructions = decode_json(json);
    let ast = construct_ast_from_signatures_and_values(instructions);
    let config = Config { 
        libraries: HashMap::new(),
        entities: HashMap::new(),
        great_spell_sigs: PatternRegistry::gen_default_great_sigs() 
    };

    let result = interpret(ast, &config, HashMap::new(), "", "");
    match result {
        Ok(state) => {
            let mut map = Map::new();
            map.insert("stack".to_string(), serialize_stack(&state.stack));
            Value::Object(map).to_string()
        },
        Err((mishap, location, state)) => {
            let mut map = Map::new();
            map.insert("stack".to_string(), serialize_stack(&state.stack));
            map.insert("mishap".to_string(), serialize_mishap(&mishap));
            //this should always be true
            if let Location::List(index) = location {
                map.insert("location".to_string(), Value::Number(index.into()));
            }
            Value::Object(map).to_string()        
        },
    }
}

fn serialize_mishap(mishap: &Mishap) -> Value {
    match mishap {
        Mishap::NotEnoughIotas(_, _) => Value::String("notEnoughIotas".to_string()),
        Mishap::IncorrectIota(_, _, _) => Value::String("incorrectIota".to_string()),
        Mishap::MathematicalError() => Value::String("mathematicalError".to_string()),
        Mishap::HastyRetrospection => Value::String("hastyRetrospection".to_string()),
        Mishap::InvalidPattern => Value::String("invalidPattern".to_string()),
        Mishap::ExpectedPattern(_) => Value::String("expectedPattern".to_string()),
        Mishap::ExpectedValue(_, _) => Value::String("expectedValue".to_string()),
        Mishap::InvalidValue(_, _) => Value::String("invalidValue".to_string()),
        Mishap::OpCannotBeConsidered => Value::String("opCannotBeConsidered".to_string()),
        Mishap::OpNotEnoughArgs(_) => Value::String("opNotEnoughArgs".to_string()),
        Mishap::OpExpectedVar(_) => Value::String("opExpectedVar".to_string()),
        Mishap::OpExpectedIota => Value::String("opExpectedValue".to_string()),
        Mishap::VariableNotAssigned(_) => Value::String("variableNotAssigned".to_string()),
        Mishap::NoIotaAtIndex(_) => Value::String("noIotaAtIndex".to_string()),
        Mishap::NoAkashicRecord(_) => Value::String("noAkashicRecord".to_string()),
        Mishap::HoldingIncorrectItem => Value::String("holdingIncorrectItem".to_string()),
        Mishap::MatrixWrongSize(_, _, _) => Value::String("matrixWrongSize".to_string()),
    }
}

fn construct_ast_from_signatures_and_values(instructions: Vec<(String, Option<ActionValue>)>) -> AstNode {
    let nodes = instructions.into_iter().enumerate().map(
        |(i,(sig, value))| {
            AstNode::Action { location: Location::List(i), name: sig, value: value }
        }
    ).collect::<Vec<_>>();

    return AstNode::Program(nodes);
}

/*
{
    instructions: [
        {"signature": qaq, "value": 1},
        {"signature": qaq, "value": 2}
    ]
}
*/

fn decode_json(json: String) -> Vec<(String, Option<ActionValue>)> {
    let json: Value = serde_json::from_str(&json).unwrap();

    let instructions = json["instructions"].as_array().unwrap();

    instructions.iter().map(
        |value| {
            (value["identifier"].as_str().unwrap().to_string(), 
            value.as_object()
                .and_then(|x| x.contains_key("value")
                .then(|| decode_value(value))))
    }).collect::<Vec<_>>()
}

fn decode_value(value: &Value) -> ActionValue {
    let iota = value.as_object().unwrap().get("value").unwrap();
    ActionValue::Iota(decode_iota(iota.as_object().unwrap()))
}

fn decode_iota(obj: &Map<String, Value>) -> Rc<dyn Iota> {
    let iota_type = obj.get("iota_type").unwrap().as_str().unwrap();
    match iota_type {
        "number" => Rc::new(obj.get("value").unwrap().as_f64().unwrap()),
        "boolean" => Rc::new(obj.get("value").unwrap().as_bool().unwrap()),
        "null" => Rc::new(NullIota),
        "garbage" => Rc::new(GarbageIota),
        "vector" => Rc::new(decode_vector(obj.get("value").unwrap())),
        "entity" => Rc::new(obj.get("value").unwrap().as_str().unwrap().to_string()),
        _ => panic!()
    }
}

fn decode_vector(value: &Value) -> VectorIota {
    let vector = value.as_object().unwrap();
    let x = vector.get("x").unwrap().as_f64().unwrap();
    let y = vector.get("y").unwrap().as_f64().unwrap();
    let z = vector.get("z").unwrap().as_f64().unwrap();

    return matrix![x, y, z];
}


fn serialize_stack(stack: &im::Vector<Rc<dyn Iota>>) -> Value {
    let serialized = stack
        .iter()
        .map(|x| x.serialize_to_json())
        .collect();

    Value::Array(serialized)
}