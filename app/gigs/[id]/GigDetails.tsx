import { formatRate, JOB_TYPE_LABEL } from "@/app/lib/format";
import { Gig } from "@/prisma/models";
import { Avatar, Card } from "@radix-ui/themes";
import ReactMarkdown from "react-markdown";
import { FaLocationDot } from "react-icons/fa6";
import GigLocationMap from "./GigLocationMapLazy";

type GigWithRelations = Gig & {
  profession: { title: string };
  user: { name: string | null; image: string | null };
};

const GigDetails = ({ gig }: { gig: GigWithRelations }) => {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold">
            {gig.profession.title}
          </span>
          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold">
            {JOB_TYPE_LABEL[gig.job_type]}
          </span>
        </div>
        <h1 className="mb-0">{gig.title}</h1>
        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
          <span className="text-lg font-bold text-ink">
            {formatRate(gig.rate, gig.job_type)}
          </span>
          <span>Covers {gig.range} km</span>
          <span>Posted {gig.created_at.toDateString()}</span>
        </div>
      </div>

      <div className="flex items-center gap-3 rounded-2xl border border-gray-200 p-3">
        <Avatar
          size="3"
          radius="full"
          src={gig.user.image ?? undefined}
          fallback={(gig.user.name ?? gig.title)[0]}
        />
        <div>
          <p className="font-semibold leading-tight">
            {gig.user.name ?? "Ustad"}
          </p>
          <p className="text-sm text-gray-500">{gig.profession.title}</p>
        </div>
      </div>

      <Card className="prose max-w-full">
        <ReactMarkdown>{gig.description}</ReactMarkdown>
      </Card>

      {gig.latitude != null && gig.longitude != null && (
        <div>
          <p className="mb-2 flex items-center gap-1.5 text-sm font-semibold">
            <FaLocationDot size={13} />
            Service area
            {gig.address && (
              <span className="font-normal text-gray-500">— {gig.address}</span>
            )}
          </p>
          <GigLocationMap
            lat={gig.latitude}
            lng={gig.longitude}
            rangeKm={gig.range}
          />
        </div>
      )}
    </div>
  );
};

export default GigDetails;
