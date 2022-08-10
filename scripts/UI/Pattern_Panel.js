import DRAWN_PATTERNS, { set_DRAWN_PATTERNS } from "../Pattern/Drawn_Patterns.js";
import PATTERNS from "../Pattern/Pattern_list.js";
import reorder_patterns from "../Pattern/Re_Order_Patterns.js";
import { resimulate_stack } from "../Stack/Stack.js";

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
        new_pattern_list.push(DRAWN_PATTERNS[parseInt(element.getAttribute('data-index'))]);
        element.dataset.index = i;
    }
    set_DRAWN_PATTERNS(Array.from(new_pattern_list))
    reorder_patterns();
    resimulate_stack();
});

function remove_pattern_from_panel(pattern_element) {
    DRAWN_PATTERNS.splice(parseInt(pattern_element.getAttribute('data-index')), 1);
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
    text.innerText = pattern.command;
    let move_button = document.createElement('div');
    move_button.className = 'move_button';
    move_button.innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 21.36 16.29"><g opacity="0.7"><line y1="14.79" x2="21.36" y2="14.79" fill="none" stroke="#f5faff" stroke-miterlimit="10" stroke-width="3"/><line y1="8.15" x2="21.36" y2="8.15" fill="none" stroke="#f5faff" stroke-miterlimit="10" stroke-width="3"/><line y1="1.5" x2="21.36" y2="1.5" fill="none" stroke="#f5faff" stroke-miterlimit="10" stroke-width="3"/></g></svg>';
    //add editable value if
    //outputs: "x type/x type"
    //is a number
    function add_field(name, value) {
        let form = document.createElement('form');
        let label = document.createElement('label');
        label.type = 'text';
        label.innerText = name;
        let input = document.createElement('input');
        input.value = value;

        form.appendChild(label);
        form.appendChild(input);
        outer_box.appendChild(form);
    }

    if (pattern.command === 'number') {
        add_field('value:', pattern.outputs[0]);
    } else if (!pattern.command.startsWith("garbage") && PATTERNS[pattern.str]["editable"] == true) {
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
}

export {add_pattern_to_panel}