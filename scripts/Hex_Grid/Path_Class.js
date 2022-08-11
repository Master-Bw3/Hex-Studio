import * as color_consts from "../Colors.js"
import { SCALE, ctx } from "./Canvas.js";
import Point from "./Point_Class.js";


class Path {
    constructor(point1, point2, midpoint_count = 5, color = color_consts.ACCENT2) {
        this.point1 = point1;
        this.point2 = point2;
        this.color = color;
        this.point1.color = this.color;
        this.point2.color = this.color;
        this.width = 5;
        this.midpoint_count = midpoint_count;
        this.sub_segments = this.gen_sub_segments();
        this.sub_segment_offset = this.gen_sub_segments();
    }

    gen_sub_segments() {
        if (this.midpoint_count === 0) {
            return [];
        }
        let rise = this.point2.y - this.point1.y;
        let run = this.point2.x - this.point1.x;
        let sub_segments = [];
        for (let i = 0; i < this.midpoint_count; i++) {
            let point = new Point(
                this.point1.x + (run * (i + 1)) / this.midpoint_count,
                this.point1.y + (rise * (i + 1)) / this.midpoint_count,
                this.width / 2,
                this.color
            );
            if (sub_segments.length === 0) {
                var segment = new Path(this.point1, point, 0, this.color);
            } else {
                var segment = new Path(sub_segments[i - 1].point2, point, 0, this.color);
            }
            sub_segments.push(segment);
        }
        //sub_segments.push(new Path(sub_segments[sub_segments.length].point2, this.point2, 0));
        return sub_segments;
    }

    regen_sub_segments() {
        this.sub_segments = this.gen_sub_segments();
        this.sub_segment_offset = this.gen_sub_segments();
    }

    update_color(color) {
        this.color = color;
        this.sub_segment_offset.forEach((segment, index) => {
            segment.color = color;
            if (segment.point1.start_or_end) {
                segment.point2.color = color;
            } else {
                segment.point1.color = color;
                segment.point2.color = color;
            }
        });
    }

    draw() {
        this.wiggle();
        this.sub_segment_offset.forEach((segment) => {
            segment.point2.draw();
            ctx.lineWidth = this.width * SCALE;
            ctx.strokeStyle = this.color;
            ctx.beginPath();
            ctx.moveTo(segment.point1.x, segment.point1.y);
            ctx.lineTo(segment.point2.x, segment.point2.y);
            ctx.stroke();
        });
    }

    wiggle() {
        let max_offset = 5 * SCALE;
        this.sub_segments.forEach((s, index) => {
            let segment = this.sub_segment_offset[index];
            if (index === this.sub_segments.length - 1) {
                return;
            } else {
                let newX = segment.point2.x + (Math.random() < 0.5 ? -1 : 1) * 0.6 * SCALE;
                if (newX <= s.point2.x + max_offset && newX >= s.point2.x - max_offset) {
                    segment.point2.x = newX;
                }
                let newY = segment.point2.y + (Math.random() < 0.5 ? -1 : 1) * 0.6 * SCALE;
                if (newY <= s.point2.y + max_offset && newY >= s.point2.y - max_offset) {
                    segment.point2.y = newY;
                }
            }
        });
    }
}

export default Path