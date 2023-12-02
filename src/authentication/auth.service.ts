import { Injectable, Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import {
  SignInCredentials,
  SignUpUserInfo,
  UserToFrontEnd,
} from 'src/types/auth.types';
import { query } from '../database/db';
import { HttpStatusCode } from '../types/http.types'; // Assuming query is a default or named export from db

const SALT_ROUNDS = 15; // The cost factor, controls how much time is needed to calculate a single BCrypt hash

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  async authenticate(
    data: SignInCredentials,
  ): Promise<{ status: number; message: string; user?: UserToFrontEnd }> {
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

      return {
        status: HttpStatusCode.OK,
        message: 'Successful',
        user: user,
      };
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
  ): Promise<{ status: number; message: string; user?: UserToFrontEnd }> {
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
      return {
        status: HttpStatusCode.OK,
        message: 'User added successfully',
        user: newUser,
      };
    } catch (error) {
      // Logging and throwing error to be handled by the controller
      this.logger.fatal(error);
      throw new Error('Database query failed');
    }
  }
}
