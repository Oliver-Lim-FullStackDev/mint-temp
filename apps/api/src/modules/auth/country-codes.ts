/**
 * List of allowed country codes for Hero Gaming API registration
 */
export const allowedCountryCodes = [
  355, 213, 1, 376, 244, 54, 374, 297, 994, 973, 880, 375, 32, 501, 229, 975, 591, 599, 387, 267, 55, 246, 673, 359,
  226, 257, 855, 237, 238, 236, 235, 56, 86, 61, 57, 269, 682, 506, 225, 385, 53, 357, 420, 45, 253, 593, 20, 503, 291,
  372, 251, 500, 298, 679, 358, 594, 689, 241, 220, 995, 233, 350, 30, 299, 590, 502, 44, 224, 245, 592, 509, 39, 504,
  852, 354, 91, 62, 353, 972, 81, 962, 7, 254, 686, 82, 965, 996, 856, 371, 266, 231, 218, 423, 370, 352, 265, 60, 960,
  223, 356, 692, 596, 222, 230, 262, 52, 691, 373, 377, 976, 382, 212, 258, 95, 264, 674, 977, 687, 64, 505, 227, 234,
  672, 968, 92, 680, 507, 675, 595, 51, 63, 48, 974, 40, 250, 290, 508, 685, 378, 239, 966, 221, 381, 248, 232, 65, 421,
  386, 677, 252, 27, 94, 249, 597, 47, 268, 46, 41, 886, 992, 255, 66, 670, 228, 690, 676, 216, 688, 256, 380, 971, 598,
  998, 58, 84, 681, 260, 263,
];

/**
 * Helper function to get a random country code from the allowed list
 * @returns A random country code from the allowed list
 */
export function getRandomCountryCode(): number {
  const randomIndex = Math.floor(Math.random() * allowedCountryCodes.length);
  return allowedCountryCodes[randomIndex];
}
