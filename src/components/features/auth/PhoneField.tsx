import { Phone } from 'lucide-react';
import { type UseFormRegister, type FieldErrors } from 'react-hook-form';
import { type SignupFormData } from '@/lib/validation/schemas';

interface PhoneFieldProps {
    register: UseFormRegister<SignupFormData>;
    errors: FieldErrors<SignupFormData>;
}

export const PhoneField = ({ register, errors }: PhoneFieldProps) => {
    return (
        <div>
            <label className="block text-sm mb-2 text-gray-700">Phone Number</label>
            <div className="flex gap-2">
                <div className="relative flex-1">
                    <Phone
                        size={20}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                        type="tel"
                        {...register('phoneNumber')}
                        placeholder="Enter 10 digit phone number"
                        maxLength={10}
                        // disabled={phoneVerified}
                        className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0E042F] disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />

                    {/* {phoneVerified && (
                        <CheckCircle
                            size={20}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-green-600"
                        />
                    )} */}
                </div>

                {/* {!phoneVerified && (
                    <button
                        type="button"
                        onClick={handleSendOtp}
                        disabled={isSendingOtp || !phoneNumber || phoneNumber.length !== 10}
                        className="px-6 py-3 bg-[#0E042F] text-white rounded-xl hover:bg-[#1a0f3e] transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                    >
                        {isSendingOtp ? 'Sending...' : otpSent ? 'Resend OTP' : 'Send OTP'}
                    </button>
                )} */}
            </div>

            {errors.phoneNumber && (
                <p className="text-red-500 text-xs mt-1">
                    {errors.phoneNumber.message}
                </p>
            )}

            {/* OTP Input Section */}
            {/* {otpSent && !phoneVerified && (
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                    <p className="text-sm text-blue-800 mb-3 font-medium">
                        Enter the 6-digit OTP sent to +91{phoneNumber}
                    </p>

                    <div className="flex flex-col items-center gap-3">
                        <InputOTP
                            maxLength={6}
                            value={otpCode}
                            onChange={(value) => {
                                setOtpCode(value);
                                setVerificationError(false);
                                if (value.length === 6) {
                                    handleVerifyOtp(value);
                                }
                            }}
                            disabled={isVerifying}
                        >
                            <InputOTPGroup>
                                <InputOTPSlot index={0} />
                                <InputOTPSlot index={1} />
                                <InputOTPSlot index={2} />
                                <InputOTPSlot index={3} />
                                <InputOTPSlot index={4} />
                                <InputOTPSlot index={5} />
                            </InputOTPGroup>
                        </InputOTP>

                        {isVerifying && (
                            <div className="flex items-center gap-2 text-sm text-blue-700">
                                <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                                <span>Verifying...</span>
                            </div>
                        )}

                        {verificationError && (
                            <div className="flex items-center gap-2 text-sm text-red-600">
                                <XCircle size={16} />
                                <span>Invalid OTP. Please try again.</span>
                            </div>
                        )}
                    </div>
                </div>
            )} */}
        </div>
    );
};