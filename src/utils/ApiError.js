// Define a class named ApiError that extends the built-in Error class(describing the formate of ApiErrors)
class ApiError extends Error {
  // Constructor to initialize the ApiError object
  constructor(
    statusCode,
    message = "Something went wrong",
    errors = [],
    stack = ""
  ) {
    // Call the constructor of the parent class (Error) with the provided message
    super(message);

    // Set properties based on constructor parameters
    this.statusCode = statusCode; // HTTP status code associated with the error
    this.data = null; // Additional data that can be included with the error response
    this.message = message; // Human-readable error message
    this.success = false; // Indicates that the operation was not successful
    this.errors = errors; // Array of error details

    // Check if a stack trace is provided
    if (stack) {
      this.stack = stack; // Use the provided stack trace
    } else {
      Error.captureStackTrace(this, this.constructor); // Capture the stack trace if not provided
    }
  }
}

// Export the ApiError class for use in other modules
export { ApiError };
