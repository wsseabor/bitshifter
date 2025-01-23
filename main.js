//Things never work like you want them to
const debug = {
    init: (message) => console.log('Initializing: ', message),
    input: (message, val) => console.log('Input: ', message, val),
    op: (message, val) => console.log('Operation: ', message, val),
    error: (message, error) => console.log('Error: ', message, error),
    res: (message, val) => console.log('Output: ', message, val)

};

//Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {

    //Interactable DOM elements in object notation 
    const elements = {
        bit_length_inputs : document.querySelectorAll('input[name="bit-length"]'),
        input : document.querySelector('.input textarea'),
        output : document.querySelector('.output textarea'),
        buttons : document.querySelectorAll('.btn'),
        texthide : document.querySelector('.texthide')

    }

    //Log elements, radio button for bits not returning selected value
    debug.init('Found elements: ', {
        'bit_length_inputs': elements.bit_length_inputs.length,
        'input': !!elements.input,
        'output': !!elements.output,
        'buttons': elements.buttons.length
    });

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
        const bit_length = selected ? parseInt(selected.value) : 4;
        debug.init('Selected bit length: ', bit_length);
        return bit_length;
    }

    //Utility function, valid binary user input
    //Regex checks beginning of line, if 0's and 1's are in list as many times as needed, return true
    const is_valid_binary = (input) => {
        const valid_binary_regex = /^[01]+$/;
        const is_valid_input = valid_binary_regex.test(input);
        debug.input('Binary validation: ', { input, is_valid_input });
        return is_valid_input;
    }

    //Binary to decimal function, JS internally performs bit ops on 32-bit integers, so headaches ensue
    const binary_to_decimal = (bin) => {
        const decimal = parseInt(bin, 2);
        debug.op('Binary to decimal conversion: ', { bin, decimal });
        return decimal;
    }

    //Also have to pad output with zeros to match bit length
    const decimal_to_binary = (decimal, bit_length) => {
        const bin = decimal.toString(2).padStart(bit_length, '0');
        debug.op('Decimal to binary conversion: ', {decimal, bin, bit_length})
        return bin;
    }

    //Shifting ops as object notation
    const shift_ops = {
        left_shift: (number, bit_length) => {
            debug.op('Left shift: ', { number, bit_length });
            const shift = (number << 1) & max_bits[bit_length];
            debug.op('Left shift result: ', shift)
            return shift;
        },

        logical_right_shift: (number, bit_length) => {
            debug.op('Logical right shift: ', { number, bit_length });
            const shift = number >>> 1;
            debug.op('Logical right shift result: ', shift);
            return shift;
        },

        arithmetic_right_shift: (number, bit_length) => {
            debug.op('Arithmetic right shift: ', {number, bit_length});
            const shift = number >> 1;
            debug.op('Arithmetic right shift result: ', shift);
            return shift;
        }
    }


    //Handles input for invalid binary inputs
    const handle_input = () => {
        const input = elements.input.value.trim();
        debug.input('Raw input: ', input)
        
        if (!is_valid_binary(input)) {
            debug.error('Invalid binary input: ', input)
            elements.input.classList.add('Error.')
            elements.output.value = 'Invalid binary input.'
            return false;
        }

        elements.input.classList.remove('Error.');
        return true;

    }

    const handle_shift = (op) => {

        debug.op('Begin shift operation: ', op)

        if (!get_bit_length()) {
            debug.error('Error in retrieving bit length.');
            return;
        }

        //No input or error in input, return
        if (!handle_input()) {
            debug.error('Error in input validation.');
            return;
        }

        //Get bit length, get binary user input, convert to decimal
        const bit_length = get_bit_length();
        debug.init('Bit length: ', bit_length);
        const input_binary = elements.input.value.trim();
        debug.init('Input binary: ', input_binary);
        const input_decimal = binary_to_decimal(input_binary);
        debug.init('Input decimal: ', input_decimal);

        try {
            const shifted_decimal = shift_ops[op](input_decimal, bit_length);
            const shifted_binary = decimal_to_binary(shifted_decimal, bit_length);
        
            elements.output.value = shifted_binary;
            debug.res('Shift operation managed: ', {
                op,
                input: input_binary,
                output: shifted_binary
            });

        } catch (error) {
            debug.error('Shift operation failed: ', error);
        }
    };

    //Event listening
    const init_event_listeners = () => {

        debug.init("Setting event listeners...: ");

        //Check if elements are null before listening
        if (elements.input){
            //Input validation
            elements.input.addEventListener('input', handle_input);
            debug.init('Input listening.');
        }

        //Handle buttons
        elements.buttons.forEach((button, index) => {
            const ops = ['left_shift', 'logical_right_shift', 'arithmetic_right_shift'];
            button.addEventListener('click', () => handle_shift(ops[index]));
            debug.init('Button event listener added for ', {ops});
        });

    }

    init_event_listeners();

})
