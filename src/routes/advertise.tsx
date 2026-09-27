import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/advertise")({
  head: () => ({
    meta: [
      { title: "विज्ञापन — अपनीबात" },
      { name: "description", content: "अपनीबात पर विज्ञापन दें — हर महीने 60 लाख से अधिक हिंदी पाठकों तक पहुँचें।" },
      { property: "og:title", content: "विज्ञापन — अपनीबात" },
      { property: "og:description", content: "हमारे विज्ञापन विकल्प और दरें देखें।" },
      { property: "og:type", content: "website" },
    ],
  }),
  component: AdvertisePage,
});

function AdvertisePage() {
  const formats = [
    { name: "लीडरबोर्ड बैनर", spec: "970×250, होमपेज व लेख पृष्ठ", price: "₹18,000 / सप्ताह" },
    { name: "इन-आर्टिकल नेटिव", spec: "लेख के भीतर, स्क्रॉल-अनुकूल", price: "₹25,000 / सप्ताह" },
    { name: "स्पॉन्सर्ड स्टोरी", spec: "1200 शब्द तक, ब्रांड-लेबल सहित", price: "₹40,000 / लेख" },
    { name: "न्यूज़लेटर स्लॉट", spec: "दैनिक न्यूज़लेटर में एकल स्लॉट", price: "₹12,000 / सप्ताह" },
  ];

  return (
    <article className="content-shell max-w-3xl py-8 sm:py-10">
      <p className="font-sans text-[0.68rem] font-bold uppercase tracking-[0.16em] text-primary">
        विज्ञापन
      </p>
      <h1 className="mt-2 font-display text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl">
        हिंदी पाठकों तक सीधी पहुँच
      </h1>
      <div className="article-body mt-5 space-y-3">
        <p>
          अपनीबात हर महीने 60 लाख से अधिक यूनीक पाठकों तक पहुँचता है, जिनमें 70% मोबाइल से और 65%
          टियर-2/टियर-3 शहरों से आते हैं। यह दर्शक-समूह उन ब्रांडों के लिए विशेष रूप से मूल्यवान है
          जो हिंदी भाषी उपभोक्ताओं तक सीधे और भरोसेमंद माध्यम से पहुँचना चाहते हैं।
        </p>
        <h2>विज्ञापन प्रारूप और दरें</h2>
        <div className="not-prose overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50 font-sans text-xs uppercase tracking-wide">
              <tr>
                <th className="px-4 py-2">प्रारूप</th>
                <th className="px-4 py-2">विवरण</th>
                <th className="px-4 py-2">दर</th>
              </tr>
            </thead>
            <tbody>
              {formats.map((f) => (
                <tr key={f.name} className="border-t border-border">
                  <td className="px-4 py-2 font-semibold">{f.name}</td>
                  <td className="px-4 py-2 text-muted-foreground">{f.spec}</td>
                  <td className="px-4 py-2">{f.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-muted-foreground">
          दरें मानक रेट-कार्ड पर आधारित हैं; तिमाही और वार्षिक अनुबंधों पर छूट उपलब्ध है।
        </p>
        <h2>स्पॉन्सर्ड कंटेंट नीति</h2>
        <p>
          हर प्रायोजित लेख को "विज्ञापन" या "प्रायोजित" लेबल के साथ स्पष्ट रूप से चिह्नित किया जाता
          है, ताकि संपादकीय और विज्ञापन सामग्री में कोई भ्रम न हो। कंटेंट का लेखन हमारी ब्रांडेड-कंटेंट
          टीम द्वारा किया जाता है, लेकिन तथ्यात्मक दावों की समीक्षा संपादकीय टीम करती है।
        </p>
        <h2>संपर्क करें</h2>
        <p>
          मीडिया किट, केस-स्टडी और कस्टम पैकेज के लिए{" "}
          <a href="mailto:ads@modulelabs.com">ads@modulelabs.com</a> पर लिखें या हमारी सेल्स टीम से
          +91 11 4567 8900 पर संपर्क करें।
        </p>
      </div>
    </article>
  );
}