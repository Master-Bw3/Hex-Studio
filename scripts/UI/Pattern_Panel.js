import add_pattern_from_command from '../Pattern/Add_Pattern_From_Command.js';
import drawn_patterns, { set_drawn_patterns } from '../Pattern/Drawn_Patterns.js';
import patterns_from_number from '../Pattern/Patterns_From_Number.js';
import { get_command_from_translation, PATTERNS, TRANSLATED_PATTERNS } from '../Pattern/Pattern_list.js';
import reorder_patterns from '../Pattern/Re_Order_Patterns.js';
import sig_from_command from '../Pattern/Sig_From_Command.js';
import update_pattern_value from '../Pattern/Update_Pattern_Value.js';
import { resimulate_stack } from '../Stack/Stack.js';
import tribute from './Pattern_Collection.js';

var pattern_panel = document.getElementById('pattern_panel');
var pattern_draggable_container = document.getElementById('pattern_draggable_container');

let drag_container = dragula([pattern_draggable_container], {
    moves: function (el, container, handle) {
        let result = false;
        function get_parent(element, depth = 0) {
            if (depth > 5) {
                result = false;
                return;
            }
            if (element.classList.contains('move_button')) {
                result = true;
                return;
            } else {
                get_parent(element.parentElement, depth + 1);
            }
        }
        get_parent(handle);
        return result;
    },
});
drag_container.on('dragend', function (el) {
    let new_pattern_list = [];
    for (let i = 0; i < pattern_draggable_container.children.length; i++) {
        const element = pattern_draggable_container.children[i];
        new_pattern_list.push(drawn_patterns[parseInt(element.getAttribute('data-index'))]);
        element.dataset.index = i;
    }
    set_drawn_patterns(Array.from(new_pattern_list));
    reorder_patterns();
    resimulate_stack();
});

function remove_pattern_from_panel(pattern_element) {
    drawn_patterns.splice(parseInt(pattern_element.getAttribute('data-index')), 1);
    pattern_element.remove();
    for (let i = 0; i < pattern_draggable_container.children.length; i++) {
        pattern_draggable_container.children[i].dataset.index = i;
    }
    reorder_patterns();
    resimulate_stack();
}

function add_pattern_to_panel(pattern) {
    let outer_box = document.createElement('div');
    outer_box.className = 'outer_box';
    outer_box.dataset.index = pattern_draggable_container.childElementCount;
    let inner_box = document.createElement('div');
    inner_box.className = 'inner_box';
    let x_button = document.createElement('div');
    x_button.className = 'x_button';
    x_button.innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10.98 10.98"><defs><style>.cls-1{opacity:0.51;}.cls-2{fill:none;stroke:#f5faff;stroke-miterlimit:10;stroke-width:3px;}</style></defs><g id="Layer_2" data-name="Layer 2"><g id="Code"><g class="cls-1"><line class="cls-2" x1="1.06" y1="1.06" x2="9.92" y2="9.92"/><line class="cls-2" x1="9.92" y1="1.06" x2="1.06" y2="9.92"/></g></g></g></svg>';
    let text = document.createElement('div');
    text.className = 'text';
    text.innerText = TRANSLATED_PATTERNS[pattern.str];
    let move_button = document.createElement('div');
    move_button.className = 'move_button';
    move_button.innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 21.36 16.29"><g opacity="0.7"><line y1="14.79" x2="21.36" y2="14.79" fill="none" stroke="#f5faff" stroke-miterlimit="10" stroke-width="3"/><line y1="8.15" x2="21.36" y2="8.15" fill="none" stroke="#f5faff" stroke-miterlimit="10" stroke-width="3"/><line y1="1.5" x2="21.36" y2="1.5" fill="none" stroke="#f5faff" stroke-miterlimit="10" stroke-width="3"/></g></svg>';
    //add editable value if
    //outputs: "x type/x type"
    //is a number
    function add_field(name, iota) {
        let form = document.createElement('div');
        form.className = 'values';
        let label = document.createElement('label');
        label.type = 'text';
        label.innerText = name;
        let input = document.createElement('input');
        input.value = iota.value;

        input.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                update_pattern_value(event.target.parentElement.parentElement.getAttribute('data-index'), event.target.value);
            }
        });

        form.appendChild(label);
        form.appendChild(input);
        outer_box.appendChild(form);
    }

    if (pattern.command === 'number') {
        add_field('value:', pattern.outputs[0]);
    } else if (!pattern.command.startsWith('garbage') && PATTERNS[pattern.str]['editable'] == true) {
        PATTERNS[pattern.str].outputs.forEach(function (output) {
            if (output.length > 1) {
                add_field('result:', pattern.outputs[0]);
            }
        });
    }

    inner_box.appendChild(x_button);
    inner_box.appendChild(text);
    inner_box.appendChild(move_button);
    outer_box.appendChild(inner_box);
    pattern_draggable_container.appendChild(outer_box);
    x_button.addEventListener('mousedown', function () {
        remove_pattern_from_panel(x_button.parentElement.parentElement);
    });
    pattern_panel.scrollTop = pattern_panel.scrollHeight - pattern_panel.offsetHeight;
    //$(pattern_panel).animate({ scrollTop: pattern_panel.scrollHeight - pattern_panel.offsetHeight }, 100);
}
let add_pattern_input = document.getElementById('add_pattern_input');
let add_pattern_button = document.getElementById('add_pattern_button');

