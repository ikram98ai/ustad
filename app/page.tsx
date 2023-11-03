import GigsPage, { gigQuery } from "./gigs/list/page";
interface Props {
  searchParams: gigQuery;
}
export default function Home({ searchParams }: Props) {
  return (
    <>
      <GigsPage searchParams={searchParams} />
    </>
  );
}
