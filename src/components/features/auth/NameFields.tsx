import { User } from 'lucide-react';
import { type UseFormRegister, type FieldErrors } from 'react-hook-form';
import { type SignupFormData } from '@/lib/validation/schemas';

interface NameFieldsProps {
    register: UseFormRegister<SignupFormData>;
    errors: FieldErrors<SignupFormData>;
}

export const NameFields = ({ register, errors }: NameFieldsProps) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* First Name */}
            <div>
                <label className="block text-sm mb-2 text-gray-700">First Name</label>
                <div className="relative">
                    <User
                        size={20}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                        type="text"
                        {...register('firstName')}
                        placeholder="Enter first name"
                        className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0E042F]"
                    />
                </div>

                {errors.firstName && (
                    <p className="text-red-500 text-xs mt-1">
                        {errors.firstName.message}
                    </p>
                )}
            </div>

            {/* Last Name */}
            <div>
                <label className="block text-sm mb-2 text-gray-700">Last Name</label>
                <div className="relative">
                    <User
                        size={20}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                        type="text"
                        {...register('lastName')}
                        placeholder="Enter last name"
                        className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0E042F]"
                    />
                </div>

                {errors.lastName && (
                    <p className="text-red-500 text-xs mt-1">
                        {errors.lastName.message}
                    </p>
                )}
            </div>
        </div>
    );
};