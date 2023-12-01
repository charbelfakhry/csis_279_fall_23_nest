const {authenticate} = require("./authService");
var jwt = require('jsonwebtoken');
require('dotenv').config();

/*
This function is the controller for the authentication route. It calls the
authenticate function from the authService and sends the result back to the
client-side.
*/
const authenticateController = async(req, res)=>{

    // Get the user information from the request body.
    const {user} = req.body;

    // Check if the user is empty
    if(!user){
        return res.status(401).json({message: "Missing Data"});
    }

    // Call the authService's authenticate function.
    const result = await authenticate(user);

    // If the result status is 200, then the user is authenticated.
    if(result.status === 200){
        // generate the JWT token.
        const token = jwt.sign({userId: result?.user?.client_id}, process.env.SECRET_KEY);

        // Send it back to the client-side.
        return res.status(200).json({message: result.message, user: result.user, token: token});
    }

    // If the user information is incorrect, then send a 401 status code.
    res.status(401).json({message: "Unauthorized"});


}

module.exports = {
    authenticateController
}