import authOptions from "@/app/auth/authOptions";
import prisma from "@/prisma/client";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import AuthShell from "../_components/AuthShell";
import CompleteProfileForm from "./CompleteProfileForm";

const CompleteProfilePage = async () => {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/auth/signin?callbackUrl=/auth/complete-profile");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, email: true, image: true, phone: true },
  });
  if (!user) redirect("/auth/signin");

  return (
    <AuthShell
      title="Complete your profile"
      subtitle="Tell customers and ustads who they are talking to"
    >
      <CompleteProfileForm
        initialName={user.name ?? ""}
        initialPhone={user.phone ?? ""}
        initialImage={user.image ?? ""}
        email={user.email ?? ""}
      />
    </AuthShell>
  );
};

export const metadata = {
  title: "Complete profile",
  description: "Finish setting up your Ustad account",
};

export const dynamic = "force-dynamic";

export default CompleteProfilePage;
