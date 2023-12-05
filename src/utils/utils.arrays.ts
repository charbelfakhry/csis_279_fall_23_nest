// utils.arrays.ts

/**
 * Returns the difference between two arrays using sets in an efficient way.
 *
 * @param arr1 - The first array.
 * @param arr2 - The second array.
 *
 * @returns The difference between arr1 and arr2.
 */
export function arrayDifference(
  arr1: string[],
  arr2: string[] | Set<string>,
): string[] {
  const set2 = new Set(arr2);

  return [...arr1.filter((item) => !set2.has(item))];
}
