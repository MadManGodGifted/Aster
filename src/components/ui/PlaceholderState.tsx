import { Radio } from "lucide-react";
import { HUDPanel } from "@/components/ui/HUDPanel";

export function PlaceholderState({ title, description }: { title: string; description: string }) { return <HUDPanel className="flex min-h-52 flex-col items-center justify-center text-center"><Radio className="mb-4 text-[var(--color-primary)] opacity-70" size={28} strokeWidth={1} /><p className="m-0 text-sm uppercase tracking-[0.12em] text-[var(--color-primary)]">{title}</p><p className="mb-0 mt-2 max-w-sm text-xs leading-6 text-[var(--color-muted)]">{description}</p></HUDPanel>; }
