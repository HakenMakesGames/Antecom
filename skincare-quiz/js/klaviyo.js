(function () {
  const klaviyoPublicApiKey = "SqCgi4";
  const klaviyoListId = "TBNRiY";
  const klaviyoApiUrl = "https://a.klaviyo.com/client/subscriptions/?company_id=" + klaviyoPublicApiKey;
  const klaviyoRevision = "2024-10-15";

  function formatPhoneE164(phone) {
    const digits = phone.replace(/\D/g, "");

    if (!digits) {
      return "";
    }

    if (digits.length === 10) {
      return "+1" + digits;
    }

    if (digits.length === 11 && digits.startsWith("1")) {
      return "+" + digits;
    }

    if (phone.trim().startsWith("+")) {
      return "+" + digits;
    }

    return "+" + digits;
  }

  function buildQuizProperties(quizData) {
    return {
      "Quiz Signup Source": "Skincare Quiz",
      quiz_name: "skincare_quiz",
      skin_type: quizData.skin_type || "",
      skin_concern: quizData.skin_concern || "",
      age_range: quizData.age_range || "",
      current_routine: quizData.current_routine || "",
      sun_exposure: quizData.sun_exposure || "",
      skin_sensitivity: quizData.skin_sensitivity || "",
      skincare_goal: quizData.skincare_goal || ""
    };
  }

  function getQuizPayload() {
    if (!window.quizTracking || typeof window.quizTracking.getQuizData !== "function") {
      throw new Error("Quiz data is not available.");
    }

    return window.quizTracking.getQuizData();
  }

  function buildSubscriptionPayload(quizData) {
    const phoneNumber = formatPhoneE164(quizData.phone);

    const profileAttributes = {
      email: quizData.email.trim(),
      first_name: quizData.first_name.trim(),
      phone_number: phoneNumber,
      properties: buildQuizProperties(quizData)
    };

    return {
      data: {
        type: "subscription",
        attributes: {
          custom_source: "Skincare Quiz",
          profile: {
            data: {
              type: "profile",
              attributes: profileAttributes
            }
          }
        },
        relationships: {
          list: {
            data: {
              type: "list",
              id: klaviyoListId
            }
          }
        }
      }
    };
  }

  async function subscribeQuizLead() {
    const quizData = getQuizPayload();

    if (!quizData.email || !quizData.first_name || !quizData.phone) {
      throw new Error("Email, first name, and phone are required.");
    }

    const response = await fetch(klaviyoApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/vnd.api+json",
        revision: klaviyoRevision
      },
      body: JSON.stringify(buildSubscriptionPayload(quizData))
    });

    if (!response.ok) {
      const errorData = await response.json().catch(function () {
        return {};
      });

      throw new Error(errorData.errors?.[0]?.detail || "Unable to save your details. Please try again.");
    }

    return {
      success: true
    };
  }

  window.quizKlaviyo = {
    subscribe: subscribeQuizLead
  };
})();
