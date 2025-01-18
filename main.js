//Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {

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

    //Binary to decimal function, JS internally performs bit ops on 32-bit integers, so headaches ensue
    const binary_to_decimal = (bin) => {
        return parseInt(bin, 2);
    }

    //Also have to pad output with zeros to match bit length
    const decimal_to_binary = (decimal, bit_length) => {
        return decimal.toString(2).padStart(bit_length, '0');
    }

    //Shifting ops as object notation
    const shift_ops = {
        left_shift: (number, bit_length) => {
            const shift = (number << 1) & max_bits[bit_length];
            return shift;
        },

        logical_right_shift: (number, bit_length) => {
            const shift = number >>> 1;
            return shift;
        },

        arithmetic_right_shift: (number, bit_length) => {
            const shift = number >> 1;
            return shift;
        }
    }


    //Handles input for invalid binary inputs
    const handle_input = () => {
        const input = elements.input.value.trim();
        
        if (!is_valid_binary(input)) {
            elements.input.classList.add('Error.')
            elements.output.value = 'Invalid binary input.'
            return false;
        }

        elements.input.classList.remove('Error.');
        return true;

    }

    const handle_shift = (op) => {

        //No input or error in input, return
        if (!handle_input()) return;

        //Get bit length, get binary user input, convert to decimal
        const bit_length = get_bit_length();
        const input_binary = elements.input.value.trim();
        const input_decimal = binary_to_decimal(input_binary);

        //Shift the decimal input and then convert to binary to bypass JS 32-bit 
        const shifted_decimal = shift_ops[op](input_decimal, bit_length);
        const shifted_binary = decimal_to_binary(shifted_decimal, bit_length);

        //Output
        elements.output.value = shifted_binary;
    }

    //Event listening
    const init_event_listeners = () => {

        //Check if elements are null before listening
        if (elements.input){
            //Input validation
            elements.input.addEventListener('input', handle_input);
        }


        //Handle buttons
        elements.buttons.forEach((button, index) => {
            const ops = ['left_shift', 'logical_right_shift', 'arithmetic_right_shift'];
            button.addEventListener('click', () => handle_shift(ops[index]));
        });

    }

    init_event_listeners();

})
