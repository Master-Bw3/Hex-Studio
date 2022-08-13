import * as color_consts from "../Colors.js"
import { ctx } from "../Hex_Grid/Canvas.js";
import PATTERNS from "./Pattern_list.js"
import {SETTING_Highlight_Start_End_Points, SETTING_Path_Animations} from "../Settings.js"

class Pattern {
    constructor(command, str, outputs, heading = 0, paths = []) {
        this.command = command;
        this.str = str;
        this.outputs = outputs; //outputs should be a list of iotas
        if (str in PATTERNS) this.inputs = PATTERNS[str].inputs;
        this.heading = heading;
        this.paths = paths;
        this.animate_gradient = SETTING_Path_Animations;
        this.highlight_animation_step_index = -25;
        this.animation_speed = 2.5;
        this.colors = this.set_color();
        if(this.paths.length > 0)  this.update_colors();
    }

    set_color() {
        if (this.command.startsWith('garbage')) {
            return [color_consts.ACCENT4, color_consts.ACCENT3];
        } else {
            return [color_consts.ACCENT2_SATURATED, color_consts.ACCENT1];
        }
    }

    update_colors() {
        this.paths.forEach((path) => {
            path.color = this.colors[1];
            path.point1.color = this.colors[1];
            path.point2.color = this.colors[1];
            path.gen_sub_segments();
        });
        this.paths[0].point1.start_or_end = true;
        this.paths[this.paths.length - 1].point2.start_or_end = true;

        if (SETTING_Highlight_Start_End_Points) {
            this.paths[0].point1.color = this.colors[0];
            this.paths[this.paths.length - 1].point2.color = this.colors[0];
        }
    }

    gradient_highlight_animation_step() {
        if (!this.animate_gradient) return this.update_colors();
        let path_index = Math.floor(this.highlight_animation_step_index * 0.01);
        let highlighted_path;
        if (path_index === this.paths.length + 1) {
            this.highlight_animation_step_index = -25;
            path_index = 0;
            highlighted_path = this.paths[0];
        } else if (path_index === -1) {
            highlighted_path = this.paths[path_index + 1];
            let rise = highlighted_path.point2.y - highlighted_path.point1.y;
            let run = highlighted_path.point2.x - highlighted_path.point1.x;
            let highlight_point_y =
                highlighted_path.point1.y +
                rise * (this.highlight_animation_step_index * 0.01 - Math.floor(this.highlight_animation_step_index * 0.01) - 1);
            let highlight_point_x =
                highlighted_path.point1.x +
                run * (this.highlight_animation_step_index * 0.01 - Math.floor(this.highlight_animation_step_index * 0.01) - 1);
            let grad = ctx.createRadialGradient(highlight_point_x, highlight_point_y, 5, highlight_point_x, highlight_point_y, 25);
            grad.addColorStop(0, this.colors[0]);
            grad.addColorStop(1, this.colors[1]);
            //highlighted_path.color = grad
            this.paths.forEach((path) => {
                path.color = grad;
            });
        } else if (path_index === this.paths.length) {
            highlighted_path = this.paths[path_index - 1];

            let rise = highlighted_path.point2.y - highlighted_path.point1.y;
            let run = highlighted_path.point2.x - highlighted_path.point1.x;
            let highlight_point_y =
                highlighted_path.point1.y +
                rise * (this.highlight_animation_step_index * 0.01 - Math.floor(this.highlight_animation_step_index * 0.01) + 1);
            let highlight_point_x =
                highlighted_path.point1.x +
                run * (this.highlight_animation_step_index * 0.01 - Math.floor(this.highlight_animation_step_index * 0.01) + 1);
            let grad = ctx.createRadialGradient(highlight_point_x, highlight_point_y, 5, highlight_point_x, highlight_point_y, 25);
            grad.addColorStop(0, this.colors[0]);
            grad.addColorStop(1, this.colors[1]);
            //highlighted_path.color = grad
            this.paths.forEach((path) => {
                path.color = grad;
            });
        } else {
            highlighted_path = this.paths[path_index];

            //max steps per sub_segment: 10
            //max steps per line: midpoints*10
            let rise = highlighted_path.point2.y - highlighted_path.point1.y;
            let run = highlighted_path.point2.x - highlighted_path.point1.x;
            let highlight_point_y =
                highlighted_path.point1.y +
                rise * (this.highlight_animation_step_index * 0.01 - Math.floor(this.highlight_animation_step_index * 0.01));
            let highlight_point_x =
                highlighted_path.point1.x +
                run * (this.highlight_animation_step_index * 0.01 - Math.floor(this.highlight_animation_step_index * 0.01));
            let grad = ctx.createRadialGradient(highlight_point_x, highlight_point_y, 5, highlight_point_x, highlight_point_y, 25);
            grad.addColorStop(0, this.colors[0]);
            grad.addColorStop(1, this.colors[1]);
            //highlighted_path.color = grad
            this.paths.forEach((path) => {
                path.update_color(grad);
            });
        }
        if (path_index > this.paths.length - 2) {
            this.paths[0].color = this.colors[1];
        } else if (path_index < 1) {
            this.paths.at(-1).color = this.colors[1];
        }
        this.highlight_animation_step_index += this.animation_speed;
    }
}

export default Pattern