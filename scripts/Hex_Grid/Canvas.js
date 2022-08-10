import * as color_consts from '../Colors.js';
import Point from './Point_Class.js';
import Path from './Path_Class.js';
import DRAWN_PATTERNS from '../Pattern/Drawn_Patterns.js';
import detect_pattern from '../Pattern/Detect_Pattern.js';

const canvas = document.querySelector('canvas');

canvas.width = window.innerWidth - 400;
canvas.height = window.innerHeight - 100;
let SCALE = 1;
let SPACING = 100 * SCALE;
let WIDTH = parseInt(canvas.width / SPACING);
let HEIGHT = parseInt(canvas.height / ((SPACING * Math.sqrt(3)) / 2));

const grid_row = () =>
    Array(WIDTH)
        .fill()
        .map((u) => new Point());
const grid = Array(HEIGHT).fill().map(grid_row);

function redraw_canvas() {
    SPACING = 100 * SCALE;
    canvas.width = window.innerWidth - 400;
    canvas.height = window.innerHeight - 100;
    WIDTH = parseInt(canvas.width / SPACING);
    HEIGHT = parseInt(canvas.height / ((SPACING * Math.sqrt(3)) / 2));
    while (HEIGHT > grid.length) {
        for (let i = 0; i < HEIGHT - grid.length; i++) {
            grid.push(grid_row());
        }
    }
    while (WIDTH > grid[0].length) {
        for (let i = 0; i < grid.length; i++) {
            for (let i1 = 0; i1 < WIDTH - grid[i].length; i1++) {
                grid[i].push(new Point());
            }
        }
    }
    setTimeout(() => {
        drawn_paths.forEach((path) => {
            path.regen_sub_segments();
        });
    }, 15);
}

window.addEventListener('resize', function (event) {
    redraw_canvas();
});

var ctx = canvas.getContext('2d');
var mousepos = [-500, -500];
addEventListener('mousemove', (event) => {
    if (drawing === true) {
        detect_point_hover();
    }
    let rect = canvas.getBoundingClientRect();
    mousepos = [event.clientX - rect.left, event.clientY - rect.top];
});

function get_distance_between_points(x1, x2, y1, y2) {
    var dist = Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
    return dist;
}

function animate() {
    requestAnimationFrame(animate);
    ctx.fillStyle = '#292A2B';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    DRAWN_PATTERNS.forEach((pattern) => {
        pattern.gradient_highlight_animation_step(color_consts.ACCENT1, color_consts.ACCENT2_SATURATED);
    });
    update_paths();
    update_grid();
}

function update_grid() {
    var ypos = (canvas.height - ((SPACING * Math.sqrt(3)) / 2) * (HEIGHT - 1)) / 2;
    grid.forEach((r, i) => {
        var xpos = (canvas.width - SPACING * (WIDTH - 0.5)) / 2 + (SPACING / 2) * (i % 2);
        r.forEach((pnt) => {
            pnt.x = xpos;
            pnt.y = ypos;
            pnt.radius = pnt.calculate_radius_from_mouse_distance();

            pnt.draw();
            xpos += SPACING;
        });
        ypos += (SPACING * Math.sqrt(3)) / 2;
    });
}

function update_paths() {
    //dragged path
    if (drawing === true) {
        ctx.beginPath();
        ctx.strokeStyle = color_consts.ACCENT2;
        ctx.lineWidth = 5 * SCALE;
        ctx.moveTo(current_point.x, current_point.y);
        ctx.lineTo(mousepos[0], mousepos[1]);
        ctx.stroke();
    }
    //active paths
    active_path.forEach((path) => {
        path.draw();
    });
    //drawn paths
    drawn_paths.forEach((path) => {
        path.draw();
    });
}
var drawing = false;
var current_point;
var prev_point;
function detect_point_clicked() {
    grid.forEach((row) => {
        row.forEach((pnt) => {
            var dist = pnt.get_distance(mousepos);
            if (dist <= SPACING / 2 && pnt.used === false) {
                drawing = true;
                pnt.color = color_consts.ACCENT2;
                current_point = pnt;
            }
        });
    });
}

