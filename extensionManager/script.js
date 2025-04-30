const cards = document.querySelector(".cards");
const all = document.getElementById("all");
const inactive = document.getElementById("inactive");
const active = document.getElementById("active");
const modeToggle = document.getElementById("mode-toggle");

let extensions = [];
let activated = [];
let inactivated = [];



fetch("./data.json")
    .then(response => response.json())
    .then(data => {
        extensions = data;
        showData(extensions);
        console.log(extensions);
    })
    .catch(error => {
        console.log(error);
    });

class Extension {
    display(dataArr) {
        cards.innerHTML = `
            ${dataArr.map(extension => `
            <div class="card extension-card" id="${extension.id}">
                <div class="ext-info">
                    <img src="${extension.logo}" alt="Extension logo" width="60">
                    <div class="text">
                        <h3 class="extension-title">${extension.name}</h3>
                        <p class="extension-description">${extension.description}</p>
                    </div>
                </div>
                <div class="functions">
                    <button class="btn btn-outline-secondary remove" data-id="${extension.id}">Remove</button>
                    <label class="switch">
                        <input type="checkbox" class="activate" data-id="${extension.id}">
                        <span class="slider"></span>
                    </label>
                </div>
            </div>
            `).join("")}
        `;
    }

    setCheckboxState(dataArr) {
        const activateToggles = document.getElementsByClassName("activate");

        dataArr.forEach(extension => {
            [...activateToggles].forEach(toggle => {
                if (toggle.getAttribute("data-id") === extension.id) {
                    toggle.checked = extension.isActive;
                }
            });
        });
    }

    static updateArrays() {
        activated = extensions.filter(ext => ext.isActive);
        inactivated = extensions.filter(ext => !ext.isActive);
    }

    static removeCard (id) {
        const removeBtns = document.getElementsByClassName("remove");
        [...removeBtns].forEach(btn => {
            const extensionId = btn.getAttribute("data-id");
            const extension = extensions.find(ext => ext.id === extensionId);
            const cardToRemove = document.getElementById(id);
            if (cardToRemove) {
                extensions = extensions.filter(ext => ext.id !== id)
                cardToRemove.remove();
            }
        })
    }
}


const attachToggleListeners = () => {
    const activateToggles = document.getElementsByClassName("activate");
    [...activateToggles].forEach(toggle => {
        const extensionId = toggle.getAttribute("data-id");
        const extension = extensions.find(ext => ext.id === extensionId);

        toggle.addEventListener("click", () => {
            extension.isActive = toggle.checked;
            Extension.updateArrays();
        });
    })
}

const showData = (dataArr) => {
    const removeBtns = document.getElementsByClassName("remove");
    const extension = new Extension();
    extension.display(dataArr);
    extension.setCheckboxState(dataArr);
    attachToggleListeners();

    all.addEventListener("click", (e) => {
        Extension.updateArrays();
        showData(extensions);
        if (!document.body.classList.contains('dark-mode')) {
            applyLightMode();
        } else {
            applyDarkMode();
        }
    });
    active.addEventListener("click", (e) => {
        Extension.updateArrays();
        showData(activated);
        if (!document.body.classList.contains('dark-mode')) {
            applyLightMode();
        } else {
            applyDarkMode();
        }
    })
    inactive.addEventListener("click", (e) => {
        Extension.updateArrays();
        showData(inactivated);
        if (!document.body.classList.contains('dark-mode')) {
            applyLightMode();
        } else {
            applyDarkMode();
        }
    });

    [...removeBtns].forEach(removeBtn => {
        removeBtn.addEventListener("click", (e) => {
            Extension.removeCard(removeBtn.getAttribute("data-id"));
        })
    });
};

