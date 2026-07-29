"use client";

import { JOB_TYPE_LABEL } from "@/app/lib/format";
import { Profession } from "@/prisma/models";
import { Button, Dialog, RadioGroup } from "@radix-ui/themes";
import cn from "classnames";
import {
  FaLocationCrosshairs,
  FaMagnifyingGlass,
  FaSliders,
  FaXmark,
} from "react-icons/fa6";
import { GigFilters } from "./types";

interface Props {
  filters: GigFilters;
  professions: Profession[];
  hasLocation: boolean;
  onChange: (patch: Partial<GigFilters>) => void;
  onNearMe: () => void;
}

const Chip = ({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      "shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition",
      active
        ? "bg-ink text-white"
        : "bg-gray-100 text-ink hover:bg-gray-200"
    )}
  >
    {children}
  </button>
);

const SearchFilterBar = ({
  filters,
  professions,
  hasLocation,
  onChange,
  onNearMe,
}: Props) => {
  const activeCount =
    (filters.jobType ? 1 : 0) +
    (filters.maxRate ? 1 : 0) +
    (filters.sort !== "recommended" ? 1 : 0);

  return (
    <div className="sticky top-14 z-30 -mx-4 flex flex-col gap-2.5 bg-white/95 px-4 py-2.5 backdrop-blur">
      <div className="flex items-center gap-2">
        <div className="flex h-11 flex-1 items-center gap-2.5 rounded-full bg-gray-100 px-4 transition focus-within:ring-2 focus-within:ring-ink">
          <FaMagnifyingGlass size={14} className="shrink-0 text-gray-500" />
          <input
            value={filters.q}
            onChange={(e) => onChange({ q: e.target.value })}
            placeholder="What service do you need?"
            className="w-full bg-transparent text-[15px] outline-none placeholder:text-gray-500"
          />
          {filters.q && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => onChange({ q: "" })}
              className="shrink-0 rounded-full p-1 text-gray-500 hover:bg-gray-200"
            >
              <FaXmark size={14} />
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={onNearMe}
          className="flex h-11 shrink-0 items-center gap-2 rounded-full border border-gray-300 px-3.5 text-sm font-medium transition hover:bg-gray-50"
        >
          <FaLocationCrosshairs size={15} />
          <span className="hidden sm:inline">Near me</span>
        </button>

        <Dialog.Root>
          <Dialog.Trigger>
            <button
              type="button"
              className="relative flex h-11 shrink-0 items-center gap-2 rounded-full border border-gray-300 px-3.5 text-sm font-medium transition hover:bg-gray-50"
            >
              <FaSliders size={15} />
              <span className="hidden sm:inline">Filters</span>
              {activeCount > 0 && (
                <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-ink text-[11px] font-bold text-white">
                  {activeCount}
                </span>
              )}
            </button>
          </Dialog.Trigger>

          <Dialog.Content style={{ maxWidth: 420 }}>
            <Dialog.Title>Filters</Dialog.Title>

            <p className="mb-2 mt-4 text-sm font-semibold">Job type</p>
            <div className="flex flex-wrap gap-2">
              <Chip
                active={!filters.jobType}
                onClick={() => onChange({ jobType: "" })}
              >
                Any
              </Chip>
              {Object.entries(JOB_TYPE_LABEL).map(([value, label]) => (
                <Chip
                  key={value}
                  active={filters.jobType === value}
                  onClick={() => onChange({ jobType: value })}
                >
                  {label}
                </Chip>
              ))}
            </div>

            <p className="mb-2 mt-5 text-sm font-semibold">Max rate ($)</p>
            <input
              type="number"
              min={0}
              value={filters.maxRate}
              onChange={(e) => onChange({ maxRate: e.target.value })}
              placeholder="Any budget"
              className="h-11 w-full rounded-xl border border-gray-300 px-3 outline-none transition focus:ring-2 focus:ring-ink"
            />

            <p className="mb-2 mt-5 text-sm font-semibold">Sort by</p>
            <RadioGroup.Root
              value={filters.sort}
              onValueChange={(sort) =>
                onChange({ sort: sort as GigFilters["sort"] })
              }
            >
              <RadioGroup.Item value="recommended">Newest first</RadioGroup.Item>
              <RadioGroup.Item value="price_asc">
                Price: low to high
              </RadioGroup.Item>
              <RadioGroup.Item value="price_desc">
                Price: high to low
              </RadioGroup.Item>
              <RadioGroup.Item value="nearest" disabled={!hasLocation}>
                Nearest first {!hasLocation && "(tap “Near me” to enable)"}
              </RadioGroup.Item>
            </RadioGroup.Root>

            <div className="mt-6 flex items-center justify-between">
              <Button
                variant="soft"
                color="gray"
                onClick={() =>
                  onChange({ jobType: "", maxRate: "", sort: "recommended" })
                }
              >
                Reset all
              </Button>
              <Dialog.Close>
                <Button highContrast>Show results</Button>
              </Dialog.Close>
            </div>
          </Dialog.Content>
        </Dialog.Root>
      </div>

      <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 py-0.5">
        <Chip
          active={!filters.professionId}
          onClick={() => onChange({ professionId: "" })}
        >
          All
        </Chip>
        {professions.map((p) => (
          <Chip
            key={p.id}
            active={filters.professionId === p.id}
            onClick={() =>
              onChange({
                professionId: filters.professionId === p.id ? "" : p.id,
              })
            }
          >
            {p.title}
          </Chip>
        ))}
      </div>
    </div>
  );
};

export default SearchFilterBar;
