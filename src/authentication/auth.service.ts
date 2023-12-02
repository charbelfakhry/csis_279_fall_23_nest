import { Injectable, Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import {
    SignInCredentials,
    SignUpUserInfo,
    UserToFrontEnd,
} from 'src/types/auth.types';
import { query } from '../database/db'; // Will switch to ORM later on.
import { HttpStatusCode } from '../types/http.types';
import { JwtService } from '@nestjs/jwt';

const SALT_ROUNDS = 15; // The cost factor, controls how much time is needed to calculate a single BCrypt hash

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);

    // Initialize the JwtService.
    constructor(private jwtService: JwtService) { }

    // Function to create JWT token
    private async createToken(userId: number): Promise<string> {
        const payload = { sub: userId };
        return this.jwtService.signAsync(payload);
    }

    // Function for logging in the user.
    async authenticate(
        data: SignInCredentials,
    ): Promise<{ status: number; message: string; user?: UserToFrontEnd, token?: string }> {
        // Get the user information from the request body.
        const { email, password } = data;

        const sql = `SELECT * FROM users WHERE email = ?`;

        try {
            const users = await query(sql, [email]);

            // Check if the user exists
            if (!users.length) {
                return {
                    status: HttpStatusCode.UNAUTHORIZED,
                    message: 'Cannot login with these credentials',
                };
            }

            // Get the user
            const user = users[0];

            // Compare hashed password using bcrypt
            const match = await bcrypt.compare(password, user.password_hash);

            // If the password matches, then return the user information
            if (!match) {
                return {
                    status: HttpStatusCode.UNAUTHORIZED,
                    message: 'Cannot login with these credentials',
                };
            }

            try {
                const token = await this.createToken(user.user_id);
                return {
                    status: HttpStatusCode.OK,
                    message: 'Successful',
                    user: user,
                    token: token,
                };
            } catch (tokenError) {
                return {
                    status: HttpStatusCode.INTERNAL_SERVER_ERROR,
                    message: 'Error Generating Token',
                    user: user,
                    token: undefined,
                }
            }


        } catch (error) {
            this.logger.fatal(error);
            return {
                status: HttpStatusCode.INTERNAL_SERVER_ERROR,
                message: 'Internal Server Error',
            };
        }
    }

    async addUser(
        user: SignUpUserInfo,
    ): Promise<{ status: number; message: string; user?: UserToFrontEnd, token?: string }> {
        try {
            // Query to check if the user already exists in the database
            const checkSql = 'SELECT * FROM users WHERE email = ?';
            const users = await query(checkSql, [user.email]);

            // If user already exists, return an appropriate response
            if (users.length > 0) {
                return {
                    status: HttpStatusCode.UNAUTHORIZED,
                    message: 'Email already exists',
                };
            }

            // Hashing the password before storing it in the database
            const hashedPassword = await bcrypt.hash(user.password, SALT_ROUNDS);

            // SQL query to insert the new user into the database
            const insertSql =
                'INSERT INTO users (username, email, password_hash, full_name, created_at) VALUES (?, ?, ?, ?, ?)';
            const result = await query(insertSql, [
                user.username,
                user.email,
                hashedPassword,
                user.full_name,
                new Date().toISOString(),
            ]);

            // Constructing user object to return, excluding the password
            const newUser = {
                user_id: result.user_id,
                username: user.username,
                email: user.email,
                full_name: user.full_name,
                bio: user.bio,
                profile_picture_url: user.profile_picture_url,
                created_at: new Date().toISOString(),
            };

            // Create the token and check for errors.
            try {
                const token = await this.createToken(newUser.user_id);
                return {
                    status: HttpStatusCode.OK,
                    message: 'User added successfully',
                    user: newUser,
                    token: token,
                };
            } catch (tokenError) {
                return {
                    status: HttpStatusCode.INTERNAL_SERVER_ERROR,
                    message: 'Error Generating Token',
                    user: newUser,
                    token: undefined,
                }
            }

        } catch (error) {
            this.logger.fatal(error);
            return {
                status: HttpStatusCode.INTERNAL_SERVER_ERROR,
                message: 'Internal Server Error',
            };
        }
    }
}