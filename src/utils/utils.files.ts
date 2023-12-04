/**
 * Generates a unique file name based on timestamp and random string.
 *
 * @returns {string} The unique file name.
 */
export function generateUniqueFileName(): string {
  // Get current timestamp and remove non-numeric characters
  const timestamp = new Date().toISOString().replace(/[^0-9]/g, '');

  //Generate a random string
  const randomString = Math.random().toString(36).substring(7);

  // Combine timestamp and random string to create a unique filename
  const uniqueFileName = `${timestamp}_${randomString}`;

  return uniqueFileName;
}
