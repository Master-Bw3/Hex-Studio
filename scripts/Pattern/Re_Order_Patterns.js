import { clear_paths, grid, draw_pattern } from "../Hex_Grid/Canvas.js";
import drawn_patterns from "./Drawn_Patterns.js";

//draws patterns from the pattern list in order (left to right, top to bottom)
function reorder_patterns() {
    clear_paths();
    let y_ceiling = 0;
    let y_ceiling_new = 0;
    drawn_patterns.forEach(function (pattern) {
        let r = draw_pattern(pattern, y_ceiling);
        if (r == false) {
            y_ceiling = y_ceiling_new;
            r = draw_pattern(pattern, y_ceiling);
        }
        y_ceiling_new = r > y_ceiling_new ? r : y_ceiling_new;
    });
}

export default reorder_patterns