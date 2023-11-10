import React from "react";
import prisma from "@/prisma/client";
import { notFound } from "next/navigation";
import dynamic from "next/dynamic";
import OrderFormSkeleton from "./loading";

const OrderForm = dynamic(
  () => import("@/app/gigs/[id]/orders/_components/OrderForm"),
  {
    ssr: false,
    loading: () => <OrderFormSkeleton />,
  }
);

interface Props {
  params: { id: string };
}

const EditOrderPage = async ({ params }: Props) => {
  const order = await prisma.order.findUnique({
    where: { id: params.id },
  });

  if (!order) notFound();

  return <OrderForm order={order} />;
};

export default EditOrderPage;
