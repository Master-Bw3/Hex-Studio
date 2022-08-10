import "https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js"


let PATTERNS
$.ajaxSetup({
    async: false
});
$.getJSON('pattern_registry.json', function (data) {
    PATTERNS = data
});
export default PATTERNS