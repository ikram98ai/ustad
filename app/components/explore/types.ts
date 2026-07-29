import { JobType } from "@/prisma/models";

/** Gig shape returned by GET /api/gigs (and the server-side initial load). */
export interface ExploreGig {
  id: string;
  title: string;
  description: string;
  rate: number;
  range: number;
  latitude: number | null;
  longitude: number | null;
  address: string | null;
  created_at: string | Date;
  is_active: boolean;
  job_type: JobType;
  professionId: string;
  userId: string;
  user: { name: string | null; image: string | null };
  profession: { title: string };
}

export interface GigFilters {
  q: string;
  professionId: string; // "" = all
  jobType: string; // "" = any
  maxRate: string; // "" = no cap
  sort: "recommended" | "price_asc" | "price_desc" | "nearest";
}

export const DEFAULT_FILTERS: GigFilters = {
  q: "",
  professionId: "",
  jobType: "",
  maxRate: "",
  sort: "recommended",
};
