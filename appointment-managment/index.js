const languageSelect = document.getElementById("language-select");

const translations = {
    ar: {
        title: "تطبيق حجز مواعيد",
        addAppo: "أضف موعد",
        patientName: "اسم المريض",
        date: "تاريخ الموعد",
        dayOfWeek: "اليوم",
        time: "الساعة",
        addToList: "أضف الموعد للقائمة",
        edit: "تعديل",
        delete: "حذف",
        closeDialog: "تجاهل التغييرات؟",
        continueEditing: "أكمل التعديل",
        discard: "تجاهل التغييرات",
        nameStrongEl: "اسم المريض: ",
        align: "right",
        dateStrongEl: "التاريخ: ",
        dayStrongEl: "اليوم: ",
        timeStrongEl: "الساعة: "
    },
    en: {
        title: "Appointment Managment App",
        addAppo: "Add Appointment",
        patientName: "Patient Name",
        date: "Appointment Date",
        dayOfWeek: "Day of the Week",
        time: "Time",
        addToList: "Add to List",
        edit: "Edit",
        delete: "Delete",
        closeDialog: "Discard Changes?",
        continueEditing: "Continue Editing",
        discard: "Discard Changes",
        nameStrongEl: "Patient Name: ",
        align: "left",
        dateStrongEl: "Date: ",
        dayStrongEl: "Day: ",
        timeStrongEl: "Time: ",

    }
};

function changeLanguage(lang) {
    localStorage.setItem("language", lang);
    document.documentElement.lang = lang;

    // Update static text
    document.getElementById("app-title").textContent = translations[lang].title;
    document.getElementById("open-form").textContent = translations[lang].addAppo;
    document.querySelector('label[for="patient-name"]').textContent = translations[lang].patientName + ":";
    document.querySelector('label[for="date-input"]').textContent = translations[lang].date + ":";
    document.querySelector('label[for="day-of-week"]').textContent = translations[lang].dayOfWeek + ":";
    document.querySelector('label[for="time-input"]').textContent = translations[lang].time + ":";
    document.getElementById("add-or-update-form-btn").textContent = translations[lang].addToList;
    document.getElementById("cancel-btn").textContent = translations[lang].continueEditing;
    document.getElementById("discard-btn").textContent = translations[lang].discard;
    document.querySelector(".dialog-text").textContent = translations[lang].closeDialog;

    // Update existing buttons in the appointments list
    document.querySelectorAll(".task .btn:first-of-type").forEach(btn => btn.textContent = translations[lang].edit);
    document.querySelectorAll(".task .btn:last-of-type").forEach(btn => btn.textContent = translations[lang].delete);

    // Update placeholders dynamically
    document.getElementById("patient-name").placeholder = translations[lang].patientName;
    document.getElementById("date-input").placeholder = translations[lang].date;
    document.getElementById("day-of-week").placeholder = translations[lang].dayOfWeek;
    document.getElementById("time-input").placeholder = translations[lang].time;

    // Fix alignment
    document.querySelector("body").style.textAlign = translations[lang].align;
    document.getElementById("patient-name").style.textAlign = translations[lang].align;
    document.getElementById("date-input").style.textAlign = translations[lang].align;
    document.getElementById("day-of-week").style.textAlign = translations[lang].align;
    document.getElementById("time-input").style.textAlign = translations[lang].align;

    // ✅ Update appointments in the container
    updateAppoContainer();
}


languageSelect.addEventListener("change", () => {
    changeLanguage(languageSelect.value);
});

// Set the saved language on page load
document.addEventListener("DOMContentLoaded", () => {
    const savedLang = localStorage.getItem("language") || "ar";
    changeLanguage(savedLang);
    languageSelect.value = savedLang;
});

const setNameTitle = (lang) => {
    localStorage.setItem("language", lang);
    document.documentElement.lang = lang;

    return `${translations[lang].nameStrongEl}`
}

const setDateTitle = (lang) => {
    localStorage.setItem("language", lang);
    document.documentElement.lang = lang;

    return `${translations[lang].dateStrongEl}`
}

const setDayTitle = (lang) => {
    localStorage.setItem("language", lang);
    document.documentElement.lang = lang;

    return `${translations[lang].dayStrongEl}`
}

const setTimeTitle = (lang) => {
    localStorage.setItem("language", lang);
    document.documentElement.lang = lang;

    return `${translations[lang].timeStrongEl}`
}

const setDelBtnText = (lang) => {
    localStorage.setItem("language", lang);
    document.documentElement.lang = lang;

    return `${translations[lang].delete}`
}

const setEditBtnText = (lang) => {
    localStorage.setItem("language", lang);
    document.documentElement.lang = lang;

    return `${translations[lang].edit}`
}

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
    const savedLang = localStorage.getItem("language") || "ar";
    appoContainer.innerHTML = '';
    appoData.forEach(({id, name, date, dayOfWeek, time}) => {
        appoContainer.innerHTML += `<div class="task" id="${id}">
                <p><strong class="name-srong">${setNameTitle(savedLang)}</strong> ${name}</p>
                <p><strong class="date-strong">${setDateTitle(savedLang)}</strong> ${date}</p>
                <p><strong class="day-strong">${setDayTitle(savedLang)}</strong> ${dayOfWeek}</p>
                <p><strong class="time-form">${setTimeTitle(savedLang)}</strong> ${time}</p>
                <button onclick="editappo(this)" type="button" class="btn">${setEditBtnText(savedLang)}</button>
                <button onclick="deleteappo(this)" type="button" class="btn">${setDelBtnText(savedLang)}</button>
            </div>`;
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
