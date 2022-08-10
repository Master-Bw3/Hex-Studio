import DRAWN_PATTERNS from '../Pattern/Drawn_Patterns.js';
import PATTERNS from '../Pattern/Pattern_list.js';
import { update_stack_panel } from '../UI/Stack_Panel.js';
import Iota from './Iota_Class.js';

let STACK = [];

function resimulate_stack() {
    for (let i = 0; i < pattern_draggable_container.children.length; i++) {
        const element = pattern_draggable_container.children[i];
        element.style.backgroundColor = 'var(--primary_lightest)';
    }
    STACK.length = 0;
    update_stack_panel();
    DRAWN_PATTERNS.forEach(function (pattern) {
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
                if (!check_accepted_input(STACK[0].type, pattern.inputs.at(-1))) check = false;
            }

            if (!check) {
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
                            var value = iota1.value.map((val) => iota2.value + val);
                            STACK.unshift(new Iota("vector", value));
                        } else if (iota2.type == 'vector' && iota1.type === 'number') {
                            STACK.splice(0, 2);
                            var value = iota2.value.map((val) => iota1.value + val);
                            STACK.unshift(new Iota("vector", value));
                        } else if (iota1.type == 'vector' && iota2.type === 'vector') {
                            STACK.splice(0, 2);
                            var value = iota1.value.map((val, i) => val + iota2.value[i]);
                            STACK.unshift(new Iota("vector", value));
                        }
                        break;
                    case 'd':
                        break;

                    default:
                        //operators that take generic inputs and give generic outputs ie: raycast, get_caster
                        pattern.inputs.forEach((input) => {
                            if (check_accepted_input(STACK[0].type, input)) {
                                STACK.shift();
                            } else {
                                throw ['IncorrectIota', pattern.str];
                            }
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
                pattern_draggable_container.children[DRAWN_PATTERNS.findIndex((ptrn) => ptrn === pattern)].style.backgroundColor = '#4F3737';
                var garbages = Array(PATTERNS[pattern.str]['inputs'].length - STACK.length).fill(new Iota('garbage'));
                STACK = garbages.concat(STACK);
                break;
            case 'IncorrectIota':
                pattern_draggable_container.children[DRAWN_PATTERNS.findIndex((ptrn) => ptrn === pattern)].style.backgroundColor = '#4F3737';
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
                pattern_draggable_container.children[DRAWN_PATTERNS.findIndex((ptrn) => ptrn === pattern)].style.backgroundColor = '#4F3737';
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
