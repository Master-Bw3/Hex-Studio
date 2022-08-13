import PATTERNS from "./Pattern_list.js";

function sig_from_command(command) {
    return Object.keys(PATTERNS).find(key => PATTERNS[key]["command"] === command);
}

export default sig_from_command