import { getSiteSettings } from "@/lib/data-fetching";
import { PPDBForm } from "@/components/public/PPDBForm";

export default async function PPDBPage() {
  const settings = await getSiteSettings();

  return (
    <div className="bg-background min-h-screen pt-8 pb-32">
      <PPDBForm settings={settings || null} />
    </div>
  );
}
