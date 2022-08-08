//color constants
const ACCENT1 = '#BAC5E2';
const ACCENT2 = '#D8B8E0';
const ACCENT2_SATURATED = '#D695E5';
const ACCENT3 = '#e0b8b8';

class Path {
    constructor(point1, point2, midpoint_count = 5) {
        this.point1 = point1;
        this.point2 = point2;
        this.color = ACCENT2;
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
                var segment = new Path(this.point1, point, 0);
            } else {
                var segment = new Path(sub_segments[i - 1].point2, point, 0);
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
        this.sub_segment_offset.forEach((segment) => {
            segment.color = color;
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

class Point {
    constructor(x, y, max_radius = 8, color = ACCENT1) {
        this.x = x;
        this.y = y;
        this.max_radius = max_radius;
        this.radius = max_radius;
        this.used = false;
        this.color = color;
    }
    draw() {
        var r = this.radius * SCALE;
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
//---canvas---
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
const grid = Array(HEIGHT + 1)
    .fill()
    .map(grid_row);

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
    redraw_canvas()
});

var DRAWN_PATTERNS = Array();

let PATTERNS;
//pattern list
$.getJSON('pattern_registry.json', function (data) {
    PATTERNS = data;
});

//zoom buttons
document.getElementById('zoom_in').addEventListener('mousedown', (event) => {
    SCALE += 0.1
    redraw_canvas()
    console.log(SCALE);
});

document.getElementById('zoom_out').addEventListener('mousedown', (event) => {
    SCALE -= 0.1
    redraw_canvas()
    console.log(SCALE);
});

//iota data types
class vector {
    constructor(v1, v2, v3) {
        this.value = [n1, n2, n3];
    }
}
class number {
    constructor(value) {
        this.value = value;
    }
}
class entity {
    constructor(value) {
        this.value = value;
    }
}
class null_ {
    constructor() {
        this.value = null;
    }
}
class pattern_ {
    constructor(value) {
        this.value = value;
    }
}
class list {
    constructor(value) {
        this.value = value;
    }
}

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
        pattern.gradient_highlight_animation_step(ACCENT1, ACCENT2_SATURATED);
    });
    update_paths();
    update_grid();
}

function update_grid() {
    var ypos = (canvas.height - ((SPACING * Math.sqrt(3)) / 2) * HEIGHT) / 2;
    grid.forEach((r, i) => {
        var xpos = (canvas.width - SPACING * WIDTH) * 1.5 + (SPACING / 2) * (i % 2);
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
        ctx.strokeStyle = ACCENT2;
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

class Pattern {
    constructor(command, str, outputs, heading, paths) {
        this.command = command;
        this.str = str;
        this.outputs = outputs;
        if (str in PATTERNS) this.inputs = PATTERNS[str].inputs;
        this.heading = heading;
        this.paths = paths;
        this.highlight_animation_step_index = -25;
        this.paths[0].point1.color = ACCENT2_SATURATED;
        this.paths[this.paths.length - 1].point2.color = ACCENT2_SATURATED;
    }

    gradient_highlight_animation_step(color1, color2) {
        let path_index = Math.floor(this.highlight_animation_step_index * 0.01);
        let highlighted_path;
        if (path_index === this.paths.length + 1) {
            this.highlight_animation_step_index = -25;
            path_index = 0;
            highlighted_path = this.paths[0];
        } else if (path_index === -1) {
            console.log(path_index);
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
            grad.addColorStop(0, ACCENT2);
            grad.addColorStop(1, color1);
            //highlighted_path.color = grad
            this.paths.forEach((path) => {
                path.color = grad;
            });
        } else if (path_index === this.paths.length) {
            console.log(path_index);
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
            grad.addColorStop(0, ACCENT2);
            grad.addColorStop(1, color1);
            //highlighted_path.color = grad
            this.paths.forEach((path) => {
                path.color = grad;
            });
        } else {
            console.log(path_index);
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
            grad.addColorStop(0, color2);
            grad.addColorStop(1, color1);
            //highlighted_path.color = grad
            this.paths.forEach((path) => {
                path.update_color(grad);
            });
        }
        if (path_index > this.paths.length - 2) {
            this.paths[0].color = ACCENT1;
        } else if (path_index < 1) {
            this.paths.at(-1).color = ACCENT1;
        }
        this.highlight_animation_step_index += 1;
    }
}
function detect_pattern() {
    if (active_path.length < 1) {
        active_path = [];
        return;
    }
    let heading = determine_angle(active_path[0]);
    var str = '';
    for (let i = 0; i < active_path.length - 1; i++) {
        const segment = active_path.at(i);
        segment.point1.used = true;
        segment.point2.used = true;
        let angle = determine_angle(segment, active_path.at(i + 1));
        switch (angle) {
            case -60:
                str += 'q';
                break;
            case 60:
                str += 'e';
                break;
            case -120:
                str += 'a';
                break;
            case 120:
                str += 'd';
                break;
            case 0:
                str += 'w';
                break;
            default:
                break;
        }
    }
    //let pattern = Object.keys(PATTERNS).find((key) => PATTERNS[key] === str);
    let pattern;
    let outputs = [];
    let value;
    if (str.startsWith('aqaa')) {
        value = 0;
        for (let i = 4; i < str.length; i++) {
            const letter = str[i];
            switch (letter) {
                case 'w':
                    value += 1;
                    break;
                case 'q':
                    value += 5;
                    break;
                case 'e':
                    value += 10;
                    break;
                case 'a':
                    value *= 2;
                    break;
                case 'd':
                    value /= 2;
                    break;
                default:
                    break;
            }
        }
        pattern = 'number';
        outputs.unshift(value);
    } else if (str.startsWith('dedd')) {
        value = 0;
        for (let i = 4; i < str.length; i++) {
            const letter = str[i];
            switch (letter) {
                case 'w':
                    value += 1;
                    break;
                case 'q':
                    value += 5;
                    break;
                case 'e':
                    value += 10;
                    break;
                case 'a':
                    value *= 2;
                    break;
                case 'd':
                    value /= 2;
                    break;
                default:
                    break;
            }
        }
        value *= -1;
        pattern = 'number';
        outputs.unshift(value);
    } else {
        try {
            pattern = PATTERNS[str]['command'];
            PATTERNS[str].outputs.forEach(function (output) {
                outputs.unshift(output[0]);
            });
        } catch (err) {
            pattern = undefined;
        }
    }
    if (pattern === undefined) {
        pattern = `garbage (${str})`;
        DRAWN_PATTERNS.push(new Pattern(pattern, str, outputs, heading, active_path));
        active_path.forEach((segment) => {
            segment.color = ACCENT2;
        });
    } else {
        DRAWN_PATTERNS.push(new Pattern(pattern, str, outputs, heading, active_path));
        active_path.forEach((segment) => {
            segment.color = ACCENT1;
        });
    }

    //push active path to drawn paths
    drawn_paths = drawn_paths.concat(active_path);
    active_path = [];
    add_pattern_to_panel(DRAWN_PATTERNS.at(-1));
    update_stack(DRAWN_PATTERNS.at(-1));
}

var pattern_panel = document.getElementById('pattern_panel');
var pattern_draggable_container = document.getElementById('pattern_draggable_container');

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
                    if (pnt.used === false && check_line_not_in_path([current_point, pnt], active_path)) {
                        active_path.push(new Path(current_point, pnt));
                        //pnt.used = true;
                        //current_point.used = true;
                        prev_point = current_point;
                        current_point = pnt;
                    }
                } else {
                    //pnt.used = false;
                    //current_point.used = false;

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
//clears all paths on canvas
function clear_paths() {
    drawn_paths.forEach(function (path) {
        path.point1.used = false;
        path.point2.used = false;
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

    for (let i = 1; i < offset_x_coords.length; i++) {
        let point1 = get_point_from_coords(offset_x_coords[i - 1] + grid[0][0].x, offset_y_coords[i - 1] + grid[0][0].y);
        let point2 = get_point_from_coords(offset_x_coords[i] + grid[0][0].x, offset_y_coords[i] + grid[0][0].y);
        point1.used = true;
        point2.used = true;
        drawn_paths.push(new Path(point1, point2, 5));
    }
    return y_ceiling;
}

//draws patterns from the pattern list in order (left to right, top to bottom)
function reorder_patterns() {
    clear_paths();
    let x_length = grid[0][0].x;
    let y_length = grid[0][0].y;
    let y_ceiling = 0;
    let y_ceiling_new = 0;
    DRAWN_PATTERNS.forEach(function (pattern) {
        let r = draw_pattern(pattern, y_ceiling);
        if (r == false) {
            y_ceiling = y_ceiling_new;
            r = draw_pattern(pattern, y_ceiling);
        }
        y_ceiling_new = r > y_ceiling_new ? r : y_ceiling_new;
    });
}

animate();

//---side menu--
let pattern_menu_button = document.getElementById('pattern_menu_button');
let stack_menu_button = document.getElementById('stack_menu_button');
let stack_panel = document.getElementById('stack_panel');

pattern_menu_button.style.backgroundColor = 'var(--primary_medium)';
pattern_menu_button.children[0].setAttribute('style', 'fill-opacity: 1');

pattern_menu_button.addEventListener('click', function (event) {
    pattern_panel.style.display = 'flex';
    pattern_menu_button.style.backgroundColor = 'var(--primary_medium)';
    pattern_menu_button.children[0].setAttribute('style', 'fill-opacity: 1');
    if (!event.shiftKey) {
        stack_panel.style.display = 'none';
        stack_menu_button.children[0].setAttribute('style', 'fill-opacity: 0.9');
        stack_menu_button.style.backgroundColor = 'transparent';
    }
});

stack_menu_button.addEventListener('click', function (event) {
    stack_panel.style.display = 'flex';
    stack_menu_button.style.backgroundColor = 'var(--primary_medium)';
    stack_menu_button.children[0].setAttribute('style', 'fill-opacity: 1');
    if (!event.shiftKey) {
        pattern_panel.style.display = 'none';
        pattern_menu_button.style.backgroundColor = 'transparent';
        pattern_menu_button.children[0].setAttribute('style', 'fill-opacity: 0.9');
    }
});

//---pattern panel---

let drag_container = dragula([pattern_draggable_container], {
    moves: function (el, container, handle) {
        let result = false;
        function get_parent(element, depth = 0) {
            if (depth > 5) {
                result = false;
                return;
            }
            if (element.classList.contains('move_button')) {
                result = true;
                return;
            } else {
                get_parent(element.parentElement, depth + 1);
            }
        }
        get_parent(handle);
        return result;
    },
});
drag_container.on('dragend', function (el) {
    let new_pattern_list = [];
    for (let i = 0; i < pattern_draggable_container.children.length; i++) {
        const element = pattern_draggable_container.children[i];
        new_pattern_list.push(DRAWN_PATTERNS[parseInt(element.getAttribute('data-index'))]);
        element.dataset.index = i;
    }
    DRAWN_PATTERNS = Array.from(new_pattern_list);
    reorder_patterns();
    re_simulate_stack();
});

function remove_pattern_from_panel(pattern_element) {
    DRAWN_PATTERNS.splice(parseInt(pattern_element.getAttribute('data-index')), 1);
    pattern_element.remove();
    for (let i = 0; i < pattern_draggable_container.children.length; i++) {
        pattern_draggable_container.children[i].dataset.index = i;
    }
    reorder_patterns();
    re_simulate_stack();
}

function add_pattern_to_panel(pattern) {
    let outer_box = document.createElement('div');
    outer_box.className = 'outer_box';
    outer_box.dataset.index = pattern_draggable_container.childElementCount;
    let inner_box = document.createElement('div');
    inner_box.className = 'inner_box';
    let x_button = document.createElement('div');
    x_button.className = 'x_button';
    x_button.innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10.98 10.98"><defs><style>.cls-1{opacity:0.51;}.cls-2{fill:none;stroke:#f5faff;stroke-miterlimit:10;stroke-width:3px;}</style></defs><g id="Layer_2" data-name="Layer 2"><g id="Code"><g class="cls-1"><line class="cls-2" x1="1.06" y1="1.06" x2="9.92" y2="9.92"/><line class="cls-2" x1="9.92" y1="1.06" x2="1.06" y2="9.92"/></g></g></g></svg>';
    let text = document.createElement('div');
    text.className = 'text';
    text.innerText = pattern.command;
    let move_button = document.createElement('div');
    move_button.className = 'move_button';
    move_button.innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 21.36 16.29"><g opacity="0.7"><line y1="14.79" x2="21.36" y2="14.79" fill="none" stroke="#f5faff" stroke-miterlimit="10" stroke-width="3"/><line y1="8.15" x2="21.36" y2="8.15" fill="none" stroke="#f5faff" stroke-miterlimit="10" stroke-width="3"/><line y1="1.5" x2="21.36" y2="1.5" fill="none" stroke="#f5faff" stroke-miterlimit="10" stroke-width="3"/></g></svg>';
    //add editable value if
    //outputs: "x type/x type"
    //is a number
    function add_field(name, value) {
        let form = document.createElement('form');
        let label = document.createElement('label');
        label.type = 'text';
        label.innerText = name;
        let input = document.createElement('input');
        input.value = value;

        form.appendChild(label);
        form.appendChild(input);
        outer_box.appendChild(form);
    }

    if (pattern.command === 'number') {
        add_field('value:', pattern.outputs[0]);
    } else if (pattern.str in PATTERNS) {
        PATTERNS[pattern.str].outputs.forEach(function (output) {
            if (output.length > 1) {
                add_field('result:', pattern.outputs[0]);
            }
        });
    }

    inner_box.appendChild(x_button);
    inner_box.appendChild(text);
    inner_box.appendChild(move_button);
    outer_box.appendChild(inner_box);
    pattern_draggable_container.appendChild(outer_box);
    x_button.addEventListener('mousedown', function () {
        remove_pattern_from_panel(x_button.parentElement.parentElement);
    });
}

let STACK = [];
class Iota {
    constructor(type, value) {
        this.type = type;
        this.value = value;
    }
}
//---the stack---
function re_simulate_stack() {
    STACK.length = 0;
    DRAWN_PATTERNS.forEach(function (pattern) {
        update_stack(pattern);
    });
}

function update_stack(pattern) {
    function check_matching_iotas(iota1, iota2) {
        let matching = false;
        if (Array.isArray(iota1)) {
            iota1.forEach(function (type) {
                if (iota2 === type) matching = true;
            });
        }

        if (Array.isArray(iota2)) {
            iota2.forEach(function (type) {
                if (iota1 === type) matching = true;
            });
        }
        return matching;
    }

    try {
        if (!(pattern.str in PATTERNS)) {
            //pattern does not exist
            if (pattern.str.startsWith('aqaa') || pattern.str.startsWith('dedd')) {
                STACK.unshift(new Iota('number', pattern.outputs[0]));
            } else {
                throw ['NoSuchPattern', pattern.str];
            }

            //check if there are enough inputs in the stack
        } else if (STACK.length >= PATTERNS[pattern.str]['inputs'].length) {
            //
            if (PATTERNS[pattern.str]['command'] === 'duplicate') {
                STACK.unshift(STACK[0]);
                //
            } else if (PATTERNS[pattern.str]['command'] === 'duplicate_n') {
                if (check_matching_iotas(STACK[0].type, PATTERNS[pattern.str]['inputs'].at(-1))) {
                    let num = STACK[0].value;
                    STACK.shift();
                    let copied_iota = STACK[0];
                    STACK.shift();
                    if (num >= 0) {
                        STACK = Array(num).fill(copied_iota).concat(STACK);
                    }
                } else {
                    throw ['IncorrectIota', pattern.str];
                }
                //
            } else if (PATTERNS[pattern.str]['command'] === 'stack_len') {
                STACK.unshift(new Iota('number', STACK.length));
                //
            } else if (PATTERNS[pattern.str]['command'] === 'swap') {
                let temp = STACK[1];
                STACK[1] = STACK[0];
                STACK[0] = temp;
                //
            } else if (PATTERNS[pattern.str]['command'] === 'fisherman') {
                let num = STACK[0].value;
                STACK.splice(0, 1);
                STACK.unshift(STACK[num - 1]);
                STACK.splice(num, 1);
                //
            } else {
                //take inputs from stack
                pattern.inputs.forEach((iota) => {
                    if (check_matching_iotas(STACK[0].type, iota)) {
                        STACK.shift();
                    } else {
                        throw ['IncorrectIota', pattern.str];
                    }
                });
                //add outputs to stack
                if (pattern.outputs == 0) {
                    STACK.unshift(new Iota(pattern.outputs[0], pattern.outputs[0]));
                } else {
                    pattern.outputs.forEach((iota) => {
                        STACK.unshift(new Iota(iota, pattern.outputs[0]));
                    });
                }
            }
        } else {
            throw ['NotEnoughIotas', pattern.str];
        }
    } catch (error) {
        console.warn(error);

        switch (error[0]) {
            case 'NotEnoughIotas':
                var garbages = Array(PATTERNS[pattern.str]['inputs'].length - STACK.length).fill(new Iota('garbage'));
                STACK = garbages.concat(STACK);
                break;
            case 'IncorrectIota':
                var garbages = [];
                PATTERNS[error[1]]['inputs'].forEach((iota) => {
                    if (!check_matching_iotas(STACK[0].type, iota)) {
                        STACK.shift();
                        garbages.unshift(new Iota('garbage'));
                    }
                });
                STACK = garbages.concat(STACK);
                break;
            case 'NoSuchPattern':
                STACK.unshift(new Iota('garbage'));
                break;

            default:
                break;
        }
    }

    //display stack in stack panel
    update_stack_panel();
}

const IOTA_COLOR_MAP = {
    pattern: '#354C3F',
    entity: '#354B4C',
    null: '#354C3F',
    hex: '#4B4C35',
    list: '#354C3F',
    vector: '#4F3737',
    number: '#4F3737',
};

function update_stack_panel() {
    var old_stack = stack_panel.querySelectorAll('.outer_box');
    old_stack.forEach((element) => {
        element.remove();
    });
    //delete old stack
    //add new stack
    STACK.forEach((iota, index) => {
        let outer_box = document.createElement('div');
        outer_box.className = 'outer_box';
        outer_box.style.backgroundColor = IOTA_COLOR_MAP[iota.type];
        let inner_box = document.createElement('div');
        inner_box.className = 'inner_box';
        let text = document.createElement('div');
        text.className = 'text';
        if (iota.value === undefined && typeof iota.type === 'string') {
            text.innerText = iota.type.charAt(0).toUpperCase() + iota.type.slice(1);
        } else {
            text.innerText = iota.value;
        }
        let index_display = document.createElement('div');
        index_display.className = 'index_display';
        index_display.innerText = index + 1;

        inner_box.appendChild(index_display);
        inner_box.appendChild(text);
        outer_box.appendChild(inner_box);
        stack_panel.appendChild(outer_box);
    });
}
