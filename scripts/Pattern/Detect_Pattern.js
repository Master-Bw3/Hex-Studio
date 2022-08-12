import * as color_consts from '../Colors.js';
import { active_path, current_point, determine_angle, drawn_paths, set_active_path, set_drawn_paths } from '../Hex_Grid/Canvas.js';
import Iota from '../Stack/Iota_Class.js';
import { update_stack } from '../Stack/Stack.js';
import { add_pattern_to_panel } from '../UI/Pattern_Panel.js';
import drawn_patterns from './Drawn_Patterns.js';
import Pattern from './Pattern_Class.js';
import PATTERNS from './Pattern_list.js';


function detect_pattern() {
    if (active_path.length == 0) {
        current_point.color = color_consts.ACCENT1;
        return;
    }
    let heading = determine_angle(active_path[0]);
    var str = '';
    for (let i = 0; i < active_path.length; i++) {
        const segment = active_path.at(i);
        segment.point1.used = true;
        segment.point2.used = true;
        if (i < active_path.length - 1) {
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
    }
    //let pattern = Object.keys(PATTERNS).find((key) => PATTERNS[key] === str);
    let pattern;
    let outputs = [];
    let value;
    if (str.startsWith('aqaa') || str.startsWith('dedd')) {
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
        if (str.startsWith('dedd')) value *= -1
        outputs.unshift(new Iota("number", value));
    } else if (str === 'qqqqq') {
        pattern = 'const [0,0,0]';
        value = [0, 0, 0];
        outputs.unshift(new Iota("vector", value));
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
        drawn_patterns.push(new Pattern(pattern, str, outputs, heading, active_path));
        active_path.forEach((segment) => {
            segment.color = color_consts.ACCENT2;
        });
    } else {
        drawn_patterns.push(new Pattern(pattern, str, outputs, heading, active_path));
        active_path.forEach((segment) => {
            segment.color = color_consts.ACCENT1;
        });
    }

    //push active path to drawn paths
    set_drawn_paths(drawn_paths.concat(active_path));
    set_active_path([]);
    add_pattern_to_panel(drawn_patterns.at(-1));
    update_stack(drawn_patterns.at(-1));
    console.log(drawn_patterns.at(-1))
}

export default detect_pattern;
