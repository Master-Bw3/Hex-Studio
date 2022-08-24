import {PATTERNS, TRANSLATED_PATTERNS} from '../Pattern/Pattern_list.js';
import { add_pattern_input, add_pattern_textarea } from './Pattern_Panel.js';

/* let datalist = document.getElementById('patterns_list');
for (var key in PATTERNS) {
    var command = PATTERNS[key]['command'];
    let option = document.createElement('option');
    option.innerText = command;
    if (!(command === 'num/positive' || command === 'num/negative')) {
        datalist.appendChild(option);
    }
} */

let collection = [];
for (var key in TRANSLATED_PATTERNS) {
    var command = TRANSLATED_PATTERNS[key];
    let option = document.createElement('option');
    option.innerText = command;
    if (!(command === 'num/positive' || command === 'num/negative')) {
        collection.push({ key: command, value: command});
    }
}

let tribute = new Tribute({
    menuItemLimit: 3,
    noMatchTemplate: "",
    autocompleteMode: true,
    replaceTextSuffix: '\n\n',
    positionMenu: false,
    menuShowMinLength: 1,
    values: collection,
});



export default tribute;
