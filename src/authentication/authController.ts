import { Controller, Post, Body, Res } from '@nestjs/common';
import { AuthService } from './authService';
import { Response } from 'express';
var jwt = require('jsonwebtoken');

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('authenticate')
    async authenticateUser(@Body('user') user, @Res() res: Response) {
        try {
            // Check if the user is empty
            if (!user) {
                return res.status(400).json({ message: "Missing Data" });
            }

            // Call the authService's authenticate function.
            const result = await this.authService.authenticate(user);

            if (result.status === 200) {
                // Generate the JWT token.
                let token;
                try {
                    token = jwt.sign({ userId: result.user.client_id }, process.env.SECRET_KEY);
                } catch (tokenError) {
                    return res.status(500).json({ message: "Error generating token" });
                }

                // Send the token and the user information back to the client-side.
                return res.status(200).json({ message: result.message, user: result.user, token: token });
            } else {
                return res.status(result.status).json({ message: result.message });
            }
        } catch (error) {
            // Log the error
            console.error(error);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }

    @Post('signup')
    async insertUser(@Body('user') user, @Res() res: Response) {
        try {
            // Validate the presence of user data
            if (!user) {
                // Respond with a Bad Request status if user data is missing
                return res.status(400).json({ message: "Missing Data" });
            }

            // Calling the addUser function from authService
            const result = await this.authService.addUser(user);

            // Check if user creation is successful
            if (result.status === 200) {
                let token;
                try {
                    // Generating JWT token
                    token = jwt.sign({ userId: result.user.client_id }, process.env.SECRET_KEY);
                } catch (tokenError) {
                    // Handling token generation errors
                    return res.status(500).json({ message: "Error generating token" });
                }

                // Sending the success response with token and user data
                return res.status(200).json({ message: result.message, user: result.user, token: token });
            } else {
                // Handling other types of user creation failures
                return res.status(result.status).json({ message: result.message });
            }
        } catch (error) {
            // Log the error
            console.error(error);
            res.status(500).json({ message: "Internal server error" });
        }
    }
}