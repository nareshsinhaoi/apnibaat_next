import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin, Phone, Clock } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "संपर्क करें — अपनीबात" },
      { name: "description", content: "अपनीबात से संपर्क करें — सुझाव, प्रतिक्रिया, विज्ञापन और साझेदारी के लिए।" },
      { property: "og:title", content: "संपर्क करें — अपनीबात" },
      { property: "og:description", content: "अपनीबात टीम से संपर्क करें।" },
      { property: "og:type", content: "website" },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <div className="content-shell max-w-3xl py-8 sm:py-10">
      <p className="font-sans text-[0.68rem] font-bold uppercase tracking-[0.16em] text-primary">
        संपर्क
      </p>
      <h1 className="mt-2 font-display text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl">
        हमसे बात करें
      </h1>
      <p className="mt-3 max-w-xl text-base leading-7 text-muted-foreground">
        सुझाव, प्रतिक्रिया, सुधार-अनुरोध, विज्ञापन या साझेदारी के लिए नीचे दिए माध्यमों से संपर्क करें।
        हम सामान्यतः दो कार्यदिवसों में जवाब देते हैं।
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <ContactCard icon={<Mail className="size-5" />} title="सामान्य पूछताछ">
          <a href="mailto:contact@apnibaat.com" className="text-primary hover:underline">
            contact@apnibaat.com
          </a>
        </ContactCard>
        <ContactCard icon={<Mail className="size-5" />} title="न्यूज़रूम / टिप्स">
          <a href="mailto:newsroom@apnibaat.com" className="text-primary hover:underline">
            newsroom@apnibaat.com
          </a>
        </ContactCard>
        <ContactCard icon={<Mail className="size-5" />} title="विज्ञापन">
          <a href="mailto:ads@apnibaat.com" className="text-primary hover:underline">
            ads@apnibaat.com
          </a>
        </ContactCard>
        <ContactCard icon={<Phone className="size-5" />} title="फ़ोन">
          <span>+91 11 4567 8900</span>
        </ContactCard>
        <ContactCard icon={<MapPin className="size-5" />} title="कार्यालय">
          <span>तीसरी मंज़िल, DLF साइबर सिटी, गुरुग्राम, हरियाणा 122002</span>
        </ContactCard>
        <ContactCard icon={<Clock className="size-5" />} title="कार्य-समय">
          <span>सोमवार–शुक्रवार, सुबह 10 – शाम 6 बजे</span>
        </ContactCard>
      </div>
    </div>
  );
}

function ContactCard({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="news-card p-4">
      <div className="flex items-center gap-2 text-primary">
        {icon}
        <h2 className="font-sans text-sm font-extrabold uppercase tracking-wide">{title}</h2>
      </div>
      <div className="mt-2 text-sm text-foreground">{children}</div>
    </div>
  );
}