const numberInput = document.getElementById("number");
const convertBtn = document.getElementById("convert-btn");
const form = document.getElementById("converter-form");
const output = document.getElementById("output");


const roman = [
    ["M", 1000],
    ["CM", 900],
    ["D", 500],
    ["CD", 400],
    ["C", 100],
    ["XC", 90],
    ["L", 50],
    ["XL", 40],
    ["X", 10],
    ["IX", 9],
    ["V", 5],
    ["IV", 4],
    ["I", 1]
]

const decimalToRoman = (num) => {
    if(num === 0) {
        return "";
    } else {
        for ( const arr of roman ) {
            if (num >= arr[1]) {
                return arr[0] + decimalToRoman(num-arr[1]);
            }
        }
    }
}

const isValid = (num, str) => {
    let errText = "";
    if (!str || str.match(/[e.]/g) || str === '') {
        errText = 'Please enter a valid number';
        setTimeout(() => {
            numberInput.value = ""; // Clear input after displaying the result
        }, 100);
    } else if (num < 1) {
        errText = 'Please enter a number greater than or equal to 1';
        setTimeout(() => {
            numberInput.value = ""; // Clear input after displaying the result
        }, 100);
    } else if (num > 3999) {
        errText = "Please enter a number less than or equal to 3999";
        setTimeout(() => {
            numberInput.value = ""; // Clear input after displaying the result
        }, 100);
    } else {
        return true;
    }

    output.classList.add("alert");
    output.innerText = errText;
    return false;
}

const clear = () => {
    output.innerText = '';
    output.classList.remove("alert");
}

const updatePage = () => {
    const numStr = numberInput.value;
    const int = parseInt(numStr, 10);
    output.classList.remove("hidden");
    clear();

    if (isValid(int, numStr)) {
        if (int === 2006) {
            output.innerHTML = `
            <p>Congratulations! You found an Easter egg!</p>
            <p>Here is a <a href="https://www.youtube.com/watch?v=AxE4TltnvjI">cool video</a></p>
            And yeah, the result is: ${decimalToRoman(2006)}
            `;
        } else {
            output.innerText = decimalToRoman(int);
        }

        setTimeout(() => {
            numberInput.value = ""; // Clear input after displaying the result
        }, 100); // Small delay to ensure processing is complete
    }
};

form.addEventListener("submit", (e) => {
    e.preventDefault();
    updatePage();
})

convertBtn.addEventListener("click", () => {
    updatePage();
})