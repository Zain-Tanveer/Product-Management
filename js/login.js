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
    responseMessageEl.classList.add("error-message");
    responseMessageEl.querySelector("p").innerHTML = "User not found!";
    responseMessageEl.style.display = "flex";

    setTimeout(() => {
      responseMessageEl.style.display = "none";
      responseMessageEl.classList.remove("error-message");
    }, 4000);

    return;
  }

  if (password !== user.password) {
    responseMessageEl.classList.add("error-message");
    responseMessageEl.querySelector("p").innerHTML = "Incorrect user password!";
    responseMessageEl.style.display = "flex";

    setTimeout(() => {
      responseMessageEl.style.display = "none";
      responseMessageEl.classList.remove("error-message");
    }, 4000);

    return;
  }

  localStorage.setItem("user-logged-in", JSON.stringify(user));

  emailEl.value = "";
  passwordEl.value = "";

  responseMessageEl.classList.add("success-message");
  responseMessageEl.querySelector("p").innerHTML = "Login successful!";
  responseMessageEl.style.display = "flex";

  setTimeout(() => {
    // window.location.href = "/";
  }, 1000);
});

document.getElementById("message-cross").addEventListener("click", () => {
  responseMessageEl.style.display = "none";
});
