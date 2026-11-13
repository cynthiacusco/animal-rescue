const programs = [
    {
        id: "adoption",
        title: "Adopting a Companion",
        summary: "Step-by-step matching to welcome a pet into your forever home."
    },
    {
        id: "foster",
        title: "Foster Home Program",
        summary: "Temporary safe housing with all food, crates, and vet care provided."
    },
    {
        id: "volunteer",
        title: "Community Volunteer",
        summary: "Transport, weekend events, website stories, and admin support."
    }
];

function getSavedList() {
    const saved = localStorage.getItem("saved_programs");
    return saved ? JSON.parse(saved) : [];
}

function saveList(list) {
    localStorage.setItem("saved_programs", JSON.stringify(list));
}

function showSavedList() {
    const listBox = document.getElementById("saved-interests-list");
    const countText = document.getElementById("saved-count");
    if (!listBox || !countText) return;

    const savedIds = getSavedList();
    countText.textContent = savedIds.length;

    if (savedIds.length === 0) {
        listBox.innerHTML = "<li>No programs saved yet. Click a button above to bookmark how you want to help!</li>";
        return;
    }

    const pickedPrograms = programs.filter(item => savedIds.includes(item.id));
    
    listBox.innerHTML = pickedPrograms
        .map(item => `<li><strong>${item.title}:</strong> ${item.summary}</li>`)
        .join("");
}

function updateButtons() {
    const savedIds = getSavedList();
    const buttons = document.querySelectorAll(".interest-toggle-btn");

    buttons.forEach(btn => {
        const id = btn.dataset.program;
        if (savedIds.includes(id)) {
            btn.textContent = "✓ Saved to My List";
            btn.classList.add("saved-active");
        } else {
            btn.textContent = "+ Save This Option";
            btn.classList.remove("saved-active");
        }
    });
}

function startServicesPage() {
    const buttons = document.querySelectorAll(".interest-toggle-btn");
    const clearBtn = document.getElementById("clear-interests-btn");
    if (buttons.length === 0) return;

    updateButtons();
    showSavedList();

    buttons.forEach(btn => {
        btn.addEventListener("click", function() {
            const id = btn.dataset.program;
            let savedIds = getSavedList();

            if (savedIds.includes(id)) {
                savedIds = savedIds.filter(savedId => savedId !== id);
            } else {
                savedIds.push(id);
            }

            saveList(savedIds);
            updateButtons();
            showSavedList();
        });
    });

    if (clearBtn) {
        clearBtn.addEventListener("click", function() {
            localStorage.removeItem("saved_programs");
            updateButtons();
            showSavedList();
        });
    }
}

function showError(fieldId, text) {
    const field = document.getElementById(fieldId);
    const errorText = document.getElementById(`${fieldId}-error`);
    if (field) field.classList.add("input-error");
    if (errorText) errorText.textContent = text;
}

function clearError(fieldId) {
    const field = document.getElementById(fieldId);
    const errorText = document.getElementById(`${fieldId}-error`);
    if (field) field.classList.remove("input-error");
    if (errorText) errorText.textContent = "";
}

function checkForm() {
    clearError("user-name");
    clearError("user-email");
    clearError("interest-type");
    clearError("user-experience");

    let allGood = true;

    const name = document.getElementById("user-name").value.trim();
    const email = document.getElementById("user-email").value.trim();
    const choice = document.getElementById("interest-type").value;
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

    if (choice === "") {
        showError("interest-type", "Please select how you would like to help.");
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
    const choiceBox = document.getElementById("interest-type");
    const expBox = document.getElementById("user-experience");
    const banner = document.getElementById("prefill-banner");
    const statusBox = document.getElementById("form-status-message");

    const savedName = localStorage.getItem("draft_name");
    const savedEmail = localStorage.getItem("draft_email");
    if (savedName && nameBox) nameBox.value = savedName;
    if (savedEmail && emailBox) emailBox.value = savedEmail;

    const savedIds = getSavedList();
    if (savedIds.length > 0 && choiceBox) {
        choiceBox.value = savedIds[0];
        if (banner) {
            const matched = programs.find(item => item.id === savedIds[0]);
            if (matched) {
                banner.textContent = `Welcome back! We pre-selected "${matched.title}" based on your saved interests.`;
                banner.classList.remove("hidden");
            }
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

    if (choiceBox) {
        choiceBox.addEventListener("change", () => clearError("interest-type"));
    }

    if (expBox) {
        expBox.addEventListener("input", () => clearError("user-experience"));
    }

    form.addEventListener("submit", function(event) {
        event.preventDefault();

        if (checkForm()) {
            localStorage.removeItem("draft_name");
            localStorage.removeItem("draft_email");

            if (statusBox) {
                statusBox.textContent = `Thank you, ${nameBox.value.trim()}! Your inquiry has been validated and received.`;
                statusBox.className = "form-success";
            }
            form.reset();
        } else if (statusBox) {
            statusBox.textContent = "Please fix the highlighted fields above before submitting.";
            statusBox.className = "form-alert";
        }
    });
}

document.addEventListener("DOMContentLoaded", function() {
    startServicesPage();
    startContactPage();
});
