import * as color_consts from "/scripts/Colors.js"
import { SETTING_Highlight_Start_End_Points } from "../Settings.js";

import { mousepos, get_distance_between_points, SCALE, ctx } from "./Canvas.js";

class Point {
    constructor(x, y, max_radius = 8, color = color_consts.ACCENT1, start_or_end = false) {
        this.x = x;
        this.y = y;
        this.max_radius = max_radius;
        this.radius = max_radius;
        this.used = false;
        this.color = color;
        this.start_or_end = start_or_end;
    }

    draw() {
        var r = this.radius * SCALE;
        if (this.start_or_end && SETTING_Highlight_Start_End_Points) {
            r = 6 * SCALE;
        } else if (this.used) {
            r = 2.5 * SCALE;
        } else if (r < 0.4 && !this.used) {
            return;
        }
        ctx.fillStyle = this.color;
        //ctx.beginPath();
        //var circle = ctx.arc(this.x, this.y, r, 0, Math.PI * 2);
        ctx.beginPath();
        ctx.moveTo(this.x + r * Math.cos(0), this.y + r * Math.sin(0));

        for (var i = 1; i <= 6; i += 1) {
            ctx.lineTo(this.x + r * Math.cos((i * 2 * Math.PI) / 6), this.y + r * Math.sin((i * 2 * Math.PI) / 6));
        }
        ctx.fill();
        ctx.closePath();
    }
    get_distance(coord) {
        var dist = get_distance_between_points(this.x, coord[0], this.y, coord[1]);
        return dist;
    }
    calculate_radius_from_mouse_distance() {
        var r = (100 * 4) / this.get_distance(mousepos);
        if (r > this.max_radius) {
            r = this.max_radius;
        }
        return r;
    }
}

export default Point