function determine_angle(line1, line2) {
    let pnt1 = line1.point1;
    let pnt2 = line1.point2;

    if (line2 === undefined) {
        //returns heading of first segment
        let heading = Math.atan2(pnt2.y - pnt1.y, pnt2.x - pnt1.x) * -1;
        return heading;
    }

    let pnt3 = line2.point2;

    let line1_x_dist = pnt2.x - pnt1.x;
    let line1_y_dist = pnt1.y - pnt2.y;
    let line2_x_dist = pnt3.x - pnt2.x;
    let line2_y_dist = pnt2.y - pnt3.y;

    let line1_magnitude = get_distance_between_points(pnt1.x, pnt2.x, pnt1.y, pnt2.y);
    let line2_magnitude = get_distance_between_points(pnt2.x, pnt3.x, pnt2.y, pnt3.y);
    let dot_product = line1_x_dist * line2_x_dist + line1_y_dist * line2_y_dist;

    let angle = Math.acos(dot_product / (line1_magnitude * line2_magnitude));
    angle = Math.round((angle * 180) / Math.PI); //convert to degrees for readability
    let position = (pnt2.x - pnt1.x) * (pnt3.y - pnt1.y) - (pnt2.y - pnt1.y) * (pnt3.x - pnt1.x) > 0; //determe whether point 3 is to the left or right of line 1
    angle *= position ? 1 : -1; //make angle negetive if to the left

    return angle;
}

function detect_point_hover() {
    grid.forEach((row) => {
        row.forEach((pnt) => {
            var dist = pnt.get_distance(mousepos);
            if (
                dist <= SPACING / 2 &&
                pnt != current_point &&
                get_distance_between_points(pnt.x, current_point.x, pnt.y, current_point.y) <= SPACING * 1.5
            ) {
                if (pnt != prev_point) {
                    if (pnt.used != true && check_line_not_in_path([current_point, pnt], active_path)) {
                        active_path.push(new Path(current_point, pnt));
                        //pnt.used = true;
                        //current_point.used = true;
                        prev_point = current_point;
                        current_point = pnt;
                    }
                } else {
                    //pnt.used = false;
                    //current_point.used = false;
                    let pnt_not_in_path = true;
                    for (let index = 0; index < active_path.length - 1; index++) {
                        const path = active_path[index];
                        if (current_point == path.point1 || current_point == path.point2) {
                            pnt_not_in_path = false;
                            break;
                        }
                    }

                    if (pnt_not_in_path == true) current_point.color = color_consts.ACCENT1;

                    active_path.pop();
                    current_point = prev_point;
                    if (active_path.length > 0) {
                        prev_point = active_path.at(-1).point1;
                    } else {
                        prev_point = undefined;
                    }
                }
            }
        });
    });
}

canvas.addEventListener('mousedown', (event) => {
    detect_point_clicked();
});
addEventListener('mouseup', (event) => {
    if (drawing === true) {
        detect_pattern(), (drawing = false);
    }
});

var active_path = Array();
var drawn_paths = Array();

function check_line_not_in_path(line, path) {
    let result = true;
    path = [...path];
    path.pop();
    path.forEach((l) => {
        if (line[0] == l.point1 || line[0] == l.point2) {
            if (line[1] == l.point1 || line[1] == l.point2) {
                result = false;
            }
        }
    });
    return result;
}

//clears all paths on canvas
function clear_paths() {
    drawn_paths.forEach(function (path) {
        path.point1.start_or_end = false;
        path.point1.used = false;
        path.point1.color = color_consts.ACCENT1;
        path.point2.start_or_end = false;
        path.point2.used = false;
        path.point2.color = color_consts.ACCENT1;
    });
    drawn_paths.length = 0;
}

function get_point_from_coords(x, y) {
    let point;
    grid.forEach((row) => {
        row.forEach((pnt) => {
            var dist = pnt.get_distance([x, y]);
            if (dist < 2) {
                point = pnt;
            }
        });
    });
    return point;
}

