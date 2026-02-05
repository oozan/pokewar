export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Simple email validation regex

export const validateEmail = (value: string): string => {
  if (!value.trim()) {
    return "Email is required.";
  }
  if (!emailRegex.test(value.trim().toLowerCase())) {
    return "Enter a valid email address.";
  }
  return "";
};

export const validateDisplayName = (value: string): string => {
  if (!value.trim()) {
    return "Name is required.";
  }
  if (value.trim().length < 2) {
    return "Name must be at least 2 characters.";
  }
  return "";
};

export const passwordRules = [
  {
    label: "At least 8 characters",
    test: (value: string) => value.length >= 8,
  },
  {
    label: "One uppercase letter",
    test: (value: string) => /[A-Z]/.test(value),
  },
  {
    label: "One lowercase letter",
    test: (value: string) => /[a-z]/.test(value),
  },
  {
    label: "One number",
    test: (value: string) => /\d/.test(value),
  },
];

export const validatePassword = (value: string): string[] => {
  if (!value) {
    return ["Password is required."];
  }
  const failed = passwordRules.filter((rule) => !rule.test(value));
  if (failed.length === 0) {
    return [];
  }
  return failed.map((rule) => rule.label);
};

export const validatePasswordMatch = (
  password: string,
  confirmPassword: string,
): string => {
  if (!confirmPassword) {
    return "Please confirm your password.";
  }
  if (password !== confirmPassword) {
    return "Passwords do not match.";
  }
  return "";
};
