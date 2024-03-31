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
    responseMessageEl.classList.add("error-message");
    responseMessageEl.querySelector("p").innerHTML = "User already exists";
    responseMessageEl.style.display = "flex";

    setTimeout(() => {
      responseMessageEl.style.display = "none";
      responseMessageEl.classList.remove("error-message");
    }, 4000);

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

  responseMessageEl.classList.add("success-message");
  responseMessageEl.querySelector("p").innerHTML = "Registration successful!";
  responseMessageEl.style.display = "flex";

  setTimeout(() => {
    window.location.href = "/";
  }, 1000);
});

document.getElementById("message-cross").addEventListener("click", () => {
  responseMessageEl.style.display = "none";
});
