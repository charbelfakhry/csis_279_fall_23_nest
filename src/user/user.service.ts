import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @Inject('USER_REPOSITORY')
    private userRepository: Repository<User>,
  ) {}

  /**
   * This function is an example of how to use the repository in a service.
   */
  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }
}
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Like, Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto, UpdateUserDto } from './user.dto';

@Injectable()
export class UserService {
  constructor(
    @Inject('USER_REPOSITORY')
    private userRepository: Repository<User>,
  ) {}

  /**
   * Finds all the users.
   * @returns Promise<User[]>
   */
  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  /**
   * Finds all the users by username. Users that match the username or that have the username included
   * in their username are counted.
   * @param username
   * @returns Promise<User[]>
   */
  async findUsersByUsername(username: string): Promise<User[]> {
    const foundUsers = await this.userRepository.find({
      where: {
        username: Like(`%${username}%`),
      },
    });

    if (!(foundUsers.length > 0)) {
      throw new NotFoundException(
        `No user with a username ${username} was found`,
      );
    }

    return foundUsers;
  }

  /**
   * Finds a user with the corresponding id.
   * @param user_id
   * @returns Promise<User | null>
   */
  async findOneById(user_id: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { user_id },
    });
  }

  /**
   * Finds a user with the corresponding username
   * @param username
   * @returns Promise<User>
   */
  async findOneByUsername(username: string): Promise<User> {
    //search for the user
    const foundUser = await this.userRepository.findOne({
      where: { username },
    });

    //check if the user was found
    if (!foundUser) {
      throw new NotFoundException(
        `User with username: ${username} was not found`,
      );
    }

    return foundUser;
  }

  /**
   * Creates a new user
   * @param user
   * @returns Promise<User>
   */
  async createUser(user: CreateUserDto): Promise<User> {
    const newUser = this.userRepository.create(user);
    return await this.userRepository.save(newUser);
  }

  /**
   * Updates the user with the corresponding id
   * @param id
   * @param user
   * @returns Promise<User | null>
   */
  async updateUser(id: string, user: UpdateUserDto): Promise<User | null> {
    await this.userRepository.update(id, user);
    return this.findOneById(id); //return the updated user
  }

  /**
   * Deletes a user
   * @param id
   * @returns Promise<Void>
   */
  async deleteUser(id: string) {
    await this.userRepository.delete(id);
  }
}
