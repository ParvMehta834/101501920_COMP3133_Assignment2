const { gql } = require("apollo-server-express");

module.exports = gql`
  scalar JSON

  type ApiResponse {
    success: Boolean!
    message: String!
    data: JSON
    error: JSON
  }

  # ---------------- AUTH ----------------

  input SignupInput {
    username: String!
    email: String!
    password: String!
  }

  input LoginInput {
    login: String!   # username OR email
    password: String!
  }

  # ---------------- EMPLOYEE ----------------

  input EmployeeInput {
    first_name: String
    last_name: String
    email: String
    gender: String
    designation: String
    salary: Float
    date_of_joining: String
    department: String
    employee_photo: String
  }

  input EmployeeSearchFilter {
    designation: String
    department: String
  }

  # ---------------- QUERIES ----------------

  type Query {
    login(input: LoginInput!): ApiResponse!

    getAllEmployees: ApiResponse!

    getEmployeeByEid(eid: ID!): ApiResponse!

    searchEmployees(filter: EmployeeSearchFilter!): ApiResponse!
  }

  # ---------------- MUTATIONS ----------------

  type Mutation {
    signup(input: SignupInput!): ApiResponse!

    addEmployee(input: EmployeeInput!): ApiResponse!

    updateEmployeeByEid(eid: ID!, input: EmployeeInput!): ApiResponse!

    deleteEmployeeByEid(eid: ID!): ApiResponse!
  }
`;