//draws a pattern from its signature
function draw_pattern(pattern, y_ceiling) {
    let x = SPACING / 2,
        y = y_ceiling;
    let angle = pattern.heading,
        magnitude = SPACING,
        x_coords = [x],
        y_coords = [y],
        new_x = x,
        new_y = y;
    //first line
    new_x += magnitude * Math.cos(angle);
    x_coords.push(new_x);
    new_y += magnitude * Math.sin(angle) * -1;
    y_coords.push(new_y);

    for (let i = 0; i < pattern.str.length; i++) {
        const letter = pattern.str[i];
        switch (letter) {
            case 'q':
                angle += 1.0472;
                break;
            case 'e':
                angle -= 1.0472;
                break;
            case 'a':
                angle += 2.0944;
                break;
            case 'd':
                angle -= 2.0944;
                break;
            case 'w':
                angle += 0;
            default:
                break;
        }
        new_x += magnitude * Math.cos(angle);
        x_coords.push(new_x);
        new_y += magnitude * Math.sin(angle) * -1;
        y_coords.push(new_y);
    }
    let offset_x_coords = x_coords,
        offset_y_coords = y_coords;

    //until y is valid, offset shape by one row
    let index = 0;
    let y_topmost = [offset_y_coords[0], 0];
    for (let i = 0; i < offset_y_coords.length; i++) {
        const coord = offset_y_coords[i];
        if (coord < y_topmost[0]) y_topmost = [coord, i];
    }

    for (let i = 0; i < offset_y_coords.length; i++) {
        offset_y_coords[i] += y_topmost[0] * -1 + y_ceiling;
    }

    //until x is valid, offset shape by one collumn
    y_ceiling =
        offset_y_coords.reduce(function (accumulatedValue, currentValue) {
            return Math.max(accumulatedValue, currentValue);
        }) +
        (SPACING * Math.sqrt(3)) / 2;

    function all_points_valid() {
        for (let i = 0; i < offset_x_coords.length; i++) {
            if (!get_point_from_coords(offset_x_coords[i] + grid[0][0].x, offset_y_coords[i] + grid[0][0].y)) {
                return false;
            } else if (get_point_from_coords(offset_x_coords[i] + grid[0][0].x, offset_y_coords[i] + grid[0][0].y).used == true) {
                return false;
            }
        }
        return true;
    }

    index = 0;
    while (true) {
        index += 1;
        if (index > grid[0].length * 2) {
            return false;
        }
        let x_leftmost = [offset_x_coords[0], 0];
        for (let i = 0; i < offset_x_coords.length; i++) {
            const coord = offset_x_coords[i];
            if (coord < x_leftmost[0]) x_leftmost = [coord, i];
        }

        if (!all_points_valid()) {
            for (let i = 0; i < offset_x_coords.length; i++) {
                //offset_y_coords[i] += y_leftmost - y;
                offset_x_coords[i] += SPACING / 2;
            }
        } else {
            break;
        }
    }

    let pattern_path = [];
    for (let i = 1; i < offset_x_coords.length; i++) {
        let point1 = get_point_from_coords(offset_x_coords[i - 1] + grid[0][0].x, offset_y_coords[i - 1] + grid[0][0].y);
        let point2 = get_point_from_coords(offset_x_coords[i] + grid[0][0].x, offset_y_coords[i] + grid[0][0].y);
        point1.used = true;
        point2.used = true;
        pattern_path.push(new Path(point1, point2, 5));
    }
    drawn_paths = drawn_paths.concat(pattern_path);
    pattern.paths = pattern_path;
    pattern.update_colors();
    return y_ceiling;
}
export {
    canvas,
    grid,
    SCALE,
    SPACING,
    WIDTH,
    HEIGHT,
    redraw_canvas,
    animate,
    get_distance_between_points,
    prev_point,
    detect_point_clicked,
    mousepos,
    ctx,
    active_path,
    current_point,
    determine_angle,
    drawn_paths,
    clear_paths,
    draw_pattern
};
export function set_drawn_paths(value) {
    drawn_paths = value;
}
export function set_active_path(value) {
    active_path = value;
}
export function set_SCALE(value) {
    SCALE = value;
}

