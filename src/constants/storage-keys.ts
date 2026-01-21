export const STORAGE_KEYS = {
  AUTH: {
    USER_INFO: "user_info",
    ACCESS_TOKEN: "access_token",
    REFRESH_TOKEN: "refresh_token",
    EMAIL_VERIFICATION_Token: "email_verification_token",
    EMAIL_VERIFICATION_INFO: "email_verification_info",
    RESET_PASSWORD_TOKEN: "reset_password_token",
  },

  SETTINGS: {
    THEME: "theme",
    LANGUAGE: "settings",
  },

  ONBOARDING: {
    COMPLETED: "onboarding_completed",
  },
} as const;
