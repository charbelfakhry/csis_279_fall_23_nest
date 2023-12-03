// utils.arrays.ts

import { Logger } from '@nestjs/common';
import { HttpStatusCode } from '../http.types';

const logger = new Logger('ArraysUtils');

/**
 * Returns the difference between two arrays using sets in an efficient way.
 *
 * @param arr1 - The first array.
 * @param arr2 - The second array.
 *
 * @returns The difference between arr1 and arr2.
 */
export function arrayDifference(arr1: number[], arr2: number[]): number[] {
  const set1 = new Set(arr1);
  const set2 = new Set(arr2);

  const difference1 = [...arr1.filter(item => !set2.has(item))];
  const difference2 = [...arr2.filter(item => !set1.has(item))];

  return difference1.concat(difference2);
}
