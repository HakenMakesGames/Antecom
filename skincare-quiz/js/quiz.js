(function () {
  const totalSteps = 8;
  const resultsUrl = "https://ledisa.com/products/glp-1";

  let currentStep = 0;

  const quizIntro = document.getElementById("quizIntro");
  const quizForm = document.getElementById("quizForm");
  const quizComplete = document.getElementById("quizComplete");
  const startQuizButton = document.getElementById("startQuizButton");
  const backButton = document.getElementById("backButton");
  const nextButton = document.getElementById("nextButton");
  const stepLabel = document.getElementById("stepLabel");
  const progressBar = document.getElementById("progressBar");
  const progressBarFill = document.getElementById("progressBarFill");
  const resultsButton = document.getElementById("resultsButton");

  const questions = Array.from(document.querySelectorAll(".quiz-question"));

  resultsButton.href = resultsUrl;

  function updateProgress(step) {
    const percentage = (step / totalSteps) * 100;
    progressBarFill.style.width = percentage + "%";
    progressBar.setAttribute("aria-valuenow", String(step));
    stepLabel.textContent = "Step " + step + " of " + totalSteps;
  }

  function showQuestion(step) {
    questions.forEach(function (question) {
      const questionStep = Number(question.dataset.step);
      question.hidden = questionStep !== step;
    });

    backButton.hidden = step <= 1;
    nextButton.textContent = step === totalSteps ? "See My Results" : "Continue";
    updateProgress(step);
  }

  function validateCurrentStep() {
    const currentQuestion = questions.find(function (question) {
      return Number(question.dataset.step) === currentStep;
    });

    if (!currentQuestion) {
      return false;
    }

    if (currentStep === totalSteps) {
      const firstName = document.getElementById("firstName");
      const email = document.getElementById("email");
      const phone = document.getElementById("phone");

      clearFieldErrors();

      let isValid = true;

      if (!firstName.value.trim()) {
        markFieldInvalid(firstName, "Please enter your first name.");
        isValid = false;
      }

      if (!email.value.trim() || !isValidEmail(email.value)) {
        markFieldInvalid(email, "Please enter a valid email address.");
        isValid = false;
      }

      if (!phone.value.trim() || !isValidPhone(phone.value)) {
        markFieldInvalid(phone, "Please enter a valid phone number.");
        isValid = false;
      }

      return isValid;
    }

    const selectedOption = currentQuestion.querySelector("input:checked");
    return Boolean(selectedOption);
  }

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
  }

  function isValidPhone(value) {
    const digits = value.replace(/\D/g, "");
    return digits.length >= 10;
  }

  function markFieldInvalid(input, message) {
    input.classList.add("is-invalid");

    const existingError = input.parentElement.querySelector(".form-error");
    if (existingError) {
      existingError.remove();
    }

    const errorElement = document.createElement("span");
    errorElement.className = "form-error";
    errorElement.textContent = message;
    errorElement.setAttribute("role", "alert");
    input.parentElement.appendChild(errorElement);
  }

  function clearFieldErrors() {
    quizForm.querySelectorAll(".form-input").forEach(function (input) {
      input.classList.remove("is-invalid");
    });

    quizForm.querySelectorAll(".form-error").forEach(function (error) {
      error.remove();
    });
  }

  function showCompleteScreen() {
    quizForm.hidden = true;
    quizComplete.hidden = false;
    stepLabel.textContent = "Complete";
    progressBarFill.style.width = "100%";
    progressBar.setAttribute("aria-valuenow", String(totalSteps));
  }

  function startQuiz() {
    quizIntro.hidden = true;
    quizForm.hidden = false;
    currentStep = 1;
    showQuestion(currentStep);
  }

  function goToNextStep() {
    if (!validateCurrentStep()) {
      if (currentStep < totalSteps) {
        highlightMissingSelection();
      }
      return;
    }

    if (currentStep === totalSteps) {
      showCompleteScreen();
      return;
    }

    currentStep += 1;
    showQuestion(currentStep);
  }

  function goToPreviousStep() {
    if (currentStep <= 1) {
      return;
    }

    currentStep -= 1;
    showQuestion(currentStep);
  }

  function highlightMissingSelection() {
    const currentQuestion = questions.find(function (question) {
      return Number(question.dataset.step) === currentStep;
    });

    if (currentQuestion) {
      currentQuestion.querySelector(".question-title").focus({ preventScroll: true });
    }
  }

  startQuizButton.addEventListener("click", startQuiz);
  nextButton.addEventListener("click", goToNextStep);
  backButton.addEventListener("click", goToPreviousStep);

  quizForm.addEventListener("keydown", function (event) {
    if (event.key === "Enter" && event.target.tagName !== "TEXTAREA") {
      event.preventDefault();
      goToNextStep();
    }
  });

  updateProgress(0);
  stepLabel.textContent = "Ready to begin";
})();
