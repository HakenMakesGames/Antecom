(function () {
  const quizName = "skincare_quiz";

  const stepConfig = {
    1: { name: "skin_type", field: "skinType" },
    2: { name: "skin_concern", field: "skinConcern" },
    3: { name: "age_range", field: "ageRange" },
    4: { name: "current_routine", field: "currentRoutine" },
    5: { name: "sun_exposure", field: "sunExposure" },
    6: { name: "skin_sensitivity", field: "skinSensitivity" },
    7: { name: "skincare_goal", field: "skincareGoal" },
    8: { name: "contact", fields: ["firstName", "email", "phone"] }
  };

  function getFormValue(fieldName) {
    const field = document.querySelector('[name="' + fieldName + '"]');

    if (!field) {
      return "";
    }

    if (field.type === "radio") {
      const selectedOption = document.querySelector('[name="' + fieldName + '"]:checked');
      return selectedOption ? selectedOption.value : "";
    }

    return field.value.trim();
  }

  function collectQuizData() {
    return {
      skin_type: getFormValue("skinType"),
      skin_concern: getFormValue("skinConcern"),
      age_range: getFormValue("ageRange"),
      current_routine: getFormValue("currentRoutine"),
      sun_exposure: getFormValue("sunExposure"),
      skin_sensitivity: getFormValue("skinSensitivity"),
      skincare_goal: getFormValue("skincareGoal"),
      first_name: getFormValue("firstName"),
      email: getFormValue("email"),
      phone: getFormValue("phone")
    };
  }

  function getStepAnswer(step) {
    const config = stepConfig[step];

    if (!config) {
      return {};
    }

    if (config.field) {
      return {
        [config.name]: getFormValue(config.field)
      };
    }

    return {
      first_name: getFormValue("firstName"),
      email: getFormValue("email"),
      phone: getFormValue("phone")
    };
  }

  function fireGtmStepEvent(step) {
    window.dataLayer = window.dataLayer || [];

    const config = stepConfig[step];
    const quizData = collectQuizData();
    const stepAnswer = getStepAnswer(step);

    window.dataLayer.push(Object.assign({
      event: "quiz_step_" + step,
      quiz_name: quizName,
      quiz_step: step,
      quiz_step_name: config ? config.name : "",
      quiz_data: quizData
    }, stepAnswer));
  }

  function fireMetaLeadEvent() {
    if (typeof fbq !== "function") {
      return;
    }

    const quizData = collectQuizData();

    fbq("track", "Lead", {
      content_name: "Skincare Quiz",
      content_category: quizName,
      skin_type: quizData.skin_type,
      skin_concern: quizData.skin_concern,
      age_range: quizData.age_range,
      current_routine: quizData.current_routine,
      sun_exposure: quizData.sun_exposure,
      skin_sensitivity: quizData.skin_sensitivity,
      skincare_goal: quizData.skincare_goal,
      first_name: quizData.first_name,
      email: quizData.email,
      phone: quizData.phone
    });
  }

  window.quizTracking = {
    fireStepEvent: fireGtmStepEvent,
    fireLeadEvent: fireMetaLeadEvent,
    getQuizData: collectQuizData
  };
})();
