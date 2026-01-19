'use client';

interface Dictionary {
  seo: any;
}

export default function RichContent({ dictionary }: { dictionary: Dictionary }) {
  return (
    <article className="prose prose-slate prose-lg max-w-none mt-16 bg-white p-8 md:p-12 rounded-3xl border border-slate-100 shadow-sm">
      <h2 className="text-3xl font-bold text-slate-800 mb-6 font-serif">{dictionary.seo.title}</h2>
      <div className="space-y-4 text-slate-600 leading-relaxed">
        <p>{dictionary.seo.content}</p>

        <h3 className="text-xl font-semibold text-teal-700 mt-8 mb-4">{dictionary.seo.benefitsTitle}</h3>
        <ul className="list-disc pl-6 space-y-2 marker:text-teal-500">
          <li><strong>{dictionary.seo.benefit1Title}</strong> {dictionary.seo.benefit1Desc}</li>
          <li><strong>{dictionary.seo.benefit2Title}</strong> {dictionary.seo.benefit2Desc}</li>
          <li><strong>{dictionary.seo.benefit3Title}</strong> {dictionary.seo.benefit3Desc}</li>
        </ul>

        <div className="bg-slate-50 border-l-4 border-teal-500 p-6 my-8 rounded-r-xl">
          <p className="italic text-slate-700 m-0">
            "{dictionary.seo.quote}"
          </p>
        </div>

        <h3 className="text-xl font-semibold text-teal-700 mt-8 mb-4">{dictionary.seo.modernTitle}</h3>
        <p>{dictionary.seo.modernContent}</p>
        <ul className="list-disc pl-6 space-y-2 marker:text-teal-500">
          <li>{dictionary.seo.modernList1}</li>
          <li>{dictionary.seo.modernList2}</li>
          <li>{dictionary.seo.modernList3}</li>
        </ul>

        <h3 className="text-xl font-semibold text-teal-700 mt-8 mb-4">{dictionary.seo.techTitle}</h3>
        <p className="mb-4">{dictionary.seo.techContent}</p>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 shadow-sm">
            <p className="text-slate-700 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: dictionary.seo.techList1 }} />
          </div>
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 shadow-sm">
            <p className="text-slate-700 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: dictionary.seo.techList2 }} />
          </div>
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 shadow-sm">
            <p className="text-slate-700 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: dictionary.seo.techList3 }} />
          </div>
        </div>
      </div>
    </article>
  );
}
