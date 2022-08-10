var DRAWN_PATTERNS = Array();

export default DRAWN_PATTERNS;
export function set_DRAWN_PATTERNS(values) {
    DRAWN_PATTERNS.length = 0;
    values.forEach((values) => {
        DRAWN_PATTERNS.push(values);
    });
}
