const stepsForm = document.querySelector("[data-steps]"),
  cardStepsArr = [...stepsForm.querySelectorAll("[data-step]")],
  btnArr = [...stepsForm.querySelectorAll(".btn")],
  progressStepsArr = [...document.querySelectorAll(".progress-step")],
  progressBar = document.querySelector(".bar");

// Add a class to non-active cards to keep them hidden initially
cardStepsArr.forEach(
  (step) => !step.classList.contains("active") && step.classList.add("hide")
);
// Get the current step index which has the class "active"
let currentStep = +cardStepsArr.find((step) =>
  step.classList.contains("active")
).dataset.step;

btnArr.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    // Remove the initial "hide" class from all cards
    cardStepsArr.forEach((step) => step.classList.remove("hide"));
    // Gathering all the inputs of the current form to perform validation checks
    const inputs = [
      ...cardStepsArr[currentStep].querySelectorAll(".form-control"),
    ];
    const validated = inputs.every((input) => input.reportValidity());
    const passwordMatch = inputs
      .filter((input) => input.type === "password")
      .every((password, i, arr) => arr[0].value === password.value);
    const confirmPasswordInput = inputs.find(
      (input) => input.id === "confirm_password"
    );
    // Show a custom message to let the user know in case the re-entered password didn't match the original one
    if (!passwordMatch) {
      confirmPasswordInput?.setCustomValidity("Passwords don't match");
    } else {
      confirmPasswordInput?.setCustomValidity("");
    }
    // Deteriming whether the clicked button has the action of "next", "previous" or "submit"
    // and therefore what to do in each case (mostly setting different animations)
    if (e.target.dataset.next && validated && passwordMatch) {
      removeActiveStep(currentStep, "scaleOut");
      // Increment current step index to target the next card
      currentStep++;
      showActiveStep(currentStep);
      cardStepsArr[currentStep].style.animationName = "fadeIn";
      progressStepsArr[currentStep].style.transitionDelay = "0.9s";
    } else if (e.target.dataset.previous) {
      removeActiveStep(currentStep, "fadeOut");
      progressStepsArr[currentStep].style.transitionDelay = "0.1s";
      progressStepsArr[currentStep].classList.remove("active");
      // Decrement current step index to target the previous card
      currentStep--;
      showActiveStep(currentStep);
      cardStepsArr[currentStep].style.animationName = "fadeIn";
    } else if (e.target.dataset.submit) {
      removeActiveStep(currentStep, "scaleOut");
      // Clear all input values upon submitting in the last form. Obviously not a practical example as data is not being submitted,
      // but I'm only aiming to replicate how it would look / behave from a UI perspective.
      [...stepsForm.querySelectorAll(".form-control")].forEach(
        (input) => (input.value = "")
      );
      progressBar.style.transitionDelay = "0.5s";
      progressBar.style.transitionDuration = "0.9s";
      progressStepsArr.forEach((step) => {
        step.style.transitionDelay = "0.6s";
        step.style.transitionDuration = "0.7s";
        step.classList.remove("active");
      });
      // Reset current step index to target the first card
      currentStep = 0;
      showActiveStep(currentStep);
      cardStepsArr[currentStep].style.animationName = "fadeIn";
    }
    // Fill progress bar till the current active progress step
    progressStepsArr.forEach((step, i, arr) => {
      if (step.classList.contains("active")) {
        progressBar.style.width = `${i * (100 / (arr.length - 1))}%`;
      }
    });
  });
});

// Helper functions for rearranging HTML classes and animation names
function showActiveStep(i) {
  cardStepsArr[i].classList.add("active");
  progressStepsArr[i].classList.add("active");
}
function removeActiveStep(i, animation) {
  cardStepsArr[i].classList.remove("active");
  cardStepsArr[currentStep].style.animationName = animation;
}
