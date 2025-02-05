const textInput = document.getElementById("text-input");
const checkBtn = document.getElementById("check-btn");
const resultDiv = document.getElementById("result");

const cleanInput = (input) => {
    return input.replace(/[^A-Za-z0-9]/gi, '').toLowerCase();
}

// console.log(cleanInput("Axxc4  /5^hg  f"))

const getResult = (input) => {
    const cleanedInput = cleanInput(input);
    return cleanedInput === [...cleanedInput].reverse().join('');
}

/*console.log(getResult("sos"));
console.log(getResult("food"));*/

const showResult = (input) => {

    if (input==='') {
        alert('Please input a value');
        return;
    }

    resultDiv.innerHTML = '';
    const originalInput = input;
    const result = getResult(input);
    const cleanedInput = cleanInput(input);

    if (result) {
        resultDiv.innerHTML = `<p>${originalInput} is a palindrome.</p>`
    } else {
        resultDiv.innerHTML = `<p>${originalInput} is not a palindrome.</p>`
    }
}

checkBtn.addEventListener('click', () => {
    showResult(textInput.value);
    textInput.value = '';
});

textInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        showResult(textInput.value);
        textInput.value = '';
    }
});
