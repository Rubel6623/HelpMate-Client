import { GlobalSkeleton } from "@/src/components/shared/GlobalSkeleton";

export default function Loading() {
  return (
    <div className="p-8">
      <GlobalSkeleton type="dashboard" />
    </div>
  );
}
