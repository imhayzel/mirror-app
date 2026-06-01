import { TopNav } from "@/components/mirror/top-nav";
import { BottomNav } from "@/components/mirror/bottom-nav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F5F5F0]">
      <TopNav />
      {/* pb-[72px] on mobile reserves space above the fixed BottomNav */}
      <main className="max-w-[1200px] mx-auto px-6 py-8 md:py-10 pb-[72px] md:pb-10">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
