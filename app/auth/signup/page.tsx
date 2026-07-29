import Link from "next/link";
import AuthShell from "../_components/AuthShell";
import SignUpForm from "./SignUpForm";

const SignUpPage = () => (
  <AuthShell
    title="Create your account"
    subtitle="Join Ustad to hire skilled pros — or become one"
    footer={
      <>
        Already have an account?{" "}
        <Link
          href="/auth/signin"
          className="font-semibold text-ink underline underline-offset-2"
        >
          Sign in
        </Link>
      </>
    }
  >
    <SignUpForm />
  </AuthShell>
);

export const metadata = {
  title: "Sign up",
  description: "Create an Ustad account",
};

export default SignUpPage;
