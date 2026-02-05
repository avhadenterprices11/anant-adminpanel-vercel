import { z } from 'zod';

export const createInvitationSchema = z.object({
    first_name: z.string().min(1, 'First name is required'),
    last_name: z.string().min(1, 'Last name is required'),
    email: z.string().email('Please enter a valid email'),
    assigned_role_id: z.string().min(1, 'Please select a role'),
});

export type CreateInvitationFormData = z.infer<typeof createInvitationSchema>;

export const acceptInvitationSchema = z.object({
    first_name: z.string().min(1, 'First name is required'),
    last_name: z.string().min(1, 'Last name is required'),
    email: z.string().email('Invalid email'),
    phone_number: z.string().optional(),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
});

export type AcceptInvitationFormData = z.infer<typeof acceptInvitationSchema>;
