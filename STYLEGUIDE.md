# STYLE GUIDE

This is the official style guide to help those of us who are new to typescript and nest, and for us to have
one uniform style of coding through the entire project.

# DOs and DONTs

### 1 - DONT use `any` in typescript unless absolutely necessary.

```typescript
// DONT DO THIS
function add(num1: any, num2: any): any {
  return num1 + num2;
}

// THIS IS BETTER
function add(num1: number, num2: number): number {
  return num1 + num2;
}
```

### 2 - DONT use camel case for file types

```shelll
# This is bad!
userController.ts
userService.ts
userModel.ts
userEntity.ts
userTest.ts

# This is good!
user.controller.ts
user.service.ts
user.model.ts
user.entity.ts
user.test.ts
```

### 3 - DO use ECMAscript syntax for import and export

```typescript
// This is bad!
const express = require("express");
const { useState } = require("react");

module.exports = { app: express() };

// This is good!
import express from "express";
import { useState } from "react";

const app = express();

export default app;

export function hello() {
};
```

### 4 - DO use JSDOC documentation style

```typescript
// DONT DO THIS

// this function is used to divide two numbers
function divide(num1: number, num2: number): number {
  if (num2 === 0) throw new Error("can't divide by 0");
  return num1 / num2;
}

// DO THIS

/**
 * This function is used to divide two numbers.
 *
 * @param num1
 * @param num2
 *
 * @throws Error when num2 = 0.
 */
function divide(num1: number, num2: number): number {
  if (num2 === 0) throw new Error("can't divide by 0");
  return num1 / num2;
}
```

### 5 - DONT - write code like you would do in vanilla express.

Always use nest js style code (springboot similar) and not express js style code.

```typescript
// DONT DO THIS
import express from "express";

function helloController(req: express.Request, res: express.Response) {
  return res.status(200).send("Hello world.");
}

// DO THIS
import { Controller, Get } from "@nestjs/common";

@Controller("hello")
export class HelloController {
  @Get()
  replyHelloWorld(): string {
    return "Hello world."
  }
}
```

### 6 - DO use the nest js Logger instead of console.log

```typescript
// This is bad!!

@Injectable()
export class TasksService {

  @Cron('45 * * * * *')
  handleCron() {
    console.log('Called when the current second is 45');
  }
}

// This is good!!

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  @Cron('45 * * * * *')
  handleCron() {
    this.logger.debug('Called when the current second is 45');
  }
}
```

### 7 - DONT use the same log level for everything

```typescript
// Do the following
@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  logging() {
    this.logger.debug('This is an info message, mostly used for debugging.');
    this.logger.error('This is an error message, something went wrong!');
    this.logger.fatal(`This is also an error message, 
                       but extremley severe. use this when something that breaks functionality happens.`);
  }
}
```

### 8 - DO use the enum defined in http.types.ts for status codes

```typescript
// This is bad!

if (message.status === 200) {

}

// This is good!

import { HttpStatusCode } from "./http.types";
if (message.status === HttpStatusCode.OK) {
  
}
```

### 9 - DO use throw new nest js error 
```typescript
// DONT DO THIS
use(req: RequestWithUser, res: Repsonse, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    res.send({status: 401, message: "Unauthorized"});
  }
}

// DO THIS
use(req: RequestWithUser, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    throw new UnauthorizedException('No token provided');
  }
}
```

---

# References

1. ### [Nest js documentation](https://docs.nestjs.com/)
2. ### [Typescript documentation](https://www.typescriptlang.org/docs/)
3. ### [Typeorm documentation](https://typeorm.io/)
4. ### [Git documentation](https://git-scm.com/docs/git)
