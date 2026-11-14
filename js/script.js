//adding dark mode//
const themeBtn = document.getElementById("theme-btn");

function loadTheme() {
    const savedTheme = localStorage.getItem("site_theme");
    if (savedTheme === "dark") {
        document.body.classList.add("dark-mode");
        if (themeBtn) {
            themeBtn.textContent = "☀️";
        }
    }
}

function toggleTheme() {
    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {
        localStorage.setItem("site_theme", "dark");
        themeBtn.textContent = "☀️";
    } else {
        localStorage.setItem("site_theme", "light");
        themeBtn.textContent = "⚫";
    }
}

loadTheme();

if (themeBtn) {
    themeBtn.addEventListener("click", toggleTheme);
}
const options = [
    { id: "adoption", name: "Adoption" },
    { id: "foster", name: "Foster Home" },
    { id: "volunteer", name: "Volunteering" }
];

function getPickedIds() {
    const saved = localStorage.getItem("picked_help");
    if (saved) {
        return JSON.parse(saved);
    } else {
        return [];
    }
}

function savePickedIds(ids) {
    localStorage.setItem("picked_help", JSON.stringify(ids));
}

function updateHelpBar() {
    const countBox = document.getElementById("help-count");
    const listBox = document.getElementById("help-list");
    if (!countBox || !listBox) return;

    const pickedIds = getPickedIds();
    countBox.textContent = pickedIds.length;

    if (pickedIds.length === 0) {
        listBox.textContent = "None selected yet";
        return;
    }

    const matchedNames = options
        .filter(item => pickedIds.includes(item.id))
        .map(item => item.name);

    listBox.textContent = matchedNames.join(", ");
}

function updatePickButtons() {
    const pickedIds = getPickedIds();
    const buttons = document.querySelectorAll(".pick-btn");

    buttons.forEach(btn => {
        const id = btn.dataset.option;
        if (pickedIds.includes(id)) {
            btn.textContent = "✓ Added to List";
            btn.classList.add("picked");
        } else {
            btn.textContent = "+ Add to My List";
            btn.classList.remove("picked");
        }
    });
}

function startHelpBar() {
    const buttons = document.querySelectorAll(".pick-btn");
    const clearBtn = document.getElementById("clear-help-btn");
    if (buttons.length === 0) return;

    updatePickButtons();
    updateHelpBar();

    buttons.forEach(btn => {
        btn.addEventListener("click", function() {
            const id = btn.dataset.option;
            let pickedIds = getPickedIds();

            if (pickedIds.includes(id)) {
                pickedIds = pickedIds.filter(savedId => savedId !== id);
            } else {
                pickedIds.push(id);
            }

            savePickedIds(pickedIds);
            updatePickButtons();
            updateHelpBar();
        });
    });

    if (clearBtn) {
        clearBtn.addEventListener("click", function() {
            localStorage.removeItem("picked_help");
            updatePickButtons();
            updateHelpBar();
        });
    }
}

startHelpBar();
function showError(fieldId, text) {
    const field = document.getElementById(fieldId);
    const errorBox = document.getElementById(`${fieldId}-error`);
    if (field) {
        field.classList.add("input-error");
    }
    if (errorBox) {
        errorBox.textContent = text;
    }
}

function clearError(fieldId) {
    const field = document.getElementById(fieldId);
    const errorBox = document.getElementById(`${fieldId}-error`);
    if (field) {
        field.classList.remove("input-error");
    }
    if (errorBox) {
        errorBox.textContent = "";
    }
}
function checkForm() {
    clearError("user-name");
    clearError("user-email");
    clearError("interest-type");
    clearError("user-experience");

    let allGood = true;

    const name = document.getElementById("user-name").value.trim();
    const email = document.getElementById("user-email").value.trim();
    const checkedBoxes = document.querySelectorAll('input[name="interest_category"]:checked');
    const experience = document.getElementById("user-experience").value.trim();

    if (name === "") {
        showError("user-name", "Please enter your full name.");
        allGood = false;
    }

    const emailCheck = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email === "") {
        showError("user-email", "Email address is required.");
        allGood = false;
    } else if (!emailCheck.test(email)) {
        showError("user-email", "Please enter a valid email address (e.g., name@example.com).");
        allGood = false;
    }

    if (checkedBoxes.length === 0) {
        showError("interest-type", "Please select at least one way you would like to help.");
        allGood = false;
    }

    if (experience.length < 15) {
        showError("user-experience", "Please share at least 15 characters about your pet experience.");
        allGood = false;
    }

    return allGood;
}

function startContactPage() {
    const form = document.querySelector("#main-content form");
    if (!form) return;

    const nameBox = document.getElementById("user-name");
    const emailBox = document.getElementById("user-email");
    const helpBoxes = document.querySelectorAll('input[name="interest_category"]');
    const expBox = document.getElementById("user-experience");
    const banner = document.getElementById("prefill-banner");
    const statusBox = document.getElementById("form-status-message");

    const savedName = localStorage.getItem("draft_name");
    const savedEmail = localStorage.getItem("draft_email");
    if (savedName && nameBox) {
        nameBox.value = savedName;
    }
    if (savedEmail && emailBox) {
        emailBox.value = savedEmail;
    }

    const pickedIds = getPickedIds();
    if (pickedIds.length > 0 && helpBoxes.length > 0) {
        helpBoxes.forEach(box => {
            if (pickedIds.includes(box.value)) {
                box.checked = true;
            }
        });

        if (banner) {
            const matchedNames = options
                .filter(item => pickedIds.includes(item.id))
                .map(item => item.name);

            banner.textContent = `Welcome back! We checked your saved interests: ${matchedNames.join(", ")}.`;
            banner.classList.remove("hidden");
        }
    }

    if (nameBox) {
        nameBox.addEventListener("input", function() {
            localStorage.setItem("draft_name", nameBox.value);
            clearError("user-name");
        });
    }

    if (emailBox) {
        emailBox.addEventListener("input", function() {
            localStorage.setItem("draft_email", emailBox.value);
            clearError("user-email");
        });
    }

    helpBoxes.forEach(box => {
        box.addEventListener("change", function() {
            clearError("interest-type");
        });
    });

    if (expBox) {
        expBox.addEventListener("input", function() {
            clearError("user-experience");
        });
    }

    form.addEventListener("submit", function(event) {
        event.preventDefault();

        if (checkForm()) {
            localStorage.removeItem("draft_name");
            localStorage.removeItem("draft_email");

            if (statusBox) {
                statusBox.textContent = `Thank you, ${nameBox.value.trim()}! Your inquiry has been received.`;
                statusBox.className = "form-success";
            }
            form.reset();
        } else if (statusBox) {
            statusBox.textContent = "Please fix the highlighted fields above before submitting.";
            statusBox.className = "form-alert";
        }
    });
}

startContactPage();
