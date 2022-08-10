import 'https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js';
import Iota from '../Stack/Iota_Class.js';

let PATTERNS;
$.ajaxSetup({
    async: false,
});
$.getJSON('pattern_registry.json', function (data) {
    for (const [key, val] of Object.entries(data)) {
        const outputs = val['outputs'];
        const inputs = val['inputs'];
        for (let i = 0; i < outputs.length; i++) {
            let output = outputs[i];
            outputs[i] = output.map((value) => new Iota(value, undefined));
        }
        for (let i = 0; i < inputs.length; i++) {
            let input = inputs[i];
            inputs[i] = input.map((value) => new Iota(value, undefined));
        }
    }
    PATTERNS = data;

});
export default PATTERNS;
