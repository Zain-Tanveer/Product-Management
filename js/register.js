const formEl = document.getElementById("register-form");

const usernameEl = document.getElementById("username");
const emailEl = document.getElementById("email");
const passwordEl = document.getElementById("password");

const usernameErrorEl = document.querySelector(".username-error");
const emailErrorEl = document.querySelector(".email-error");
const passwordErrorEl = document.querySelector(".password-error");

const responseMessageEl = document.getElementById("response-message");

// localStorage.clear();

const users = JSON.parse(localStorage.getItem("users")) || [];
console.log(users);

formEl.addEventListener("submit", (e) => {
  e.preventDefault();

  usernameErrorEl.innerHTML = "";
  emailErrorEl.innerHTML = "";
  passwordErrorEl.innerHTML = "";

  const username = usernameEl.value;
  const email = emailEl.value;
  const password = passwordEl.value;

  let error = false;

  const usernamePattern = /^[a-zA-Z0-9_]+$/;
  const emailPattern = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

  if (!username) {
    usernameErrorEl.innerHTML = "please enter a username";
    error = true;
  } else if (username.length < 3) {
    usernameErrorEl.innerHTML = "username should have at least 3 characters";
    error = true;
  } else if (!usernamePattern.test(username)) {
    usernameErrorEl.innerHTML =
      "username can only contain letters, numbers, and underscores";
    error = true;
  }

  if (!email) {
    emailErrorEl.innerHTML = "please enter an email";
    error = true;
  } else if (!emailPattern.test(email)) {
    emailErrorEl.innerHTML = "please provide a valid email";
    error = true;
  }

  const isRegistered = users.find((user) => user.email === email);
  if (isRegistered) {
    toggleErrorMessage("User already exists");
    return;
  }

  if (!password) {
    passwordErrorEl.innerHTML = "please enter a password";
    error = true;
  } else if (password.length < 6) {
    passwordErrorEl.innerHTML = "password should have at least 6 characters";
    error = true;
  }

  if (error) {
    return;
  }

  const user = { username, email, password, products: [] };
  users.push(user);

  localStorage.setItem("users", JSON.stringify(users));

  usernameEl.value = "";
  emailEl.value = "";
  passwordEl.value = "";

  toggleSuccessMessage("Registration successful!");

  setTimeout(() => {
    window.location.href = "/";
  }, 1000);
});

document.getElementById("message-cross").addEventListener("click", () => {
  responseMessageEl.style.display = "none";
});

function toggleSuccessMessage(message, duration = 3500) {
  const successMessageEl = document.getElementById("response-message");
  const successMessageP = document.querySelector("#response-message p");
  const progressBarEl = document.getElementById("progressBar");
  successMessageP.innerHTML = message;
  successMessageEl.style.display = "flex";
  successMessageEl.classList.add("success-message");
  progressBarEl.classList.add("success-bar");

  const startTime = new Date().getTime();

  const id = setInterval(frame, 10);
  function frame() {
    const currentTime = new Date().getTime();
    const elapsedTime = currentTime - startTime;
    const progress = (elapsedTime / duration) * 100;

    if (progress >= 100) {
      clearInterval(id);
    } else {
      progressBarEl.style.width = progress + "%";
    }
  }

  setTimeout(() => {
    successMessageEl.style.display = "none";
    successMessageEl.classList.remove("success-message");
    progressBarEl.classList.remove("success-bar");
  }, duration + 500);
}

function toggleErrorMessage(message, duration = 3500) {
  const errorMessageEl = document.getElementById("response-message");
  const errorMessageP = document.querySelector("#response-message p");
  const progressBarEl = document.getElementById("progressBar");
  errorMessageP.innerHTML = message;
  errorMessageEl.style.display = "flex";
  errorMessageEl.classList.add("error-message");
  progressBarEl.classList.add("error-bar");

  const startTime = new Date().getTime();

  const id = setInterval(frame, 10);
  function frame() {
    const currentTime = new Date().getTime();
    const elapsedTime = currentTime - startTime;
    const progress = (elapsedTime / duration) * 100;

    if (progress >= 100) {
      clearInterval(id);
    } else {
      progressBarEl.style.width = progress + "%";
    }
  }

  setTimeout(() => {
    errorMessageEl.style.display = "none";
    errorMessageEl.classList.remove("error-message");
    progressBarEl.classList.remove("error-bar");
  }, duration + 500);
}

const mobileNavToggleEl = document.querySelector(".mobile-nav-toggle");

mobileNavToggleEl.addEventListener("click", () => {
  const mobileNavWrapperEl = document.querySelector(".mobile-nav-wrapper");
  mobileNavWrapperEl.toggleAttribute("data-visible");

  const primaryHeader = document.querySelector(".primary-header");
  primaryHeader.toggleAttribute("data-visible");
});
