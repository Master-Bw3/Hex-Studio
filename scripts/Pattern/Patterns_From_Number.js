import Iota from '../Stack/Iota_Class.js';
import Pattern from './Pattern_Class.js';
import sig_from_command from './Sig_From_Command.js';

//TODO: add single-pattern numbers for 10,100, 25,50,75, 15,30,45,60,90,
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

    //if first digit is 0, do nothing different
    //if any other digit is 0, skip it

    let pattern_list = [];
    let negative = value < 0;
    if (negative) value *= -1;
    let int = Math.floor(value);
    let decimal = Number.parseInt(value.toString().split('.')[1]);

    function get_patterns(num) {
        let num_patterns = [];
        let digit_array = num.toString().split('').reverse();

        let nonzero_count = 0;
        for (let index = 0; index < digit_array.length; index++) {
            const digit = +digit_array[index];
            const place = index + 1;
            if (digit !== 0) nonzero_count += 1;
            if (place === 1 && !(digit === 0)) {
                num_patterns.push(new Pattern('number', NUMBER_SIGNATURES[digit], [new Iota('number', digit)], -1.0472));
            } else if (place > 1 && digit !== 0) {
                num_patterns.push(new Pattern('number', NUMBER_SIGNATURES[digit], [new Iota('number', digit)], -1.0472));

                switch (place) {
                    case 2:
                        num_patterns.push(new Pattern('number', NUMBER_SIGNATURES[10], [new Iota('number', 10)], -1.0472));
                        num_patterns.push(new Pattern('mul_dot', sig_from_command('mul_dot'), [], -1.0472));
                        break;
                    case 3:
                        num_patterns.push(new Pattern('number', NUMBER_SIGNATURES[100], [new Iota('number', 100)], -1.0472));
                        num_patterns.push(new Pattern('mul_dot', sig_from_command('mul_dot'), [], -1.0472));
                        break;
                    default:
                        num_patterns.push(new Pattern('number', NUMBER_SIGNATURES[10], [new Iota('number', 10)], -1.0472));
                        num_patterns.push(new Pattern('number', NUMBER_SIGNATURES[place - 1], [new Iota('number', place - 1)], -1.0472));
                        num_patterns.push(new Pattern('pow_proj', sig_from_command('pow_proj'), [], 0));
                        num_patterns.push(new Pattern('mul_dot', sig_from_command('mul_dot'), [], -1.0472));
                        break;
                }
            }
        }
        if (nonzero_count > 0) {
            num_patterns = num_patterns.concat(new Array(nonzero_count - 1).fill(new Pattern('add', sig_from_command('add'), [], 1.0472)));
        }
        return num_patterns;
    }

    let int_patterns = int > 0 ? get_patterns(int) : [];

    let decimal_patterns = [];
    if (decimal > 0) {
        decimal_patterns = get_patterns(decimal);
        decimal_patterns.push(new Pattern('number', NUMBER_SIGNATURES[10], [new Iota('number', 10)], -1.0472));
        decimal_patterns.push(
            new Pattern(
                'number',
                NUMBER_SIGNATURES[decimal.toString().length].replace('aqaa', 'dedd'),
                [new Iota('number', decimal.toString().length * -1)],
                1.0472
            )
        );
        decimal_patterns.push(new Pattern('pow_proj', sig_from_command('pow_proj'), [], 0));
        decimal_patterns.push(new Pattern('mul_dot', sig_from_command('mul_dot'), [], -1.0472));
        if (int > 0) decimal_patterns.push(new Pattern('add', sig_from_command('add'), [], 1.0472));
    }

    pattern_list = int_patterns.concat(decimal_patterns);
    if (pattern_list.length === 0) pattern_list.push(new Pattern('number', 'aqaa', [new Iota('number', 0)], -1.0472));

    if (negative) {
        pattern_list.push(new Pattern('number', NUMBER_SIGNATURES[1].replace('aqaa', 'dedd'), [new Iota('number', -1)], 1.0472));
        pattern_list.push(new Pattern('mul_dot', sig_from_command('mul_dot'), [], -1.0472));
    }

    return pattern_list;
}

export default patterns_from_number;
