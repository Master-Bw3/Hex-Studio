import { redraw_canvas, SCALE, set_SCALE } from "../Hex_Grid/Canvas.js";

document.getElementById('zoom_in').addEventListener('mousedown', (event) => {
    set_SCALE(SCALE + 0.1);
    redraw_canvas();
});

document.getElementById('zoom_out').addEventListener('mousedown', (event) => {
    set_SCALE(SCALE - 0.1);
    redraw_canvas();
});