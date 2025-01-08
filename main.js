//Interactable DOM elements in object notation 
const elements = {
    bit_length_inputs : document.querySelectorAll('input[name="bit-length"]'),
    input : document.querySelector('.input textarea'),
    output : document.querySelector('.output textarea'),
    buttons : document.querySelectorAll('.btn')

}

//Config for 4, 8, 16 bit digits
//Largest 4 bit representation : 15 (2^n -1, where n is bit length)
const max_bits = {
    4 : 15,
    8 : 255,
    16 : 65535
}

//Utility function to get bit length from radio button check
//Defaults to 4 if not selected
const get_bit_length = () => {
    const selected = document.querySelector('input[name="bit_length"]:checked');
    return selected ? parseInt(selected.value) : 4;
}

//Utility function, valid binary user input
//Regex checks beginning of line, if 0's and 1's are in list as many times as needed, return true
const is_valid_binary = (input) => {
    const valid_binary_regex = /^[01]+$/;
    return valid_binary_regex.test(input);

}

//Utility function, left shift on user input
const left_shift = (num, bit_length) => {
    const left_shifted = (num << 1) & max_bits[bit_length];
    return left_shifted;
}

//Utility function, logical right shift
const logical_right_shift = (num, bit_length) => {
    const logical_right_shifted = (num >>> 1) & max_bits[bit_length];
    return logical_right_shifted;
}

//Utility function, arithmetic right shift
const arithmetic_right_shift = (num, bit_length) => {
    const arithemtic_right_shifted = (num >> 1) & max_bits[bit_length];
    return arithemtic_right_shifted;
}

//Handles input for invalid binary inputs
const handle_input = () => {
    const input = elements.input.value.trim();
    
    if (!valid_binary_regex(input)) {
        elements.input.classList.add('Error.')
        elements.output.value = 'Invalid binary input.'
        return false;
    }

    elements.input.classList.remove('Error.');
    return true;

}

const handle_shift = (op) => {
    if (!handle_input()) return;

    const bit_length = get_bit_length();
    const input_binary = elemtns.input.value.trim();
    const shifted_binary = left_shift(input_binary, bit_length);

    elements.output.value = shifted_binary;
}

const debug_events = () => {
    
}

debug_events()