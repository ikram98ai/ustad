import { JobType } from "@/prisma/models";

const RATE_SUFFIX: Record<JobType, string> = {
  FIX: " fixed",
  HOURLY: "/hr",
  DAILY: "/day",
  MONTHLY: "/mo",
};

export const JOB_TYPE_LABEL: Record<JobType, string> = {
  FIX: "Fixed price",
  HOURLY: "Hourly",
  DAILY: "Daily",
  MONTHLY: "Monthly",
};

export function formatRate(rate: number, jobType: JobType): string {
  return `$${rate}${RATE_SUFFIX[jobType]}`;
}
