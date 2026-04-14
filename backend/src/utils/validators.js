function isEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateSignupInput(input) {
  const errors = [];
  if (!input.username || input.username.trim().length < 3) {
    errors.push({ field: "username", message: "Username must be at least 3 characters" });
  }
  if (!input.email || !isEmail(input.email)) {
    errors.push({ field: "email", message: "Valid email is required" });
  }
  if (!input.password || input.password.length < 6) {
    errors.push({ field: "password", message: "Password must be at least 6 characters" });
  }
  return errors;
}

function validateLoginInput(input) {
  const errors = [];
  if (!input.login || input.login.trim().length === 0) {
    errors.push({ field: "login", message: "Username or email is required" });
  }
  if (!input.password || input.password.length === 0) {
    errors.push({ field: "password", message: "Password is required" });
  }
  return errors;
}

function validateEmployeeInput(input, isUpdate = false) {
  const errors = [];

  const requiredIfCreate = (field, msg) => {
    if (!isUpdate && (!input[field] || String(input[field]).trim().length === 0)) {
      errors.push({ field, message: msg });
    }
  };

  requiredIfCreate("first_name", "first_name is required");
  requiredIfCreate("last_name", "last_name is required");
  requiredIfCreate("designation", "designation is required");
  requiredIfCreate("department", "department is required");
  requiredIfCreate("date_of_joining", "date_of_joining is required");

  if (!isUpdate || input.email !== undefined) {
    if (!input.email || !isEmail(input.email)) {
      errors.push({ field: "email", message: "Valid email is required" });
    }
  }

  if (!isUpdate || input.gender !== undefined) {
    const allowed = ["Male", "Female", "Other"];
    if (input.gender && !allowed.includes(input.gender)) {
      errors.push({ field: "gender", message: "Gender must be Male, Female, or Other" });
    }
  }

  if (!isUpdate || input.salary !== undefined) {
    if (input.salary === undefined || input.salary === null || Number(input.salary) < 1000) {
      errors.push({ field: "salary", message: "Salary must be >= 1000" });
    }
  }

  if (!isUpdate || input.date_of_joining !== undefined) {
    if (input.date_of_joining && isNaN(Date.parse(input.date_of_joining))) {
      errors.push({ field: "date_of_joining", message: "date_of_joining must be a valid date" });
    }
  }

  return errors;
}

module.exports = {
  validateSignupInput,
  validateLoginInput,
  validateEmployeeInput
};