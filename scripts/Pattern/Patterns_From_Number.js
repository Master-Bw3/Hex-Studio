import Iota from "../Stack/Iota_Class.js";
import Pattern from "./Pattern_Class.js";
import sig_from_command from "./Sig_From_Command.js";

const NUMBER_SIGNATURES = {
    0: 'aqaa',
    1: 'aqaaw',
    2: 'aqaawa',
    3: 'aqaaedwd',
    4: 'aqaawaa',
    5: 'aqaaq',
    6: 'aqaaedwda',
    7: 'aqaawaq', //alternative: aqaaedwdaw
    8: 'aqaaedwdq',
    9: 'aqaawaaq',
    10: 'aqaae',
    100: 'aqaaeaqaa',
};

function patterns_from_number(value) {
    /* the factor algorithm: 
        if number is -1, multiply by -1
        split the number into the integer and the decimal (ex: 345.678 becomes [345,678])
        for integer:
            get factors of number
            generate one number pattern for each unique number in the list of factors
            raise each number to the number off occurances in the list of factors
            multiply them all together
        for decimal:
            get factors of number
            generate one number pattern for each unique number in the list of factors
            raise each number to the number off occurances in the list of factors
            multiply them all together
            divide by 10 to the power of the number of digits in the number
        add decimal and integer together
        if number was -1, multiply by -1
    */
    /* the chad base 10 algorithm:
        if number is -1, multiply by -1
        split the number into the integer and the decimal (ex: 345.678 becomes [345,678])
        for integer:
            for each digit:
                if digit is not 0:
                    draw pattern for digit
                    multiply digit by 10 to the power of the place value
            add results together
        for decimal:
            for each digit:
                if digit is not 0:
                    draw pattern for digit
                    multiply digit by 10 to the power of the place value
            add results together
        add decimal and integer together
        if number was -1, multiply by -1
        */



    let pattern_list = [];
    let negative = value < 0;
    if (negative) value *= -1;
    let int = Math.floor(value);
    let decimal = value % 1;

    function get_patterns(num) {
        let num_patterns = [];
        let digit_array = num.toString().split('').reverse();
        for (let index = 0; index < digit_array.length; index++) {
            const digit = +digit_array[index];
            const place = index + 1;
            if (digit !== 0) {
                num_patterns.push(new Pattern("number", NUMBER_SIGNATURES[digit], [new Iota("number", digit)]))
                switch (place) {
                    case 1:
                        break;
                    case 10:
                        num_patterns.push(new Pattern("number", NUMBER_SIGNATURES[10], [new Iota("number", digit)]))
                        num_patterns.push(new Pattern("mul_dot"), sig_from_command("mul_dot"));
                        break;
                    case 100:
                        num_patterns.push(new Pattern("number", NUMBER_SIGNATURES[100], [new Iota("number", digit)]))
                        num_patterns.push(new Pattern("mul_dot"), sig_from_command("mul_dot"));
                        break;
                    default:
                        num_patterns.push(new Pattern("number", NUMBER_SIGNATURES[10], [new Iota("number", digit)]))
                        num_patterns.push(new Pattern("number", NUMBER_SIGNATURES[place], [new Iota("number", digit)]))
                        num_patterns.push(new Pattern("pow_proj"), sig_from_command("pow_proj"));
                        num_patterns.push(new Pattern("mul_dot"), sig_from_command("mul_dot"));
                        break;
                }
            }
        }
        num_patterns = num_patterns.concat(new Array(digit_array.length-1).fill(new Pattern("add"), sig_from_command("add")))
        return num_patterns
    }

    int_patterns = get_patterns(int);
    decimal_patterns = get_patterns(decimal);

    return int_patterns
}

export default patterns_from_number
