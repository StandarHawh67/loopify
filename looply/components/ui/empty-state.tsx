import { cn } from "@/lib/utils";

type EmptyStateProps = {
  title: string;
  description: string;
  className?: string;
};

export function EmptyState({ title, description, className }: EmptyStateProps) {
  return (
    <div className={cn("panel p-8 text-center", className)}>
      <h3 className="text-2xl font-semibold">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-mist">{description}</p>
    </div>
  );
}
