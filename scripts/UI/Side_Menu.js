import { pattern_panel } from './Pattern_Panel.js';
import { stack_panel } from './Stack_Panel.js';

let pattern_menu_button = document.getElementById('pattern_menu_button');
let stack_menu_button = document.getElementById('stack_menu_button');

pattern_menu_button.addEventListener('click', function (event) {
    pattern_panel.parentElement.style.display = '';
    pattern_panel.style.display = 'flex';
    pattern_menu_button.style.backgroundColor = 'var(--primary_medium)';
    pattern_menu_button.children[0].style.color = 'rgba(255, 255, 255, 0.85)';
    if (!event.shiftKey) {
        stack_panel.style.display = 'none';
        stack_menu_button.children[0].style.color = '';
        stack_menu_button.style.backgroundColor = 'transparent';
    }
});

stack_menu_button.addEventListener('click', function (event) {
    stack_panel.style.display = 'flex';
    stack_menu_button.style.backgroundColor = 'var(--primary_medium)';
    stack_menu_button.children[0].style.color = 'rgba(255, 255, 255, 0.85)';
    if (!event.shiftKey) {
        pattern_panel.style.display = 'none';
        pattern_menu_button.style.backgroundColor = 'transparent';
        pattern_menu_button.children[0].style.color = '';
    }
});

pattern_menu_button.style.backgroundColor = 'var(--primary_medium)';
pattern_menu_button.children[0].setAttribute('style', 'fill-opacity: 1');
