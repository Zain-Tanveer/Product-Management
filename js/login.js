const formEl = document.getElementById("login-form");

const emailEl = document.getElementById("email");
const passwordEl = document.getElementById("password");

const emailErrorEl = document.querySelector(".email-error");
const passwordErrorEl = document.querySelector(".password-error");

const responseMessageEl = document.getElementById("response-message");

// localStorage.clear();

const users = JSON.parse(localStorage.getItem("users")) || [];
console.log(users);

const userLoggedIn = JSON.parse(localStorage.getItem("user-logged-in")) || {};
console.log(userLoggedIn);

formEl.addEventListener("submit", (e) => {
  e.preventDefault();

  emailErrorEl.innerHTML = "";
  passwordErrorEl.innerHTML = "";

  const email = emailEl.value;
  const password = passwordEl.value;

  let error = false;

  const emailPattern = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

  if (!email) {
    emailErrorEl.innerHTML = "please enter an email";
    error = true;
  } else if (!emailPattern.test(email)) {
    emailErrorEl.innerHTML = "please provide a valid email";
    error = true;
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

  const user = users.find((user) => user.email === email);
  if (!user) {
    toggleErrorMessage("User not found!");
    return;
  }

  if (password !== user.password) {
    toggleErrorMessage("Incorrect user password!");
    return;
  }

  localStorage.setItem("user-logged-in", JSON.stringify(user));

  emailEl.value = "";
  passwordEl.value = "";

  toggleSuccessMessage("Login successful!", 1000);

  setTimeout(() => {
    window.location.href = "/dashboard.html";
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
});
