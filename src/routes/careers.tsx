import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/careers")({
  head: () => ({
    meta: [
      { title: "करियर — अपनीबात" },
      { name: "description", content: "अपनीबात के साथ जुड़ें — हिंदी पत्रकारिता और डिजिटल मीडिया में अवसर।" },
      { property: "og:title", content: "करियर — अपनीबात" },
      { property: "og:description", content: "हमारी टीम का हिस्सा बनें।" },
      { property: "og:type", content: "website" },
    ],
  }),
  component: CareersPage,
});

function CareersPage() {
  const roles = [
    {
      title: "वरिष्ठ संवाददाता — राजनीति",
      dept: "न्यूज़रूम",
      type: "पूर्णकालिक · दिल्ली",
      exp: "5+ वर्ष का अनुभव",
    },
    {
      title: "कार्यकारी संपादक",
      dept: "संपादकीय",
      type: "पूर्णकालिक · दिल्ली",
      exp: "10+ वर्ष का अनुभव",
    },
    {
      title: "मल्टीमीडिया पत्रकार",
      dept: "डिजिटल",
      type: "पूर्णकालिक · लखनऊ",
      exp: "2-4 वर्ष का अनुभव",
    },
    {
      title: "फैक्ट-चेकर / रिसर्चर",
      dept: "रिसर्च",
      type: "पूर्णकालिक · रिमोट",
      exp: "1-3 वर्ष का अनुभव",
    },
    {
      title: "फ्रंटएंड डेवलपर",
      dept: "इंजीनियरिंग",
      type: "पूर्णकालिक · रिमोट",
      exp: "React/TypeScript अनुभव आवश्यक",
    },
  ];

  return (
    <div className="content-shell max-w-3xl py-8 sm:py-10">
      <p className="font-sans text-[0.68rem] font-bold uppercase tracking-[0.16em] text-primary">
        करियर
      </p>
      <h1 className="mt-2 font-display text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl">
        हमारे साथ जुड़ें
      </h1>
      <p className="mt-3 max-w-2xl text-base leading-7 text-muted-foreground">
        हिंदी पत्रकारिता को नई ऊँचाइयों पर ले जाने के लिए हम प्रतिभाशाली पत्रकारों, संपादकों, शोधकर्ताओं
        और डिजिटल विशेषज्ञों की तलाश कर रहे हैं। हम रिमोट-फर्स्ट टीम हैं, लचीले कार्य-घंटे देते हैं और
        स्वास्थ्य बीमा तथा वार्षिक शिक्षा भत्ता प्रदान करते हैं।
      </p>

      <div className="mt-6 space-y-2">
        {roles.map((r) => (
          <div
            key={r.title}
            className="news-card flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <h2 className="font-sans text-base font-bold text-foreground">{r.title}</h2>
              <p className="mt-0.5 font-sans text-xs text-muted-foreground">
                {r.dept} · {r.type} · {r.exp}
              </p>
            </div>
            <a
              href="mailto:careers@apnibaat.com"
              className="inline-flex w-fit items-center rounded-full bg-primary px-5 py-2 font-sans text-xs font-bold text-primary-foreground transition-opacity hover:opacity-90"
            >
              आवेदन करें
            </a>
          </div>
        ))}
      </div>

      <p className="mt-5 text-sm text-muted-foreground">
        अपना बायोडाटा, तीन लेखन नमूने और अपेक्षित वेतन <a href="mailto:careers@apnibaat.com" className="text-primary hover:underline">careers@apnibaat.com</a> पर भेजें।
        चयनित उम्मीदवारों से एक सप्ताह के भीतर संपर्क किया जाएगा।
      </p>
    </div>
  );
}