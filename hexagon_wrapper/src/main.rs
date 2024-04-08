use hexagon_wrapper::eval;

pub fn main() {
    let data = r#"
    {
        "instructions" : [
            {"signature" : "qaq"},
            {
                "signature" : "wa",
                "value" : {"iota_type" : "vector", "value" : {"x" : 1.5, "y" : 12, "z" : -7.0}}
            }
        ]
    }"#;

    let result = eval(data.to_string());

    println!("{result}");
}