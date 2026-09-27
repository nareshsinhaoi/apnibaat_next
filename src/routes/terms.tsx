import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "उपयोग की शर्तें — अपनीबात" },
      { name: "description", content: "अपनीबात वेबसाइट के उपयोग की शर्तें और नियम।" },
      { property: "og:title", content: "उपयोग की शर्तें — अपनीबात" },
      { property: "og:description", content: "वेबसाइट उपयोग की शर्तें।" },
      { property: "og:type", content: "article" },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <article className="content-shell max-w-3xl py-12 sm:py-16">
      <p className="font-sans text-[0.68rem] font-bold uppercase tracking-[0.16em] text-primary">
        नीति
      </p>
      <h1 className="mt-3 font-display text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl">
        उपयोग की शर्तें
      </h1>
      <p className="mt-3 text-sm text-muted-foreground">
        अंतिम अद्यतन: {new Date().toLocaleDateString("hi-IN")}
      </p>
      <div className="article-body mt-8">
        <p>
          इस वेबसाइट का उपयोग करके आप निम्नलिखित शर्तों से सहमत होते हैं। कृपया उपयोग से पहले इन्हें
          ध्यान से पढ़ें।
        </p>
        <h2>सामग्री का उपयोग</h2>
        <p>
          इस वेबसाइट पर प्रकाशित सभी सामग्री — लेख, चित्र, वीडियो और ग्राफ़िक्स — अपनीबात के
          स्वामित्व में हैं। बिना लिखित अनुमति के इनका व्यावसायिक उपयोग वर्जित है।
        </p>
        <h2>उपयोगकर्ता की ज़िम्मेदारी</h2>
        <ul>
          <li>वेबसाइट का उपयोग केवल कानूनी उद्देश्यों के लिए करें।</li>
          <li>किसी भी प्रकार की हानिकारक गतिविधि से बचें।</li>
          <li>अन्य उपयोगकर्ताओं के अधिकारों का सम्मान करें।</li>
        </ul>
        <h2>बाहरी लिंक</h2>
        <p>
          यह वेबसाइट बाहरी वेबसाइटों के लिंक शामिल कर सकती है। हम उनकी सामग्री या नीतियों के लिए
          ज़िम्मेदार नहीं हैं।
        </p>
        <h2>परिवर्तन</h2>
        <p>
          हम बिना पूर्व सूचना के इन शर्तों में परिवर्तन का अधिकार सुरक्षित रखते हैं। नवीनतम संस्करण
          इसी पृष्ठ पर उपलब्ध रहेगा।
        </p>
      </div>
    </article>
  );
}