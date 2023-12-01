import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import {
  SignInCredentials,
  SignUpUserInfo,
  UserToFrontEnd,
} from 'src/types/auth.types';
import { query } from '../database/db'; // Assuming query is a default or named export from db

const saltRounds = 10; // The cost factor, controls how much time is needed to calculate a single BCrypt hash

@Injectable()
export class AuthService {
  async authenticate(
    data: SignInCredentials,
  ): Promise<{ status: number; message: string; user?: UserToFrontEnd }> {
    // Get the user information from the request body.
    const { email, password } = data;

    const sql = `SELECT * FROM users WHERE email = ?`;

    try {
      const users = await query(sql, [email]);

      // Check if the user exists
      if (users.length) {
        // Get the user
        const user = users[0];

        // Compare hashed password using bcrypt
        const match = await bcrypt.compare(password, user.password_hash);

        // If the password matches, then return the user information
        if (match) {
          return { status: 200, message: 'Successful', user: user };
        } else {
          return {
            status: 401,
            message: 'Cannot login with these credentials',
          };
        }
      } else {
        return { status: 401, message: 'Cannot login with these credentials' };
      }
    } catch (error) {
      console.log(error);
      return { status: 500, message: 'Internal Server Error' };
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
        return { status: 401, message: 'Email already exists' };
      }

      // Hashing the password before storing it in the database
      const hashedPassword = await bcrypt.hash(user.password, saltRounds);

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

      // Checking if the user was successfully added
      if (result.affectedRows > 0) {
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
          status: 200,
          message: 'User added successfully',
          user: newUser,
        };
      } else {
        // Handling failure to add user
        return { status: 400, message: 'Failed to add user' };
      }
    } catch (error) {
      // Logging and throwing error to be handled by the controller
      console.error(error);
      throw new Error('Database query failed');
    }
  }
}
