interface SignupFooterProps {
    onNavigateToLogin: () => void;
}

export const SignupFooter = ({ onNavigateToLogin }: SignupFooterProps) => {

    return (
        <p className="text-center text-sm text-gray-600 mt-6">
            Already have an account?{' '}
            <button
                type="button"
                onClick={onNavigateToLogin}
                className="text-[#0E042F] hover:text-[#1a0f3e] transition-colors font-medium"
            >
                Sign in
            </button>
        </p>
    );
};