import UserForm from "@/components/UserForm";
import { Keyboard } from "lucide-react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black px-4 md:px-24 py-12 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-[1000px] h-[1000px] bg-yellow-500/10 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 -right-1/2 w-[800px] h-[800px] bg-zinc-800/20 rounded-full blur-[100px]" />
      </div>

      <div className="z-10 flex flex-col items-center space-y-8 text-center max-w-2xl">
        <div className="p-3 bg-zinc-900/50 rounded-2xl border border-zinc-800/50 backdrop-blur-sm mb-4">
          <Keyboard className="w-8 h-8 text-yellow-500" />
        </div>

        <div className="space-y-2">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white">
            Monkeytype <span className="text-yellow-500">Wrap 2025</span>
          </h1>
          <p className="text-zinc-400 text-lg md:text-xl max-w-lg mx-auto">
            Visualize your typing journey. Discover your speed, consistency, and dedication over the last year.
          </p>
        </div>

        <UserForm />

        <p className="text-xs text-zinc-600 pt-8">
          Not affiliated with Monkeytype. Built for the community.
        </p>
      </div>
    </main>
  );
}
