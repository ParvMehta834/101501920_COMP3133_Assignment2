const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Employee = require("../models/Employee");
const { ok, fail } = require("../utils/response");
const {
  validateSignupInput,
  validateLoginInput,
  validateEmployeeInput
} = require("../utils/validators");

function requireAuth(user) {
  if (!user) {
    return fail("Unauthorized: token missing/invalid", { code: "UNAUTHORIZED" });
  }
  return null;
}

module.exports = {
  Query: {

    // 🔐 LOGIN
    login: async (_, { input }) => {
      const errors = validateLoginInput(input);
      if (errors.length) return fail("Validation failed", errors);

      const { login, password } = input;

      const user = await User.findOne({
        $or: [{ username: login }, { email: login }]
      });

      if (!user) {
        return fail("Invalid credentials", { field: "login", message: "User not found" });
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return fail("Invalid credentials", { field: "password", message: "Wrong password" });
      }

      const token = jwt.sign(
        { userId: user._id, username: user.username, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "2h" }
      );

      return ok("Login successful", {
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email
        }
      });
    },

    // 📋 GET ALL EMPLOYEES
    getAllEmployees: async (_, __, ctx) => {
      //const authError = requireAuth(ctx.user);
      //if (authError) return authError;

      const employees = await Employee.find().sort({ created_at: -1 });
      return ok("Employees fetched", employees);
    },

    // 🔍 GET BY ID
    getEmployeeByEid: async (_, { eid }, ctx) => {
      const authError = requireAuth(ctx.user);
      if (authError) return authError;

      const employee = await Employee.findById(eid);

      if (!employee) {
        return fail("Employee not found", {
          field: "eid",
          message: "No employee with this id"
        });
      }

      return ok("Employee found", employee);
    },

    // 🔎 SEARCH
    searchEmployees: async (_, { filter }, ctx) => {
      const authError = requireAuth(ctx.user);
      if (authError) return authError;

      const { designation, department } = filter;

      if (!designation && !department) {
        return fail("Validation failed", [
          { field: "filter", message: "Provide designation or department" }
        ]);
      }

      const query = {};
      if (designation) query.designation = designation;
      if (department) query.department = department;

      const employees = await Employee.find(query).sort({ created_at: -1 });

      return ok("Search results", employees);
    }
  },

  Mutation: {

    // 🧑 SIGNUP
    signup: async (_, { input }) => {
      const errors = validateSignupInput(input);
      if (errors.length) return fail("Validation failed", errors);

      const { username, email, password } = input;

      const exists = await User.findOne({
        $or: [{ username }, { email }]
      });

      if (exists) {
        return fail("User already exists", {
          message: "username/email already taken"
        });
      }

      const hashed = await bcrypt.hash(password, 10);

      const user = await User.create({
        username,
        email,
        password: hashed
      });

      return ok("Signup successful", {
        id: user._id,
        username: user.username,
        email: user.email
      });
    },

    // ➕ ADD EMPLOYEE
    addEmployee: async (_, { input }, ctx) => {
      const authError = requireAuth(ctx.user);
      if (authError) return authError;

      const errors = validateEmployeeInput(input, false);
      if (errors.length) return fail("Validation failed", errors);

      const emailExists = await Employee.findOne({ email: input.email });
      if (emailExists) {
        return fail("Duplicate email", [
          { field: "email", message: "Email must be unique" }
        ]);
      }

      const employee = await Employee.create({
        ...input,
        date_of_joining: input.date_of_joining
          ? new Date(input.date_of_joining)
          : null
      });

      return ok("Employee created", employee);
    },

    // ✏️ UPDATE EMPLOYEE
    updateEmployeeByEid: async (_, { eid, input }, ctx) => {
      const authError = requireAuth(ctx.user);
      if (authError) return authError;

      const errors = validateEmployeeInput(input, true);
      if (errors.length) return fail("Validation failed", errors);

      if (input.email) {
        const emailOwner = await Employee.findOne({ email: input.email });

        if (emailOwner && String(emailOwner._id) !== String(eid)) {
          return fail("Duplicate email", [
            { field: "email", message: "Email must be unique" }
          ]);
        }
      }

      const update = { ...input };

      if (input.date_of_joining) {
        update.date_of_joining = new Date(input.date_of_joining);
      }

      const updated = await Employee.findByIdAndUpdate(eid, update, {
        new: true
      });

      if (!updated) {
        return fail("Employee not found", {
          field: "eid",
          message: "No employee with this id"
        });
      }

      return ok("Employee updated", updated);
    },

    // ❌ DELETE EMPLOYEE
    deleteEmployeeByEid: async (_, { eid }, ctx) => {
      const authError = requireAuth(ctx.user);
      if (authError) return authError;

      const deleted = await Employee.findByIdAndDelete(eid);

      if (!deleted) {
        return fail("Employee not found", {
          field: "eid",
          message: "No employee with this id"
        });
      }

      return ok("Employee deleted", deleted);
    }
  }
};