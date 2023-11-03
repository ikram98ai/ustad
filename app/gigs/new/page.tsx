import dynamic from "next/dynamic";
import GigFormSkeleton from "./loading";

const GigForm = dynamic(() => import("@/app/gigs/_components/GigForm"), {
  ssr: false,
  loading: () => <GigFormSkeleton />,
});

const NewgigPage = () => {
  return <GigForm />;
};

export default NewgigPage;
