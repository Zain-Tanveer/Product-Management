class AuthService {
  constructor() {}

  // function to validate login form inputs
  static validateLoginFormInputs(email, password) {
    const emailErrorEl = document.querySelector(".email-error");
    const passwordErrorEl = document.querySelector(".password-error");

    emailErrorEl.innerHTML = "";
    passwordErrorEl.innerHTML = "";

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

    return error;
  }

  // function to validate register form inputs
  static validateRegisterFormInputs(username, email, password) {
    const usernameErrorEl = document.querySelector(".username-error");
    const emailErrorEl = document.querySelector(".email-error");
    const passwordErrorEl = document.querySelector(".password-error");

    usernameErrorEl.innerHTML = "";
    emailErrorEl.innerHTML = "";
    passwordErrorEl.innerHTML = "";

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
      usernameErrorEl.innerHTML = "username can only contain letters, numbers, and underscores";
      error = true;
    }

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

    return error;
  }

  // function to add message cross event listener
  static addMessageCrossEventListener() {
    const responseMessageEl = document.getElementById("response-message");
    document.getElementById("message-cross").addEventListener("click", () => {
      responseMessageEl.style.display = "none";
    });
  }

  // function to add event listener on mobile nav toggle
  static addMobileNavEventListener() {
    const mobileNavToggleEl = document.querySelector(".mobile-nav-toggle");
    mobileNavToggleEl.addEventListener("click", () => {
      const mobileNavWrapperEl = document.querySelector(".mobile-nav-wrapper");
      mobileNavWrapperEl.toggleAttribute("data-visible");

      const primaryHeader = document.querySelector(".primary-header");
      primaryHeader.toggleAttribute("data-visible");
    });
  }

  // function to trigger success message on login/register form
  static toggleSuccessMessage(message, duration = 3500) {
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

  // function to trigger error message on login/register form
  static toggleErrorMessage(message, duration = 3500) {
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
}

export default AuthService;
