import { Mail } from 'lucide-react';
import { type UseFormRegister, type FieldErrors } from 'react-hook-form';
import { type SignupFormData } from '@/lib/validation/schemas';

export interface EmailFieldProps {
    register: UseFormRegister<SignupFormData>;
    errors: FieldErrors<SignupFormData>;
    disabled?: boolean;
    value?: string;
}

export const EmailField = ({ register, errors, disabled, value }: EmailFieldProps) => {
    return (
        <div>
            <label className="block text-sm mb-2 text-gray-700">Email</label>
            <div className="relative">
                <Mail
                    size={20}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                    type="email"
                    {...register('email')}
                    placeholder="Enter your email"
                    disabled={disabled}
                    value={disabled ? value : undefined}
                    className={`w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0E042F] ${disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''
                        }`}
                />
            </div>

            {errors.email && (
                <p className="text-red-500 text-xs mt-1">
                    {errors.email.message}
                </p>
            )}
        </div>
    );
};