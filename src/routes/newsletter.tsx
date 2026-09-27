import { createFileRoute } from "@tanstack/react-router";
import { Newsletter } from "@/components/site-chrome";

export const Route = createFileRoute("/newsletter")({
  head: () => ({
    meta: [
      { title: "न्यूज़लेटर — अपनीबात" },
      { name: "description", content: "अपनीबात न्यूज़लेटर सब्सक्राइब करें — चुनिंदा खबरें और विश्लेषण सीधे आपके इनबॉक्स में, हर सुबह 7 बजे।" },
      { property: "og:title", content: "न्यूज़लेटर — अपनीबात" },
      { property: "og:description", content: "रोज़ सुबह चुनिंदा खबरें।" },
      { property: "og:type", content: "website" },
    ],
  }),
  component: NewsletterPage,
});

function NewsletterPage() {
  return (
    <>
      <div className="content-shell max-w-3xl py-8 text-center sm:py-10">
        <p className="font-sans text-[0.68rem] font-bold uppercase tracking-[0.16em] text-primary">
          न्यूज़लेटर
        </p>
        <h1 className="mt-2 font-display text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl">
          हर सुबह 7 बजे, चुनिंदा खबरें।
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-base leading-7 text-muted-foreground">
          दिन की सबसे ज़रूरी खबरें, गहन विश्लेषण और संपादकीय विचार — पाँच मिनट में पढ़ने लायक, सीधे
          आपके इनबॉक्स में। कोई स्पैम नहीं, कभी भी अनसब्सक्राइब करें।
        </p>
        <div className="mx-auto mt-5 grid max-w-xl gap-2 text-left sm:grid-cols-3">
          <div className="rounded-lg border border-border p-3">
            <p className="font-sans text-xs font-bold text-primary">दैनिक ब्रीफ</p>
            <p className="mt-1 text-xs text-muted-foreground">रोज़ सुबह 5 मुख्य खबरें</p>
          </div>
          <div className="rounded-lg border border-border p-3">
            <p className="font-sans text-xs font-bold text-primary">साप्ताहिक विश्लेषण</p>
            <p className="mt-1 text-xs text-muted-foreground">हर रविवार गहन रिपोर्ट</p>
          </div>
          <div className="rounded-lg border border-border p-3">
            <p className="font-sans text-xs font-bold text-primary">2.3 लाख+ पाठक</p>
            <p className="mt-1 text-xs text-muted-foreground">पहले से सब्सक्राइब कर चुके हैं</p>
          </div>
        </div>
      </div>
      <Newsletter />
    </>
  );
}