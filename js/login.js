import AuthService from "./services/auth.service.js";

// variables
const formEl = document.getElementById("login-form");

const emailEl = document.getElementById("email");
const passwordEl = document.getElementById("password");

const users = JSON.parse(localStorage.getItem("users")) || [];
console.log(users);

const userLoggedIn = JSON.parse(localStorage.getItem("user-logged-in")) || {};
console.log(userLoggedIn);

// adds event listener on success message cross
AuthService.addMessageCrossEventListener();

// adds event listener for mobile screen navigation toggle
AuthService.addMobileNavEventListener();

// login form submit event listener
formEl.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = emailEl.value;
  const password = passwordEl.value;

  const isError = AuthService.validateLoginFormInputs(email, password);
  if (isError) {
    return;
  }

  const user = users.find((user) => user.email === email);
  if (!user) {
    AuthService.toggleErrorMessage("User not found!");
    return;
  }

  if (password !== user.password) {
    AuthService.toggleErrorMessage("Incorrect user password!");
    return;
  }

  localStorage.setItem("user-logged-in", JSON.stringify(user));

  emailEl.value = "";
  passwordEl.value = "";

  AuthService.toggleSuccessMessage("Login successful!", 1000);

  setTimeout(() => {
    window.location.href = "dashboard.html";
  }, 1000);
});
