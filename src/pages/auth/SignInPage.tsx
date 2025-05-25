import React from 'react';
import { SignIn } from '@clerk/clerk-react';

export const SignInPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Access your TechGear account
          </p>
        </div>
        <div className="flex justify-center">
          <SignIn
            appearance={{
              elements: {
                card: "bg-[#0a0a0a] border border-gray-700 shadow-xl",
                headerTitle: "text-white text-2xl",
                headerSubtitle: "text-gray-400",
                socialButtonsBlockButton: "bg-gray-800 border-gray-600 text-white hover:bg-gray-700 transition-colors",
                socialButtonsBlockButtonText: "text-white",
                formFieldInput: "bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-[#00a8ff] focus:ring-[#00a8ff]",
                formFieldLabel: "text-gray-300",
                formButtonPrimary: "bg-[#00a8ff] hover:bg-[#0090e0] text-white font-medium transition-colors",
                footerActionText: "text-gray-400",
                footerActionLink: "text-[#00a8ff] hover:text-[#0090e0] transition-colors",
                dividerText: "text-gray-400",
                dividerLine: "bg-gray-600",
                alternativeMethodsBlockButton: "bg-gray-800 border-gray-600 text-white hover:bg-gray-700 transition-colors",
                alternativeMethodsBlockButtonText: "text-white",
                otpCodeFieldInput: "bg-gray-800 border-gray-600 text-white",
                formResendCodeLink: "text-[#00a8ff] hover:text-[#0090e0] transition-colors",
                identityPreviewText: "text-gray-300",
                identityPreviewEditButton: "text-[#00a8ff] hover:text-[#0090e0]"
              }
            }}
            redirectUrl="/"
          />
        </div>
      </div>
    </div>
  );
};
