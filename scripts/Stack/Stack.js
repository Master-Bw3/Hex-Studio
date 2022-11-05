import drawn_patterns from '../Pattern/Drawn_Patterns.js';
import { PATTERNS } from '../Pattern/Pattern_list.js';
import { stack_panel, update_stack_panel } from '../UI/Stack_Panel.js';
import check_equality from './equality_checker.js';
import Iota from './Iota_Class.js';

let STACK = [];

function resimulate_stack() {
    for (let i = 0; i < pattern_draggable_container.children.length; i++) {
        const element = pattern_draggable_container.children[i];
        element.style.backgroundColor = 'var(--primary_lightest)';
    }
    STACK.length = 0;
    update_stack_panel();
    drawn_patterns.forEach(function (pattern) {
        update_stack(pattern);
    });
}

function update_stack(pattern) {
    function check_accepted_input(type, input) {
        let matching = false;
        input.forEach(function (iota) {
            if (iota.type === type || iota.type == 'any') matching = true;
        });

        return matching;
    }

    try {
        if (pattern.command === 'number') {
            STACK.unshift(pattern.outputs[0]);
        } else if (!(pattern.str in PATTERNS)) {
            //pattern does not exist
            throw ['NoSuchPattern', pattern.str];
            //check if there are enough inputs in the stack
        } else if (STACK.length >= pattern.inputs.length) {
            let check = true;
            if (pattern.inputs.length > 0) {
                check = pattern.inputs.every((element, i) => {
                    return check_accepted_input(STACK.at(pattern.inputs.length - i - 1).type, pattern.inputs.at(i)) ? true : false;
                });
            }

            if (!check) {
                console.log(pattern);
                throw ['IncorrectIota', pattern.str];
            } else {
                switch (pattern.command) {
                    case 'duplicate':
                        STACK.unshift(STACK[0]);
                        break;
                    case 'duplicate_n':
                        var num = STACK[0].value;
                        STACK.shift();
                        var copied_iota = STACK[0];
                        STACK.shift();
                        if (num >= 0) {
                            STACK = Array(num).fill(copied_iota).concat(STACK);
                        }
                        break;
                    case 'stack_len':
                        STACK.unshift(new Iota('number', STACK.length));
                        break;
                    case 'swap':
                        var temp = STACK[1];
                        STACK[1] = STACK[0];
                        STACK[0] = temp;
                        break;
                    case 'fisherman':
                        var num = STACK[0].value;
                        STACK.splice(0, 1);
                        STACK.unshift(STACK[num - 1]);
                        STACK.splice(num, 1);
                        break;
                    case 'add':
                        var iota1 = STACK[1];
                        var iota2 = STACK[0];
                        if (iota1.type === 'number' && iota2.type === 'number') {
                            STACK.splice(0, 2);
                            STACK.unshift(new Iota('number', iota1.value + iota2.value));
                        } else if (iota1.type == 'vector' && iota2.type === 'number') {
                            STACK.splice(0, 2);
                            var value = iota1.value.map((val) => val + iota2.value);
                            STACK.unshift(new Iota('vector', value));
                        } else if (iota2.type == 'vector' && iota1.type === 'number') {
                            STACK.splice(0, 2);
                            var value = iota2.value.map((val) => iota1.value + val);
                            STACK.unshift(new Iota('vector', value));
                        } else if (iota1.type == 'vector' && iota2.type === 'vector') {
                            STACK.splice(0, 2);
                            var value = iota1.value.map((val, i) => val + iota2.value[i]);
                            STACK.unshift(new Iota('vector', value));
                        }
                        break;
                    case 'sub':
                        var iota1 = STACK[1];
                        var iota2 = STACK[0];
                        if (iota1.type === 'number' && iota2.type === 'number') {
                            STACK.splice(0, 2);
                            STACK.unshift(new Iota('number', iota1.value - iota2.value));
                        } else if (iota1.type == 'vector' && iota2.type === 'number') {
                            STACK.splice(0, 2);
                            var value = iota1.value.map((val) => val - iota2.value);
                            STACK.unshift(new Iota('vector', value));
                        } else if (iota2.type == 'vector' && iota1.type === 'number') {
                            STACK.splice(0, 2);
                            var value = iota2.value.map((val) => iota1.value - val);
                            STACK.unshift(new Iota('vector', value));
                        } else if (iota1.type == 'vector' && iota2.type === 'vector') {
                            STACK.splice(0, 2);
                            var value = iota1.value.map((val, i) => val - iota2.value[i]);
                            STACK.unshift(new Iota('vector', value));
                        }
                        break;
                    case 'mul_dot':
                        var iota1 = STACK[1];
                        var iota2 = STACK[0];
                        if (iota1.type === 'number' && iota2.type === 'number') {
                            STACK.splice(0, 2);
                            STACK.unshift(new Iota('number', iota1.value * iota2.value));
                        } else if (iota1.type == 'vector' && iota2.type === 'number') {
                            STACK.splice(0, 2);
                            var value = iota1.value.map((val) => val * iota2.value);
                            STACK.unshift(new Iota('vector', value));
                        } else if (iota2.type == 'vector' && iota1.type === 'number') {
                            STACK.splice(0, 2);
                            var value = iota2.value.map((val) => iota1.value * val);
                            STACK.unshift(new Iota('vector', value));
                        } else if (iota1.type == 'vector' && iota2.type === 'vector') {
                            STACK.splice(0, 2);
                            value = math.dot(iota1.value, iota2.value);
                            STACK.unshift(new Iota('vector', value));
                        }
                        break;
                    case 'div_cross':
                        var iota1 = STACK[1];
                        var iota2 = STACK[0];
                        if (iota1.type === 'number' && iota2.type === 'number') {
                            STACK.splice(0, 2);
                            STACK.unshift(new Iota('number', iota1.value / iota2.value));
                        } else if (iota1.type == 'vector' && iota2.type === 'number') {
                            STACK.splice(0, 2);
                            var value = iota1.value.map((val) => val / iota2.value);
                            STACK.unshift(new Iota('vector', value));
                        } else if (iota2.type == 'vector' && iota1.type === 'number') {
                            STACK.splice(0, 2);
                            var value = iota2.value.map((val) => iota1.value * val);
                            STACK.unshift(new Iota('vector', value));
                        } else if (iota1.type == 'vector' && iota2.type === 'vector') {
                            STACK.splice(0, 2);
                            value = math.cross(iota1.value, iota2.value);
                            STACK.unshift(new Iota('vector', value));
                        }
                        break;
                    case 'abs_len':
                        var iota = STACK[0];
                        if (iota.type === 'vector') {
                            var value = math.distance([0, 0, 0], iota.value);
                            value = Math.round(value * 10000) / 10000; //round to 4 decimal places
                        } else if (iota.type === 'number') {
                            value = Math.abs(iota.value);
                        }
                        STACK.shift();
                        STACK.unshift(new Iota('vector', value));
                        break;
                    case 'pow_proj':
                        var iota1 = STACK[1];
                        var iota2 = STACK[0];
                        if (iota1.type === 'number' && iota2.type === 'number') {
                            STACK.splice(0, 2);
                            STACK.unshift(new Iota('number', iota1.value ** iota2.value));
                        } else if (iota1.type == 'vector' && iota2.type === 'number') {
                            STACK.splice(0, 2);
                            var value = iota1.value.map((val) => val ** iota2.value);
                            STACK.unshift(new Iota('vector', value));
                        } else if (iota2.type == 'vector' && iota1.type === 'number') {
                            STACK.splice(0, 2);
                            var value = iota2.value.map((val) => iota1.value ** val);
                            STACK.unshift(new Iota('vector', value));
                        } else if (iota1.type == 'vector' && iota2.type === 'vector') {
                            STACK.splice(0, 2);
                            var value = iota1.value.map((val) => val * (math.dot(iota2.value, iota1.value) / math.dot(iota1.value, iota1.value)));
                            STACK.unshift(new Iota('vector', value));
                        }
                        break;
                    case 'floor':
                        value = Math.floor(STACK[0].value);
                        STACK.shift();
                        STACK.unshift(new Iota('number', value));
                        break;
                    case 'ceil':
                        value = Math.ceil(STACK[0].value);
                        STACK.shift();
                        STACK.unshift(new Iota('number', value));
                        break;
                    case 'construct_vec':
                        value = [STACK[2].value, STACK[1].value, STACK[0].value];
                        STACK.splice(0, 3);
                        STACK.unshift(new Iota('vector', value));
                        break;
                    case 'deconstruct_vec':
                        iota = STACK[0];
                        STACK.splice(0, 3);
                        STACK.unshift(new Iota('number', iota.value[0]));
                        STACK.unshift(new Iota('number', iota.value[1]));
                        STACK.unshift(new Iota('number', iota.value[2]));
                        break;
                    case 'coerce_axial':
                        var vector = STACK[0].value;
                        var magnitude = Math.sqrt(vector[0] ** 2 + vector[1] ** 2 + vector[2] ** 2);
                        var azimuth = Math.acos(vector[2] / magnitude);
                        var theta = Math.atan(vector[1] / vector[0]);

                        //snap to nearest 90 degrees
                        var snapped_azimuth = Math.round(azimuth / 1.5708) * 1.5708;
                        var snapped_theta = Math.round(theta / 1.5708) * 1.5708;

                        vector = [...vector];
                        vector[0] = Math.sin(snapped_azimuth) * Math.cos(snapped_theta);
                        vector[1] = Math.sin(snapped_azimuth) * Math.sin(snapped_theta);
                        vector[2] = Math.cos(snapped_azimuth);
                        vector = vector.map((component) => (Math.round(component) == 0 ? 0 : Math.round(component))); //round to int and get rid of -0
                        STACK.shift();
                        STACK.unshift(new Iota('vector', vector));
                        break;
                    case 'and':
                        var iota1 = STACK[1];
                        var iota2 = STACK[0];
                        var new_iota = iota1.type === 'null' ? new Iota('null', undefined) : structuredClone(iota2);
                        STACK.splice(0, 2);
                        STACK.unshift(new_iota);
                        break;
                    case 'or':
                        var iota1 = STACK[1];
                        var iota2 = STACK[0];
                        var new_iota = iota1.type !== 'null' ? structuredClone(iota1) : structuredClone(iota2);
                        STACK.splice(0, 2);
                        STACK.unshift(new_iota);
                        break;
                    case 'xor':
                        var iota1 = STACK[1];
                        var iota2 = STACK[0];
                        var new_iota;
                        if ((iota1.type === 'null' && iota2.type === 'null') || (iota1.type !== 'null' && iota2.type !== 'null')) {
                            new_iota = new Iota('null', undefined);
                        } else if (iota1.type === 'null') {
                            new_iota = structuredClone(iota2);
                        } else if (iota2.type === 'null') {
                            new_iota = structuredClone(iota1);
                        }
                        STACK.splice(0, 2);
                        STACK.unshift(new_iota);
                        break;
                    case 'greater':
                        var iota1 = STACK[1];
                        var iota2 = STACK[0];
                        var value = iota1.value > iota2.value ? 1 : 0;
                        STACK.splice(0, 2);
                        STACK.unshift(new Iota('number', value));
                        break;
                    case 'less':
                        var iota1 = STACK[1];
                        var iota2 = STACK[0];
                        var value = iota1.value < iota2.value ? 1 : 0;
                        STACK.splice(0, 2);
                        STACK.unshift(new Iota('number', value));
                        break;
                    case 'greater_eq':
                        var iota1 = STACK[1];
                        var iota2 = STACK[0];
                        var value = iota1.value >= iota2.value ? 1 : 0;
                        STACK.splice(0, 2);
                        STACK.unshift(new Iota('number', value));
                        break;
                    case 'less_eq':
                        var iota1 = STACK[1];
                        var iota2 = STACK[0];
                        var value = iota1.value <= iota2.value ? 1 : 0;
                        STACK.splice(0, 2);
                        STACK.unshift(new Iota('number', value));
                        break;
                    case 'equals':
                        var iota1 = STACK[1];
                        var iota2 = STACK[0];
                        value = check_equality(iota1, iota2) ? 1 : 0;
                        STACK.splice(0, 2);
                        STACK.unshift(new Iota('number', value));
                        break;
                    case 'not_equals':
                        var iota1 = STACK[1];
                        var iota2 = STACK[0];
                        value = check_equality(iota1, iota2) ? 0 : 1;
                        STACK.splice(0, 2);
                        STACK.unshift(new Iota('number', value));
                        break;
                    case 'not':
                        var iota = STACK[0];
                        var value = iota.type === 'null' || iota.value === 0 ? 1 : 0;
                        STACK.shift();
                        STACK.unshift(new Iota('number', value));
                        break;
                    case 'identity':
                        var iota = STACK[0];
                        var new_iota;
                        if (iota.type === 'null') {
                            new_iota = new Iota('number', 0);
                        } else if (iota.value === 0) {
                            new_iota = new Iota('null', undefined);
                        } else {
                            new_iota = iota;
                        }
                        STACK.shift();
                        STACK.unshift(new_iota);
                        break;
                    case 'random':
                        STACK.unshift(new Iota('number', Math.round(Math.random() * 10000) / 10000));
                        break;
                    case 'sin':
                        var iota = STACK[0];
                        STACK.shift();
                        STACK.unshift(new Iota('number', Math.sin(iota.value)));
                        break;
                    case 'cos':
                        var iota = STACK[0];
                        STACK.shift();
                        STACK.unshift(new Iota('number', Math.cos(iota.value)));
                        break;
                    case 'tan':
                        var iota = STACK[0];
                        STACK.shift();
                        STACK.unshift(new Iota('number', Math.tan(iota.value)));
                        break;
                    case 'arcsin':
                        var iota = STACK[0];
                        STACK.shift();
                        STACK.unshift(new Iota('number', Math.asin(iota.value)));
                        break;
                    case 'arccos':
                        var iota = STACK[0];
                        STACK.shift();
                        STACK.unshift(new Iota('number', Math.acos(iota.value)));
                        break;
                    case 'arctan':
                        var iota = STACK[0];
                        STACK.shift();
                        STACK.unshift(new Iota('number', Math.atan(iota.value)));
                        break;
                    case 'logarithm':
                        var iota1 = STACK[1];
                        var iota2 = STACK[0];
                        STACK.splice(0, 2);
                        STACK.unshift(new Iota('number', math.log(iota1.value, iota2.value)));
                        break;
                    case 'modulo':
                        var iota1 = STACK[1];
                        var iota2 = STACK[0];
                        STACK.splice(0, 2);
                        STACK.unshift(new Iota('number', iota1.value % iota2.value));
                        break;
                    case 'd':
                        break;
                    case 'd':
                        break;
                    default:
                        //operators that take generic inputs and give generic outputs ie: raycast, get_caster
                        pattern.inputs.forEach((input, i) => {
                            console.log(pattern.inputs.length - i - 1, input);
                            STACK.shift();
                        });

                        //add outputs to stack
                        pattern.outputs.forEach((output) => {
                            STACK.unshift(output);
                        });
                        break;
                }
            }
        } else {
            throw ['NotEnoughIotas', pattern.str];
        }
    } catch (error) {
        console.warn(error);

        switch (error[0]) {
            case 'NotEnoughIotas':
                pattern_draggable_container.children[drawn_patterns.findIndex((ptrn) => ptrn === pattern)].style.backgroundColor = '#4F3737';
                var garbages = Array(PATTERNS[pattern.str]['inputs'].length - STACK.length).fill(new Iota('garbage'));
                STACK = garbages.concat(STACK);
                break;
            case 'IncorrectIota':
                pattern_draggable_container.children[drawn_patterns.findIndex((ptrn) => ptrn === pattern)].style.backgroundColor = '#4F3737';
                var garbages = [];
                PATTERNS[error[1]]['inputs'].forEach((iota) => {
                    if (!check_accepted_input(STACK[0].type, iota)) {
                        STACK.shift();
                        garbages.unshift(new Iota('garbage'));
                    }
                });
                STACK = garbages.concat(STACK);
                break;
            case 'NoSuchPattern':
                pattern_draggable_container.children[drawn_patterns.findIndex((ptrn) => ptrn === pattern)].style.backgroundColor = '#4F3737';
                STACK.unshift(new Iota('garbage'));
                break;

            default:
                break;
        }
    }

    //display stack in stack panel
    update_stack_panel();
}

export { STACK, resimulate_stack, update_stack };
