"use client";
import { ErrorMessage, Spinner } from "@/app/components";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, TextField } from "@radix-ui/themes";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { useForm } from "react-hook-form";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import { z } from "zod";
import GoogleButton from "../_components/GoogleButton";
import OrDivider from "../_components/OrDivider";

const signInSchema = z.object({
  email: z.email("Enter a valid email address."),
  password: z.string().min(1, "Password is required."),
});

type SignInData = z.infer<typeof signInSchema>;

const authErrorMessages: Record<string, string> = {
  CredentialsSignin: "Invalid email or password.",
  OAuthAccountNotLinked:
    "This email is already linked to another sign-in method.",
};

// useSearchParams needs a Suspense boundary for static prerendering.
const SignInForm = () => (
  <Suspense>
    <SignInFormInner />
  </Suspense>
);

const SignInFormInner = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const urlError = searchParams.get("error");

  const [error, setError] = useState(
    urlError ? authErrorMessages[urlError] ?? "Could not sign you in." : ""
  );
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInData>({ resolver: zodResolver(signInSchema) });

  const onSubmit = handleSubmit(async (data) => {
    setSubmitting(true);
    setError("");
    const res = await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
    });
    if (res?.error) {
      setError("Invalid email or password.");
      setSubmitting(false);
    } else {
      router.push(callbackUrl);
      router.refresh();
    }
  });

  return (
    <>
      <GoogleButton callbackUrl={callbackUrl} />
      <OrDivider />
      <form className="space-y-3" onSubmit={onSubmit}>
        <div>
          <TextField.Root
            size="3"
            type="email"
            placeholder="Email address"
            autoComplete="email"
            {...register("email")}
          />
          <ErrorMessage>{errors.email?.message}</ErrorMessage>
        </div>
        <div>
          <TextField.Root
            size="3"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            autoComplete="current-password"
            {...register("password")}
          >
            <TextField.Slot side="right">
              <button
                type="button"
                tabIndex={-1}
                aria-label={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword((v) => !v)}
                className="text-gray-400 hover:text-ink"
              >
                {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
              </button>
            </TextField.Slot>
          </TextField.Root>
          <ErrorMessage>{errors.password?.message}</ErrorMessage>
        </div>
        {error && <p className="text-sm font-medium text-red-600">{error}</p>}
        <Button
          size="3"
          highContrast
          disabled={isSubmitting}
          className="w-full!"
        >
          Sign in {isSubmitting && <Spinner />}
        </Button>
      </form>
    </>
  );
};

export default SignInForm;
