import { pattern_panel } from "./Pattern_Panel.js";
import { stack_panel } from "./Stack_Panel.js";

setInterval(() => {
    if (pattern_panel.offsetHeight + pattern_panel.scrollTop < pattern_panel.scrollHeight) $('#add_pattern').addClass('stuck')
    else $('#add_pattern').removeClass('stuck')

    if (pattern_panel.scrollTop > 0) $(pattern_panel).children('.panel_title').addClass('stuck')
    else $(pattern_panel).children('.panel_title').removeClass('stuck')

    if (stack_panel.scrollTop > 0) $(stack_panel).children('.panel_title').addClass('stuck')
    else $(stack_panel).children('.panel_title').removeClass('stuck')
}, 20);
