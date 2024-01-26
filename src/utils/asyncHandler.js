// Define an asyncHandler utility function
const asyncHandler = (requestHandler) => {
  // Return a new function that acts as middleware
  return (req, res, next) => {
    // Wrap the asynchronous operation in a Promise
    Promise.resolve(requestHandler(req, res, next))
      // If the Promise resolves successfully, move to the next middleware/handler
      .catch((err) => next(err)); // If an error occurs, pass it to the Express error handler
  };
};

// Export the asyncHandler utility function
export { asyncHandler };

//this is the second method to do so
// const asyncHandler = (fn) => async (req, res, next) => {
//     try {
//         await fn(req, res, next)
//     } catch (error) {
//         res.status(err.code || 500).json({
//             success: false,
//             message: err.message
//         })
//     }
// }
