function check_equality(iota1, iota2) {
    const TOLERANCE = 0.0001;
    if (iota1.type === 'hexpattern' && iota2.type === 'hexpattern') {
        return iota1.value === iota2.value;
    } else if (iota1.type === 'number' && iota2.type === 'number') {
        return Math.abs(iota1.value - iota2.value) < TOLERANCE;
    } else if (iota1.type === 'vector' && iota2.type === 'vector') {
        return iota1.value.every((component, i) => {
            return Math.abs(component - iota2.value[i]) < TOLERANCE;
        });
    } else if (iota1.type === 'hexpatternlist' && iota2.type === 'hexpatternlist') {
        return iota1.value.every((hexpattern, i) => {
            return hexpattern === iota2.value[i];
        });
    } else if (iota1.type === 'entity' && iota2.type === 'entity') {
        return iota1.value === iota2.value;
        //this should also return true of both values are undefined
    } else {
        //to catch anything else, like null == null
        return iota1.value === iota2.value;
    }
}
export default check_equality