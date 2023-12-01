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
const {useState} = require("react");

module.exports = {app: express()};

// This is good!
import express from "express";
import { useState } from "react";

const app = express();

export default app;

export function hello(){};
```

### 4 - DO use JSDOC documentation style

```typescript
// DONT DO THIS

// this function is used to divide two numbers
function divide(num1: number, num2: number): number {
  if(num2 === 0) throw new Error("can't divide by 0");
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
  if(num2 === 0) throw new Error("can't divide by 0");
  return num1 / num2;
}
```

---

# References
1. ### [Nest js documentation](https://docs.nestjs.com/)
2. ### [Typescript documentation](https://www.typescriptlang.org/docs/)
3. ### [Typeorm documentation](https://typeorm.io/)