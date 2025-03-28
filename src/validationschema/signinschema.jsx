import * as z from "zod"

export const signInSchema = z.object({
email: z.string().email("Please enter a valid email address").nonempty("Email is required"),
})