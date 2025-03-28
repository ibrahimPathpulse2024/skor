import { clsx } from "clsx"
import { isAfter, isEqual } from "date-fns"
import { twMerge } from "tailwind-merge"


export function cn(...inputs) {
	return twMerge(clsx(inputs))
}

/**
 * Checks if the first date is equal to or after the second date.
 *
 * @param date1 - The first date to compare.
 * @param date2 - The second date to compare.
 * @returns `true` if `date1` is equal to or after `date2`, otherwise `false`.
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isDateEqualOrAfter(date1, date2) {
	return isEqual(date1, date2) || isAfter(date1, date2)
}
