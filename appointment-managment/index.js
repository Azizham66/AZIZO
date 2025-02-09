const appoForm = document.getElementById("appo-form");
const confirmCloseDialog = document.getElementById("confirm-close-dialog");
const openForm = document.getElementById("open-form");
const closeForm = document.getElementById("close-form");
const addOrUpdateFormBtn = document.getElementById("add-or-update-form-btn");
const cancelBtn = document.getElementById("cancel-btn");
const discardBtn = document.getElementById("discard-btn");
const appoContainer = document.getElementById("appo-container");
const patientName = document.getElementById("patient-name");
const dateInput = document.getElementById("date-input");
const dayOfWeek = document.getElementById("day-of-week");
const timeInput = document.getElementById("time-input");

const appoData = JSON.parse(localStorage.getItem("data")) || [];
let currentAppo = {};

function generateUniqueId(patientName) {
    let sanitized = patientName
        .normalize("NFD")
        .replace(/[\u064B-\u065F]/g, '')
        .replace(/\s+/g, '-')
        .replace(/[^\u0600-\u06FF\w-]/g, '')
    let uniqueId = sanitized || 'id';
    uniqueId += '-' + Date.now();
    return uniqueId;
}


const removeSpecialChars = (val) => {
    return val.trim().replace(/[^A-Za-z0-9\-\s]/g, '')
}

const addOrUpdate = () => {
    if (!patientName.value.trim()) {
        alert("الرجاء ادخال اسم المريض");
        return;
    }
    const dataArrIndex = appoData.findIndex((item) => item.id === currentAppo.id);
    const appoObj = {
        id: `${Date.now()}`,
        name: patientName.value,
        date: dateInput.value,
        dayOfWeek: dayOfWeek.value,
        time: timeInput.value
    };
    if (dataArrIndex === -1) {
        appoData.unshift(appoObj);
    } else {
        appoData[dataArrIndex] = appoObj;
    }

    localStorage.setItem("data", JSON.stringify(appoData));
    updateAppoContainer();
    reset();
}

const updateAppoContainer = () => {
    appoContainer.innerHTML = '';
    appoData.forEach(({id, name, date, dayOfWeek, time}) => {
        (appoContainer.innerHTML +=
            `
            <div class="task" id="${id}">
                <p><strong>اسم المريض: </strong> ${name}</p>
                <p><strong>التاريخ: </strong> ${date}</p>
                <p><strong>اليوم: </strong> ${dayOfWeek}</p>
                <p><strong>الساعة: </strong> ${time}</p>
                <button onclick="editappo(this)" type="button" class="btn">Edit</button>
                <button onclick="deleteappo(this)" type="button" class="btn">Delete</button>
            </div>
            `)
    });
};

const deleteappo = (buttonEl) => {
    const dataArrIndex = appoData.findIndex((item) => item.id === buttonEl.parentElement.id);

    buttonEl.parentElement.remove();
    appoData.splice(dataArrIndex, 1);
    localStorage.setItem("data", JSON.stringify(appoData));
}

const editappo = (buttonEl) => {
    const dataArrIndex = appoData.findIndex((item) => item.id === buttonEl.parentElement.id);

    currentAppo = appoData[dataArrIndex];
    patientName.value = currentAppo.name;
    dateInput.value = currentAppo.date;
    dayOfWeek.value = currentAppo.dayOfWeek;
    timeInput.value = currentAppo.time;

    appoForm.classList.toggle("hidden");
    openForm.classList.toggle("hidden");
    addOrUpdateFormBtn.textContent = "تعديل الموعد";

}

const reset = () => {
    addOrUpdateFormBtn.textContent = "أضف موعد";
    patientName.value = "";
    dateInput.value = "";
    dayOfWeek.value = "";
    timeInput.value = "";
    appoForm.classList.toggle("hidden");
    openForm.classList.toggle("hidden");
    currentAppo = {};
}

if (appoData.length) {
    updateAppoContainer();
}

openForm.addEventListener("click", () => {
    appoForm.classList.toggle("hidden");
    openForm.classList.toggle("hidden")
})

closeForm.addEventListener("click", () => {
    const formContainsValues = patientName.value || dateInput.value || dayOfWeek.value || timeInput.value;
    const valuesUpdated = patientName.value !== currentAppo.name || dateInput.value !== currentAppo.date || dayOfWeek.value !== currentAppo.dayOfWeek || timeInput.value !== currentAppo.time;
    if (formContainsValues && valuesUpdated) {
        confirmCloseDialog.showModal();
    } else {
        reset();
    }
})

cancelBtn.addEventListener("click", () => confirmCloseDialog.close());

discardBtn.addEventListener("click", () => {
    confirmCloseDialog.close();
    reset()
});

appoForm.addEventListener("submit", (e) => {
    e.preventDefault();
    addOrUpdate();
})