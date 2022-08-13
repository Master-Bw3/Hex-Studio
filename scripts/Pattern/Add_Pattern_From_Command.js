import { resimulate_stack } from '../Stack/Stack.js';
import { add_pattern_to_panel } from '../UI/Pattern_Panel.js';
import drawn_patterns, { set_drawn_patterns } from './Drawn_Patterns.js';
import Pattern from './Pattern_Class.js';
import PATTERNS from './Pattern_list.js';
import reorder_patterns from './Re_Order_Patterns.js';
import sig_from_command from './Sig_From_Command.js';


function add_pattern_from_command(command) {
    let sig = sig_from_command(command)
    let pattern = new Pattern(command, sig, PATTERNS[sig]["outputs"].map(output => output[0]))
    set_drawn_patterns(drawn_patterns.concat([pattern]))
    add_pattern_to_panel(pattern)
    reorder_patterns()

}

export default add_pattern_from_command