function blink_red(elm) {
    elm.classList.add('blink');
    elm.style.backgroundColor = '#4F3737';
    setTimeout(() => {
        elm.style.backgroundColor = '';
        setTimeout(() => {
            elm.classList.remove('blink');
        }, 1000);
    }, 1000);
}

add_pattern_button.addEventListener('click', function (event) {
    let inputs = multiline_mode ? add_pattern_multiline_input.value.split('\n') : [add_pattern_input.value];
    inputs = inputs.filter((input) => input !== '');

    let invalid_inputs = inputs.filter((elm) => !(get_command_from_translation(elm) || (!isNaN(elm) && elm !== '')));
    if (multiline_mode && invalid_inputs.length > 0) {
        blink_red(document.getElementById('add_pattern'));
        console.log(invalid_inputs);
        return;
    }

    for (let i = 0; i < inputs.length; i++) {
        let input = inputs[i];
        if (get_command_from_translation(input) !== false) {
            input = get_command_from_translation(input);
            add_pattern_from_command(input);
            resimulate_stack();
        } else if (!isNaN(input) && input !== '') {
            let patterns = patterns_from_number(parseFloat(input));
            set_drawn_patterns(drawn_patterns.concat(patterns));
            patterns.forEach((pat) => {
                add_pattern_to_panel(pat);
            });
            reorder_patterns();
            resimulate_stack();
        } else {
            blink_red(document.getElementById('add_pattern'));
        }
    }
    add_pattern_input.value = '';
    add_pattern_multiline_input.value = '';
});

add_pattern_input.addEventListener('keypress', function (event) {
    let input = add_pattern_input.value;
    if (event.key === 'Enter') {
        if (get_command_from_translation(input) !== false) {
            input = get_command_from_translation(input);
            add_pattern_from_command(input);
            resimulate_stack();
        } else if (!isNaN(add_pattern_input.value) && input !== '') {
            let patterns = patterns_from_number(parseFloat(input));
            set_drawn_patterns(drawn_patterns.concat(patterns));
            patterns.forEach((pat) => {
                add_pattern_to_panel(pat);
            });
            reorder_patterns();
            resimulate_stack();
        } else {
            blink_red(document.getElementById('add_pattern'));
        }
        add_pattern_input.value = '';
    }
});

let add_pattern_multiline_input = document.createElement('div');
add_pattern_multiline_input.contentEditable = true;
add_pattern_multiline_input.classList.add('mutliline_input');
let multiline_mode = false;
document.getElementById('paragraph_dropdown').addEventListener('click', function (event) {
    if (!multiline_mode) {
        add_pattern_multiline_input.value = add_pattern_input.value;
        add_pattern_input.replaceWith(add_pattern_multiline_input);
        multiline_mode = true;
    } else {
        add_pattern_input.value = add_pattern_multiline_input.value.split('\n')[0];
        add_pattern_multiline_input.replaceWith(add_pattern_input);
        multiline_mode = false;
    }
});

function getCaretCoordinates() {
    let x = 0,
        y = 0;
    const isSupported = typeof window.getSelection !== 'undefined';
    if (isSupported) {
        const selection = window.getSelection();
        if (selection.rangeCount !== 0) {
            const range = selection.getRangeAt(0).cloneRange();
            range.collapse(true);
            const rect = range.getClientRects()[0];
            if (rect) {
                x = rect.left;
                y = rect.top;
            }
        }
    }
    return { x, y };
}

function set_autocomplete_pos(event) {
    const menu_detector = setInterval(() => {
        if (tribute.menu !== undefined) {
            clearInterval(menu_detector);
            
            //clear formatting on pasted text
            for (let index = 0; index < event.target.childElementCount; index++) {
                const child = event.target.children[index];
                child.style.cssText = '';
            }

            document.querySelector(':root').style.setProperty('--tribute-container-top', getCaretCoordinates()['y'] + 20 + 'px');
            document.querySelector(':root').style.setProperty('--tribute-container-left', getCaretCoordinates()['x'] + 'px');
        }
    }, 0.01);
}
//I swear this is just a temporary solution
add_pattern_multiline_input.addEventListener('keydown', set_autocomplete_pos);
add_pattern_input.addEventListener('keydown', set_autocomplete_pos);


tribute.attach(add_pattern_input);
tribute.attach(add_pattern_multiline_input);

export {
    add_pattern_to_panel,
    pattern_panel,
    remove_pattern_from_panel,
    pattern_draggable_container,
    add_pattern_input,
    add_pattern_multiline_input as add_pattern_textarea,
};
