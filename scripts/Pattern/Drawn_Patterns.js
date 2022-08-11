var drawn_patterns = Array();

export default drawn_patterns;
export function set_drawn_patterns(values) {
    drawn_patterns.length = 0;
    values.forEach((values) => {
        drawn_patterns.push(values);
    });
}
