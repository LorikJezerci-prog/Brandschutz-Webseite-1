import { availabilityLabel, type Availability } from "@/config/services";

export function StatusBadge({ status }: { status: Availability }) {
  return (
    <span className={`badge badge--${status}`}>
      <span className="badge__dot" aria-hidden="true" />
      {availabilityLabel[status]}
    </span>
  );
}
