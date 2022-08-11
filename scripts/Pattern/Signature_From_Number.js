function sig_from_number(value) {

    let str;
    if (value < 0) {
        str = 'dedd';
        value = Math.abs(value);
    } else {
        str = 'aqaa';
    }
    
    let remaining_value = value;
    str += 'eaqaa'.repeat(Math.floor(remaining_value / 100));
    remaining_value = remaining_value % 100;
    str += 'eeqaqee'.repeat(Math.floor(remaining_value / 75));
    remaining_value = remaining_value % 75;
    str += 'weaqqaqw'.repeat(Math.floor(remaining_value / 70));
    remaining_value = remaining_value % 70;
    str += 'qqdeea'.repeat(Math.floor(remaining_value / 50));
    remaining_value = remaining_value % 50;
    str += 'eae'.repeat(Math.floor(remaining_value / 30));
    remaining_value = remaining_value % 30;
    str += 'qeda'.repeat(Math.floor(remaining_value / 15));
    remaining_value = remaining_value % 15;
    str += 'qwddadaqad'.repeat(Math.floor(remaining_value / 8));
    remaining_value = remaining_value % 8;
    str += 'w'.repeat(Math.floor(remaining_value / 1));
    console.log(str)
    return str;
}
export default sig_from_number