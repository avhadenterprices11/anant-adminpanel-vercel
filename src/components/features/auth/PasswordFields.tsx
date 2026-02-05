import { useState } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { type UseFormRegister, type FieldErrors } from 'react-hook-form';
import { type SignupFormData } from '@/lib/validation/schemas';

interface PasswordFieldsProps {
    register: UseFormRegister<SignupFormData>;
    errors: FieldErrors<SignupFormData>;
}

export const PasswordFields = ({ register, errors }: PasswordFieldsProps) => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Password */}
            <div>
                <label className="block text-sm mb-2 text-gray-700">Password</label>

                <div className="relative">
                    <Lock
                        size={20}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                        type={showPassword ? "text" : "password"}
                        {...register('password')}
                        placeholder="Enter password"
                        className="w-full pl-12 pr-12 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0E042F]"
                    />

                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                </div>

                {errors.password && (
                    <p className="text-red-500 text-xs mt-1">
                        {errors.password.message}
                    </p>
                )}
            </div>

            {/* Confirm Password */}
            <div>
                <label className="block text-sm mb-2 text-gray-700">Confirm Password</label>

                <div className="relative">
                    <Lock
                        size={20}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                        type={showConfirmPassword ? "text" : "password"}
                        {...register('confirmPassword')}
                        placeholder="Confirm password"
                        className="w-full pl-12 pr-12 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0E042F]"
                    />

                    <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                </div>

                {errors.confirmPassword && (
                    <p className="text-red-500 text-xs mt-1">
                        {errors.confirmPassword.message}
                    </p>
                )}
            </div>
        </div>
    );
};