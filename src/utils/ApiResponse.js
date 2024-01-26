// Define a class named ApiResponse (describing the formate of Apiresponse)
class ApiResponse {
  // Constructor to initialize the ApiResponse object
  constructor(statusCode, data, message = "Success") {
    // Set properties based on constructor parameters
    this.statusCode = statusCode; // HTTP status code of the response
    this.data = data; // Data to be included in the response
    this.message = message; // Optional message associated with the response, default is "Success"

    // Determine the success status based on the HTTP status code
    this.success = statusCode < 400; // If status code is less than 400, consider it a success
  }
}

// Export the ApiResponse class for use in other modules
export { ApiResponse };
