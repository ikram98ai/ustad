import dynamic from "next/dynamic";
import OrderFormSkeleton from "./loading";

const OrderForm = dynamic(
  () => import("@/app/gigs/[id]/orders/_components/OrderForm"),
  {
    ssr: false,
    loading: () => <OrderFormSkeleton />,
  }
);

const NewIssuePage = () => {
  return <OrderForm />;
};

export default NewIssuePage;
