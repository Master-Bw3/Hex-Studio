import { resimulate_stack } from '../Stack/Stack.js';
import { add_pattern_to_panel, pattern_draggable_container, remove_pattern_from_panel } from '../UI/Pattern_Panel.js';
import drawn_patterns, { set_drawn_patterns } from './Drawn_Patterns.js';
import patterns_from_number from './Patterns_From_Number.js';
import reorder_patterns from './Re_Order_Patterns.js';

function update_pattern_value(index, value) {
    let pattern = drawn_patterns[index];
    if (!isNaN(parseFloat(value))) value = parseFloat(value);
    let patterns = [...drawn_patterns];
    pattern['outputs'][0].value = value;
    if (pattern['outputs'][0].type === 'number') {
        patterns.splice(index,1)
        remove_pattern_from_panel(pattern_draggable_container.children[index])
        let num_patterns = patterns_from_number(parseFloat(value))
        patterns = patterns.concat(num_patterns);
        num_patterns.forEach(pat => {
            add_pattern_to_panel(pat)
        });
        
    }
    set_drawn_patterns(patterns);

    reorder_patterns();
    resimulate_stack();
}

export default update_pattern_value;
