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