// Define the styles for light and dark modes using JavaScript objects
    const lightModeStyles = {
        background: "linear-gradient(180deg, #f0f4f8 0%, #e5eef3 100%)", // Smooth gradient for light mode
        color: "#333333", // Dark text for light mode
        headerBackground: "#ffffff", // Light header background
        cardBackground: "#f7f7f7", // Slightly lighter card background for light mode
        buttonBackground: "#fcfdff", // Button background color for light mode (same as background)
        buttonColor: "#333333", // Button text color for light mode
        switchBackground: "#eeeeee", // Switch background for light mode
        switchColor: "#ffffff" // Switch color for light mode
    };

    const darkModeStyles = {
        background: "linear-gradient(180deg, #040918 0%, #091540 100%)", // Smooth gradient for dark mode
        color: "#e0e0e0", // Light text for dark mode
        headerBackground: "#1a1a1a", // Darker header background for dark mode
        cardBackground: "#1f2535", // Slightly lighter card background for dark mode
        buttonBackground: "#30364d", // Button background color for dark mode (same as background)
        buttonColor: "#e0e0e0", // Button text color for dark mode
        switchBackground: "#535769", // Switch background for dark mode
        switchColor: "#000000" // Switch color for dark mode
    };


// Add event listener to the mode toggle button
    modeToggle.addEventListener('click', () => {
        if (document.body.classList.contains('dark-mode')) {
            applyLightMode();
        } else {
            applyDarkMode();
        }
    });

// Function to apply dark mode styles
    const applyDarkMode = () => {
        // Add dark mode class to the body
        document.body.classList.add('dark-mode');
        // Apply the dark mode styles
        document.body.style.background = darkModeStyles.background;
        document.body.style.color = darkModeStyles.color;
        document.querySelector('.header-content').style.background = darkModeStyles.headerBackground;
        document.querySelector('.header-content').style.color = darkModeStyles.color;
        document.getElementById("logo").setAttribute("fill", darkModeStyles.color);

        // Apply dark mode styles to buttons
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            button.style.backgroundColor = darkModeStyles.buttonBackground;
            button.style.color = darkModeStyles.buttonColor;
        });

        // Apply dark mode styles to cards
        const cards = document.querySelectorAll('.card');
        cards.forEach(card => {
            card.style.backgroundColor = darkModeStyles.cardBackground;
            card.style.color = darkModeStyles.color;
        });

        // Apply the dark mode styles to the toggle button
        modeToggle.style.backgroundColor = darkModeStyles.switchBackground;
        modeToggle.style.color = darkModeStyles.switchColor;

        // Change the mode toggle icon to the sun (indicating dark mode)
        modeToggle.querySelector('img').src = '/assets/images/icon-sun.svg';

        // Save the dark mode preference to localStorage
    }

// Function to apply light mode styles
    const applyLightMode = () => {
        // Remove dark mode class from the body
        document.body.classList.remove('dark-mode');
        // Apply the light mode styles
        document.body.style.background = lightModeStyles.background;
        document.body.style.color = lightModeStyles.color;
        document.querySelector('.header-content').style.background = lightModeStyles.headerBackground;
        document.querySelector('.header-content').style.color = lightModeStyles.color;
        document.getElementById("logo").setAttribute("fill", lightModeStyles.color);


        // Apply light mode styles to buttons
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            button.style.backgroundColor = lightModeStyles.buttonBackground;
            button.style.color = lightModeStyles.buttonColor;
        });

        // Apply light mode styles to cards
        const cards = document.querySelectorAll('.card');
        cards.forEach(card => {
            card.style.backgroundColor = lightModeStyles.cardBackground;
            card.style.color = lightModeStyles.color;

        });

        // Apply the light mode styles to the toggle button
        modeToggle.style.backgroundColor = lightModeStyles.switchBackground;
        modeToggle.style.color = lightModeStyles.switchColor;

        // Change the mode toggle icon to the moon (indicating light mode)
        modeToggle.querySelector('img').src = '/assets/images/icon-moon.svg';

        // Save the light mode preference to localStorage
}