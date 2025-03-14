const firstName = document.getElementById("first-name");
const lastName = document.getElementById("last-name");
const email = document.getElementById("email");
const queryType1 = document.getElementById("query-type-1");
const queryType2 = document.getElementById("query-type-2");
const message = document.getElementById("message");
const consent = document.getElementById("consent");
const requiredFields = document.getElementsByClassName("input-field");
const invalid = document.querySelector(".invalid");
const form = document.getElementById("form");

const unselected = document.querySelector(".unselected");
const unchecked = document.querySelector(".unchecked");
const successDialog = document.getElementById("success");

const checkRequired = () => {
    let isValid = true;
    [...requiredFields].forEach((field) => {
        const errorElement = field.nextElementSibling;
        if (!field.value.trim()) {
            errorElement.classList.remove("hidden");
            field.style.borderColor = "#d03640"
            isValid = false;
        }
    })
    return isValid;
}

const checkEmail = () => {
    let isValid = true;
    if (!email.validity.valid) {
        email.nextElementSibling.classList.add("hidden");
        invalid.classList.remove("hidden");
        email.style.borderColor = "#d03640";
    }
    return isValid;
}
const checkRadios = () => {
    let isValid = true;
    if (!queryType1.checked && !queryType2.checked) {
        isValid = false;
        unselected.classList.remove("hidden");
    }
    return isValid;
}

const checkCheckboxes = () => {
    let isValid = true;
    if (!consent.checked) {
        isValid = false;
        unchecked.classList.remove("hidden");
    }
    return isValid;
}

const resetRequired = () => {
    [...requiredFields].forEach((field) => {
        const errorElement = field.nextElementSibling;
        errorElement.classList.add("hidden");
        field.style.borderColor = "hsl(186, 15%, 59%)"
    })
    invalid.classList.add("hidden");
    unselected.classList.add("hidden");
    unchecked.classList.add("hidden");
}

const submitForm = () => {
    if (checkRequired() && checkEmail() && checkRadios() && checkCheckboxes()) {
        successDialog.showModal();
        [...requiredFields].forEach((field) => {
            field.value = "";
        })
        queryType1.checked = false;
        queryType2.checked = false;
        consent.checked = false;
    }
}


form.addEventListener("submit", (e) => {
    e.preventDefault();
    resetRequired();
    checkRequired();
    checkEmail();
    checkRadios();
    checkCheckboxes()
    submitForm();
})