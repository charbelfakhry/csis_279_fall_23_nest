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
   * @param email email of the user to get.
   * @returns User instance if found, or null otherwise.
   */
  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOneBy({
      email: email,
    });
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
  async findOneByUsername(username: string): Promise<User | null> {
    //search for the user
    return await this.userRepository.findOne({
      where: { username },
    });
  }

  async createUserRequired(
    username: string,
    email: string,
    password: string,
  ): Promise<User> {
    const newUser = this.userRepository.create({
      username,
      email,
      password_hash: password,
    });

    return this.userRepository.save(newUser);
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
