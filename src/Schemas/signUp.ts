import {z} from 'zod'

export const usernameValidation= z
.string()
.min(2, { message: 'Username must be at least 2 characters long' })
.max(20, { message: 'Username must be at most 20 characters long' })
.regex(/^[a-zA-Z0-9]+$/, { message: 'Username must only contain letters'})

export const signUpValidation=z.object({
    username: usernameValidation,
    email: z.string().email({ message: 'Invalid email address' }),
    password: z.string().min(6, { message: 'Password must be at least 6 charactrs'})
})