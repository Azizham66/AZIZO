const btns = document.querySelectorAll('.btn');
const input = document.getElementById("display");
const equals = document.querySelector('.equals');
const clearBtn = document.querySelector('.clear');
const deleteBtn = document.querySelector('.delete');
const percent = document.querySelector(".percent");
const sqrt = document.querySelector('.sqrt');
const square  = document.querySelector('.square');
const openParen = document.querySelector('.open-paren');
const closeParen = document.querySelector('.close-paren');

let resetInput = false;

const infix = {
    "+": (x, y) => x + y,
    "-": (x, y) => x - y,
    "*": (x, y) => x * y,
    "/": (x, y) => x / y,
    "%": num => num / 100,
    "²": num => num ** 2,
    "√": num => Math.sqrt(num)
};

const infixEval = (str, regex) =>
    str.replace(regex, (match, arg1, operator, arg2) =>
        infix[operator](parseFloat(arg1), parseFloat(arg2))
    );

btns.forEach(btn => {
    if (!btn.classList.contains('clear') &&
        !btn.classList.contains('equals') &&
        !btn.classList.contains('delete') &&
        !btn.classList.contains('toggle-sign')) {
        btn.addEventListener('click', () => {
            if (resetInput) {
                input.value = '';
                resetInput = false;
            }
            input.value += btn.innerText;
        });
    }
});

// ✅ Automatically Insert Multiplication Before √ If Needed
const autoFixMultiplication = str =>
    str.replace(/(\d)(√)/g, '$1*$2');
const autoFixParentheses = str =>
    str.replace(/(\d)\(/g, '$1*(');

// ✅ Square Root Handling
const sqrtFn = str => {
    const regex = /√(-?[\d.]+)/g;
    const str2 = str.replace(regex, (_match, num) => infix["√"](parseFloat(num)));
    return str === str2 ? str : sqrtFn(str2);
};

// ✅ Square Handling
const squareFn = str => {
    const noSqrt = sqrtFn(str);
    const regex = /(-?[\d.]+)²/g;
    const str2 = noSqrt.replace(regex, (_match, num) => infix["²"](parseFloat(num)));
    return str === str2 ? str : squareFn(str2);
};

// ✅ Multiplication & Division First
const highDependence = str => {
    const noSqr = squareFn(str);
    const regex = /(-?[\d.]+)([*\/])(-?[\d.]+)/;
    const str2 = infixEval(noSqr, regex);
    return str === str2 ? str : highDependence(str2);
};

// ✅ Percentage Handling
const percentFn = str => {
    const noHigh = highDependence(str);
    const regex = /(-?[\d.]+)%/g;
    return noHigh.replace(regex, (_match, num) => infix["%"](parseFloat(num)));
};

// ✅ Addition & Subtraction
const lowDependence = str => {
    const noPercent = percentFn(str);
    const regex = /(-?[\d.]+)([+-])(-?[\d.]+)/;
    const str2 = infixEval(noPercent, regex);
    return str === str2 ? str : lowDependence(str2);
};

const validateSyntax = str => {
    if (/[*\/+-]{2,}/.test(str)) return "Syntax Error"; // Consecutive operators like "**", "//", "+*", etc.
    if (/\(\)/.test(str)) return "Syntax Error"; // Empty parentheses "()"
    if (/[\d)]\s*√/.test(str)) return "Syntax Error"; // Invalid square root usage (e.g., "9√4" should be "9*√4")
    if (/[+\-*/]$/.test(str)) return "Syntax Error"; // Expression ending with an operator (e.g., "5+3*")
    if (/^\*/.test(str)) return "Syntax Error"; // Expression starting with "*" or "/"
    if (isNaN(Number(str))) return "Syntax Error";

    const openParenCount = (str.match(/\(/g) || []).length;
    const closeParenCount = (str.match(/\)/g) || []).length;
    if (openParenCount !== closeParenCount) return "Syntax Error"; // Unmatched parentheses

    return null; // No errors
};

// ✅ Parentheses Handling
const evaluateExpression = str => {
    str = str.replace(/^\-/, '0-');  // Convert leading "-" into "0-" for evaluation
    str = autoFixMultiplication(str); // Fix missing multiplication before √
    str = autoFixParentheses(str); // Fix implicit multiplication before parentheses

    const syntaxError = validateSyntax(str);
    if (syntaxError) return syntaxError;

    const regex = /\(([^()]+)\)/g;
    while (regex.test(str)) {
        str = str.replace(regex, (_match, innerExpression) => lowDependence(innerExpression));
    }
    return lowDependence(str);
};

// ✅ Equals Button
equals.addEventListener('click', () => {
    const equation = input.value;
    const regex = /([\d.]+)(\/)(0)/;
    if (regex.test(equation)) {
        input.value = "Can't divide by 0";
        resetInput = true;
    } else {
        input.value = evaluateExpression(equation);
        resetInput = true;
    }
});

// ✅ Clear Button
const clear = input => {
    input.value = '';
    resetInput = false;
};
clearBtn.addEventListener('click', () => clear(input));

// ✅ Delete Button
const deleteFunction = () => {
    const splitStr = input.value.split("");
    splitStr.pop();
    input.value = splitStr.join("");
};
deleteBtn.addEventListener('click', () => deleteFunction());
