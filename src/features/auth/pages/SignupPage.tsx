import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { supabase } from "@/lib/supabase";
import { notifySuccess, notifyError, notifyInfo } from "@/utils";
import { signupSchema, type SignupFormData } from '@/lib/validation/schemas';
import { FormButton } from "@/components/forms/FormButton";
import logo from "@/assets/logos/ANANT ENTERPRISES 1-04.png";

import {
    EmailVerificationSuccess,
    NameFields,
    EmailField,
    PhoneField,
    PasswordFields,
    SocialSignupOptions,
    SignupFooter
} from '@/components/features/auth';

import { invitationService } from '@/features/invitations/services';

interface InvitationData {
    first_name: string;
    last_name: string;
    email: string;
}

const SignupPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [signupSuccess, setSignupSuccess] = useState(false);
    const [registeredEmail, setRegisteredEmail] = useState('');

    // Invitation state
    const [isInvitationSignup, setIsInvitationSignup] = useState(false);
    const [invitationData, setInvitationData] = useState<InvitationData | null>(null);
    const [inviteToken, setInviteToken] = useState<string | null>(null);
    const [loadingInvitation, setLoadingInvitation] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<SignupFormData>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            phoneNumber: '',
            password: '',
            confirmPassword: '',
        },
    });

    // Check for invitation token on mount
    useEffect(() => {
        const token = searchParams.get('invite_token');
        if (token) {
            setInviteToken(token);
            setIsInvitationSignup(true);
            fetchInvitationDetails(token);
        }
    }, [searchParams]);

    // Fetch invitation details
    const fetchInvitationDetails = async (token: string) => {
        setLoadingInvitation(true);
        try {
            const details = await invitationService.getInvitationDetails(token);
            setInvitationData(details);

            // Pre-fill the form
            setValue('firstName', details.first_name);
            setValue('lastName', details.last_name);
            setValue('email', details.email);

            notifyInfo('Please complete your registration to accept the invitation');
        } catch (error) {
            console.error('Failed to fetch invitation details:', error);
            notifyError(error instanceof Error ? error.message : 'Invalid or expired invitation');
            // Redirect to regular signup if invitation is invalid
            setIsInvitationSignup(false);
            setInviteToken(null);
        } finally {
            setLoadingInvitation(false);
        }
    };

    // -------------------------
    // Submit Handler
    // -------------------------
    const handleSubmitForm = async (values: SignupFormData) => {
        try {
            // If this is an invitation-based signup
            if (isInvitationSignup && inviteToken && invitationData) {
                // Accept invitation through our API
                const result = await invitationService.acceptInvitation({
                    token: inviteToken,
                    email: invitationData.email,
                    first_name: values.firstName,
                    last_name: values.lastName,
                    password: values.password,
                    phone_number: values.phoneNumber,
                });

                // Store the session
                if (result.session) {
                    // Set session in Supabase client
                    await supabase.auth.setSession({
                        access_token: result.session.access_token,
                        refresh_token: result.session.refresh_token,
                    });
                }

                notifySuccess("Account created successfully! Welcome aboard!");
                navigate('/dashboard');
                return;
            }

            // Regular signup flow
            const { confirmPassword: _confirmPassword, ...signupData } = values;

            const { error } = await supabase.auth.signUp({
                email: signupData.email,
                password: signupData.password,
                options: {
                    data: {
                        firstName: signupData.firstName,
                        lastName: signupData.lastName,
                        phoneNumber: signupData.phoneNumber,
                        phone: `+91${signupData.phoneNumber}`,
                        phone_verified: true,
                    },
                },
            });

            if (error) throw error;

            // Show success screen with email verification message
            setRegisteredEmail(signupData.email);
            setSignupSuccess(true);
            notifySuccess("Account created successfully!");
        } catch (error) {
            let message = "Failed to create account. Please try again.";

            if (error instanceof Error) {
                message = error.message;
            }

            notifyError(message);
        }
    };

    // Loading state for invitation
    if (loadingInvitation) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0E042F] via-[#1a0f3e] to-[#0E042F]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
                    <p className="mt-4 text-white/60">Loading invitation details...</p>
                </div>
            </div>
        );
    }

    // Email Verification Success Screen
    if (signupSuccess) {
        return <EmailVerificationSuccess registeredEmail={registeredEmail} onNavigateToLogin={() => navigate('/login')} />;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0E042F] via-[#1a0f3e] to-[#0E042F] p-4">
            <div className="w-full max-w-2xl">
                {/* Logo/Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center mb-4">
                        <img
                            src={logo}
                            alt="Anant Enterprises Logo"
                            className="w-36 h-36 object-contain"
                        />
                    </div>
                    <h1 className="text-white text-3xl mb-2">
                        {isInvitationSignup ? 'Accept Invitation' : 'Create Account'}
                    </h1>
                    <p className="text-white/60">
                        {isInvitationSignup
                            ? 'Complete your registration to join the team'
                            : 'Sign up to get started with your account'
                        }
                    </p>
                </div>

                {/* Signup Card */}
                <div className="bg-white rounded-2xl shadow-xl p-8">

                    <form onSubmit={handleSubmit(handleSubmitForm)} className="space-y-5">

                        <NameFields register={register} errors={errors} />

                        <EmailField
                            register={register}
                            errors={errors}
                            disabled={isInvitationSignup}
                            value={invitationData?.email}
                        />

                        <PhoneField register={register} errors={errors} />

                        <PasswordFields register={register} errors={errors} />

                        {/* Submit Button */}
                        <FormButton isLoading={isSubmitting}>
                            {isInvitationSignup ? 'Accept Invitation' : 'Create Account'}
                        </FormButton>

                    </form>

                    {/* Only show social signup for regular signups, not invitation-based */}
                    {!isInvitationSignup && (
                        <SocialSignupOptions isSubmitting={isSubmitting} />
                    )}

                    <SignupFooter onNavigateToLogin={() => navigate('/login')} />
                </div>
            </div>
        </div>
    );
};

export default SignupPage;
