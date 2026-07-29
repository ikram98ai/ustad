import { OrderStatus } from "@/prisma/models";
import cn from "classnames";
import React, { Fragment } from "react";
import { FaCheck, FaXmark } from "react-icons/fa6";

type StepState = "done" | "current" | "upcoming" | "failed";

const stepsFor = (
  status: OrderStatus
): { label: string; state: StepState }[] => {
  if (status === "CANCELLED" || status === "REJECTED")
    return [
      { label: "Placed", state: "done" },
      {
        label: status === "CANCELLED" ? "Cancelled" : "Rejected",
        state: "failed",
      },
    ];
  return [
    { label: "Placed", state: "done" },
    {
      label: "In progress",
      state:
        status === "PENDING"
          ? "upcoming"
          : status === "ACCEPTED"
          ? "current"
          : "done",
    },
    { label: "Completed", state: status === "COMPLETED" ? "done" : "upcoming" },
  ];
};

const circleClass: Record<StepState, string> = {
  done: "bg-ink text-white",
  current: "border-2 border-blue-500 bg-blue-50 text-blue-600",
  upcoming: "border-2 border-gray-200 bg-white text-gray-300",
  failed: "bg-red-500 text-white",
};

const labelClass: Record<StepState, string> = {
  done: "text-ink",
  current: "text-blue-700",
  upcoming: "text-gray-400",
  failed: "text-red-600",
};

/** Visual timeline of where an order is in its lifecycle. */
const OrderStatusStepper = ({ status }: { status: OrderStatus }) => {
  const steps = stepsFor(status);
  return (
    <div className="flex items-start">
      {steps.map((step, index) => (
        <Fragment key={step.label}>
          {index > 0 && (
            <div
              className={cn(
                "mt-3.5 h-0.5 min-w-6 flex-1",
                step.state === "failed"
                  ? "bg-red-300"
                  : step.state === "upcoming"
                  ? "bg-gray-200"
                  : "bg-ink"
              )}
            />
          )}
          <div className="flex shrink-0 flex-col items-center gap-1.5 px-1">
            <div
              className={cn(
                "grid h-7 w-7 place-items-center rounded-full",
                circleClass[step.state]
              )}
            >
              {step.state === "done" && <FaCheck size={11} />}
              {step.state === "failed" && <FaXmark size={12} />}
              {step.state === "current" && (
                <span className="h-2 w-2 rounded-full bg-blue-500" />
              )}
            </div>
            <span
              className={cn(
                "text-xs font-medium",
                labelClass[step.state]
              )}
            >
              {step.label}
            </span>
          </div>
        </Fragment>
      ))}
    </div>
  );
};

export default OrderStatusStepper;
