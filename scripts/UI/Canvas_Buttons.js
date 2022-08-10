import { redraw_canvas, SCALE, set_SCALE } from "../Hex_Grid/Canvas.js";
import reorder_patterns from "../Pattern/Re_Order_Patterns.js";

document.getElementById('zoom_in').addEventListener('mousedown', (event) => {
    set_SCALE(SCALE + 0.1);
    redraw_canvas();
});

document.getElementById('zoom_out').addEventListener('mousedown', (event) => {
    set_SCALE(SCALE - 0.1);
    redraw_canvas();
});

document.getElementById('sort').addEventListener('mousedown', (event) => {
    reorder_patterns()
});