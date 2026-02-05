import { CheckCircle, Mail } from 'lucide-react';
import { supabase } from "@/lib/supabase";
import { notifySuccess, notifyError } from "@/utils";
import logo from "@/assets/logos/ANANT ENTERPRISES 1-04.png";

interface EmailVerificationSuccessProps {
    registeredEmail: string;
    onNavigateToLogin: () => void;
}

export const EmailVerificationSuccess = ({ registeredEmail, onNavigateToLogin }: EmailVerificationSuccessProps) => {

    const handleResendEmail = async () => {
        try {
            const { error } = await supabase.auth.resend({
                type: 'signup',
                email: registeredEmail,
            });
            if (error) throw error;
            notifySuccess("Verification email resent successfully!");
        } catch (_error) {
            notifyError("Failed to resend email. Please try again.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0E042F] via-[#1a0f3e] to-[#0E042F] p-4">
            <div className="w-full max-w-md">
                {/* Logo/Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center mb-0">
                        <img
                            src={logo}
                            alt="Anant Enterprises Logo"
                            className="w-36 h-36 object-contain"
                        />
                    </div>
                </div>

                {/* Success Card */}
                <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
                    <div className="flex justify-center mb-6">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-12 h-12 text-green-600" />
                        </div>
                    </div>

                    <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                        Check Your Email
                    </h2>

                    <p className="text-gray-600 mb-4">
                        We've sent a verification link to:
                    </p>

                    <p className="text-[#0E042F] font-semibold mb-6 bg-gray-100 py-2 px-4 rounded-lg inline-block">
                        {registeredEmail}
                    </p>

                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                        <div className="flex items-start gap-3">
                            <Mail className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                            <div className="text-left">
                                <p className="text-sm text-blue-800 font-medium">
                                    Verify your email to continue
                                </p>
                                <p className="text-sm text-blue-700 mt-1">
                                    Click the link in your email to verify your account.
                                    Don't forget to check your spam folder if you don't see it.
                                </p>
                            </div>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onNavigateToLogin}
                        className="w-full bg-[#0E042F] text-white py-3 rounded-xl hover:bg-[#1a0f3e] transition-colors font-medium"
                    >
                        Go to Login
                    </button>

                    <p className="text-sm text-gray-500 mt-4">
                        Didn't receive the email?{' '}
                        <button
                            type="button"
                            onClick={handleResendEmail}
                            className="text-[#0E042F] hover:text-[#1a0f3e] font-medium"
                        >
                            Resend email
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};