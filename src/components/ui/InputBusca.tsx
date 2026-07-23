import { Input } from "@/components/ui/input";
import { IconeLupa } from "@/components/icons";

export function InputBusca(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="relative w-full">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 flex h-4 w-4 items-center justify-center text-text-muted">
        <IconeLupa />
      </div>
      <Input
        {...props}
        placeholder="Pesquisar..."
        className="border-zinc-300 bg-white pl-10 focus-visible:border-brand-500 focus-visible:ring-brand-500"
      />
    </div>
  );
}
