import { IOTA_COLOR_MAP } from "../Colors.js";
import { STACK } from "../Stack/Stack.js";

let stack_panel = document.getElementById('stack_panel');

function update_stack_panel() {
    var old_stack = stack_panel.querySelectorAll('.outer_box');
    old_stack.forEach((element) => {
        element.remove();
    });
    //delete old stack
    //add new stack
    STACK.forEach((iota, index) => {
        let outer_box = document.createElement('div');
        outer_box.className = 'outer_box';
        console.log(iota)
        outer_box.style.backgroundColor = IOTA_COLOR_MAP[iota.type];
        let inner_box = document.createElement('div');
        inner_box.className = 'inner_box';
        let text = document.createElement('div');
        text.className = 'text';
        if (iota.value === undefined && typeof iota.type === 'string') {
            text.innerText = iota.type.charAt(0).toUpperCase() + iota.type.slice(1);
        } else if (iota.value.hasOwnProperty('type') && iota.value.type == "vector") {
            text.innerText = `[${iota.value.value}]`
        } else {
            text.innerText = iota.value;
        }
        let index_display = document.createElement('div');
        index_display.className = 'index_display';
        index_display.innerText = index + 1;

        inner_box.appendChild(index_display);
        inner_box.appendChild(text);
        outer_box.appendChild(inner_box);
        stack_panel.appendChild(outer_box);
    });
}

export {update_stack_panel}