"use client";
import { ErrorMessage, Spinner } from "@/app/components";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, TextField } from "@radix-ui/themes";
import axios, { AxiosError } from "axios";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import { z } from "zod";
import GoogleButton from "../_components/GoogleButton";
import OrDivider from "../_components/OrDivider";

const signUpFormSchema = z
  .object({
    email: z.email("Enter a valid email address."),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters.")
      .max(100),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match.",
  });

type SignUpData = z.infer<typeof signUpFormSchema>;

const SignUpForm = () => {
  const router = useRouter();
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpData>({ resolver: zodResolver(signUpFormSchema) });

  const onSubmit = handleSubmit(async (data) => {
    try {
      setSubmitting(true);
      setError("");
      await axios.post("/api/users", {
        email: data.email,
        password: data.password,
      });
      // Sign the new account in, then finish the profile so native accounts
      // reach the same completeness as Google ones (name, photo, phone).
      const res = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });
      if (res?.error) {
        router.push("/auth/signin");
        return;
      }
      router.push("/auth/complete-profile");
      router.refresh();
    } catch (err) {
      setSubmitting(false);
      if (err instanceof AxiosError && err.response?.status === 409)
        setError("An account with this email already exists.");
      else setError("Could not create your account. Please try again.");
    }
  });

  return (
    <>
      <GoogleButton callbackUrl="/" />
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
            placeholder="Password (min. 8 characters)"
            autoComplete="new-password"
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
        <div>
          <TextField.Root
            size="3"
            type={showPassword ? "text" : "password"}
            placeholder="Confirm password"
            autoComplete="new-password"
            {...register("confirmPassword")}
          />
          <ErrorMessage>{errors.confirmPassword?.message}</ErrorMessage>
        </div>
        {error && <p className="text-sm font-medium text-red-600">{error}</p>}
        <Button
          size="3"
          highContrast
          disabled={isSubmitting}
          className="w-full!"
        >
          Create account {isSubmitting && <Spinner />}
        </Button>
      </form>
      <p className="mt-4 text-center text-xs text-gray-400">
        By continuing you agree to Ustad&apos;s terms of service.
      </p>
    </>
  );
};

export default SignUpForm;
