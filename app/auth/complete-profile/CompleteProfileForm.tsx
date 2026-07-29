"use client";
import { ErrorMessage, Spinner } from "@/app/components";
import { profileSchema } from "@/app/validationSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Avatar, Button, TextField } from "@radix-ui/themes";
import axios from "axios";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

type ProfileData = z.infer<typeof profileSchema>;

interface Props {
  initialName: string;
  initialPhone: string;
  initialImage: string;
  email: string;
}

const CompleteProfileForm = ({
  initialName,
  initialPhone,
  initialImage,
  email,
}: Props) => {
  const router = useRouter();
  const { update } = useSession();
  const [isSubmitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ProfileData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: initialName,
      phone: initialPhone,
      image: initialImage,
    },
  });

  const imagePreview = watch("image") || initialImage;
  const namePreview = watch("name") || initialName;

  const onSubmit = handleSubmit(async (data) => {
    try {
      setSubmitting(true);
      const { data: user } = await axios.patch("/api/users/me", data);
      // Refresh the JWT so the navbar name/avatar update without re-login.
      await update({ name: user.name, image: user.image ?? undefined });
      toast.success("Profile saved. Welcome to Ustad!");
      router.push("/");
      router.refresh();
    } catch (error) {
      setSubmitting(false);
      toast.error("Could not save your profile.");
    }
  });

  return (
    <form className="space-y-3" onSubmit={onSubmit}>
      <div className="mb-5 flex items-center gap-4">
        <Avatar
          src={imagePreview || undefined}
          fallback={namePreview.trim().charAt(0).toUpperCase() || "?"}
          size="5"
          radius="full"
          referrerPolicy="no-referrer"
        />
        <div className="min-w-0">
          <p className="truncate font-semibold">{namePreview || "Your name"}</p>
          <p className="truncate text-sm text-gray-500">{email}</p>
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Full name</label>
        <TextField.Root
          size="3"
          placeholder="e.g. Ahmed Khan"
          autoComplete="name"
          {...register("name")}
        />
        <ErrorMessage>{errors.name?.message}</ErrorMessage>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">
          Phone <span className="font-normal text-gray-400">(optional)</span>
        </label>
        <TextField.Root
          size="3"
          type="tel"
          placeholder="+92 300 1234567"
          autoComplete="tel"
          {...register("phone")}
        />
        <ErrorMessage>{errors.phone?.message}</ErrorMessage>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">
          Photo URL <span className="font-normal text-gray-400">(optional)</span>
        </label>
        <TextField.Root
          size="3"
          type="url"
          placeholder="https://…"
          {...register("image")}
        />
        <ErrorMessage>{errors.image?.message}</ErrorMessage>
      </div>

      <Button size="3" highContrast disabled={isSubmitting} className="w-full!">
        Save and continue {isSubmitting && <Spinner />}
      </Button>
      <p className="text-center">
        <Link
          href="/"
          className="text-sm text-gray-500 underline underline-offset-2"
        >
          Skip for now
        </Link>
      </p>
    </form>
  );
};

export default CompleteProfileForm;
