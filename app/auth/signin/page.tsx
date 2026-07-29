import Link from "next/link";
import AuthShell from "../_components/AuthShell";
import SignInForm from "./SignInForm";

const SignInPage = () => (
  <AuthShell
    title="Welcome back"
    subtitle="Sign in to hire ustads or manage your gigs"
    footer={
      <>
        New to Ustad?{" "}
        <Link
          href="/auth/signup"
          className="font-semibold text-ink underline underline-offset-2"
        >
          Create an account
        </Link>
      </>
    }
  >
    <SignInForm />
  </AuthShell>
);

export const metadata = {
  title: "Sign in",
  description: "Sign in to Ustad",
};

export default SignInPage;
