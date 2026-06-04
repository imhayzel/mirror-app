import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export default function SettingsPage() {
  return (
    <div className="max-w-[600px]">
      {/* Header */}
      <div className="mb-8 border-b border-[#0A0A0A] pb-6">
        <h1 className="font-display text-[36px] font-semibold leading-[42px] tracking-[-0.01em] text-[#0A0A0A]">
          Settings
        </h1>
      </div>

      <div className="flex flex-col gap-10">
        {/* Account */}
        <section>
          <p className="font-sans text-[13px] font-semibold uppercase tracking-[0.08em] text-[#5C5C5C] mb-6">
            ACCOUNT
          </p>
          <div className="flex flex-col gap-4">
            <div>
              <Label htmlFor="display-name" className="block mb-3">DISPLAY NAME</Label>
              <Input id="display-name" placeholder="Your name" />
            </div>
            <div>
              <Label htmlFor="email" className="block mb-3">EMAIL</Label>
              <Input id="email" type="email" placeholder="your@email.com" />
            </div>
            <Button variant="primary" className="self-start">SAVE CHANGES</Button>
          </div>
        </section>

        <Separator />

        {/* Style preferences */}
        <section>
          <p className="font-sans text-[13px] font-semibold uppercase tracking-[0.08em] text-[#5C5C5C] mb-6">
            STYLE PREFERENCES
          </p>
          <div className="flex flex-col gap-4">
            <div>
              <Label className="block mb-3">DEFAULT OUTFIT OCCASION</Label>
              <div className="flex flex-wrap gap-2">
                {["EVERYDAY", "WORK", "CASUAL", "EVENING"].map((occ) => (
                  <button
                    key={occ}
                    className="font-sans text-[11px] font-semibold uppercase tracking-[0.1em] px-[10px] py-2 border border-[#0A0A0A] bg-white hover:bg-[#E8E8E3] transition-colors"
                  >
                    {occ}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <Separator />

        {/* Subscription */}
        <section>
          <p className="font-sans text-[13px] font-semibold uppercase tracking-[0.08em] text-[#5C5C5C] mb-6">
            SUBSCRIPTION
          </p>
          <div className="bg-white border border-[#0A0A0A] p-6 flex items-center justify-between">
            <div>
              <p className="font-sans text-[13px] font-semibold uppercase tracking-[0.08em] text-[#0A0A0A]">
                FREE TIER
              </p>
              <p className="font-sans text-[14px] leading-[22px] text-[#5C5C5C] mt-1">
                3 AI uses remaining
              </p>
            </div>
            <Button variant="accent">UPGRADE</Button>
          </div>
        </section>

        <Separator />

        {/* Danger zone */}
        <section>
          <p className="font-sans text-[13px] font-semibold uppercase tracking-[0.08em] text-[#D4000F] mb-6">
            DANGER ZONE
          </p>
          <div className="flex flex-col gap-3">
            <Button variant="secondary" className="self-start border-[#D4000F] text-[#D4000F] hover:bg-[#D4000F]/5">
              CLEAR WARDROBE
            </Button>
            <Button variant="secondary" className="self-start border-[#D4000F] text-[#D4000F] hover:bg-[#D4000F]/5">
              DELETE ACCOUNT
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
