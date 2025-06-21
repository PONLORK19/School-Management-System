// Toggle password visibility
const togglePassword = document.getElementById("togglePassword");
if (togglePassword) {
  togglePassword.addEventListener("click", function () {
    const passwordInput = document.getElementById("password");
    if (passwordInput.type === "password") {
      passwordInput.type = "text";
      this.src = "hide-icon.png";
    } else {
      passwordInput.type = "password";
      this.src = "eye-icon.png";
    }
  });
}

// Login form submission
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", function (event) {
    event.preventDefault();
    window.location.href = "dashboard.html";
  });
}
