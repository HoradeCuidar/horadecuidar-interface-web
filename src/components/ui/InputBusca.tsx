import { Input } from "@/components/ui/input";
import { IconeLupa } from "@/components/icons";

export function InputBusca(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="relative w-full">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 flex items-center justify-center">
        <IconeLupa />
      </div>
      <Input
        {...props}
        placeholder="Pesquisar..."
        className="pl-10 bg-zinc-100 border-zinc-200 focus-visible:ring-indigo-500 dark:bg-zinc-950 dark:border-zinc-800"
      />
    </div>
  );
}
