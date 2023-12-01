const { query } = require("../database/db");

/*
This function is the service for the authentication route. It takes in the user
information and checks if the user exists in the database. If the user exists,
then the user information is returned. Otherwise an error message is returned.
*/
const authenticate = async (data) =>{

    // Get the email and password from the controller.
    const { email, password } = data;

    // Write the SQL query to get the user with the email and password.
    const sql = `SELECT * FROM users
    WHERE user_email = ? AND user_password = ?`;

    try {
        // Call the query function from the database which runs the SQL.
        const user = await query(sql, [email, password]);

        if (user && user.length) {
            // If the user is found, then return the user information
            return { status: 200, message: "Successful", user: user[0] }
        } else {
            // Otherwise return a 401 status code with an error message.
            return { status: 401, message: "Cannot login with these credentials" }
        }
    } catch (error) {
        // If there is an internal error, return a code 500 with an error message.
        return { status: 500, message: "Internal Server Error" }
    }
}

module.exports = {
    authenticate
}