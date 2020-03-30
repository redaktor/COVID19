import { tsx, create } from "@dojo/framework/core/vdom";
import i18n from "@dojo/framework/core/middleware/i18n";
import { systemLocale } from "@dojo/framework/i18n/i18n";

import * as css from "./styles/Home.m.css";
import bundle from "../nls/Home";

const factory = create({ i18n });

const dojorc = `
"build-app": {
    "locale": "en",
    "supportedLocales": ["de","fr"],
    "cldrPaths": [
        "cldr-data/supplemental/plurals.json",
        "cldr-data/supplemental/likelySubtags"
    ]
}
`;

export default factory(function Home({ middleware: { i18n } }) {
  const { format } = i18n.localize(bundle);
  let error: any;
  let singular: any;
  let plural: any;
  try {
    singular = format("counter", { count: 1 });
    plural = format("counter", { count: 2 });
  } catch (e) {
    error = e;
    console.log(e);
  }
  return (
    <div>
      <h1 classes={[css.root]}>Home Page</h1>
      <div>{`System Locale: ${systemLocale} - Current Locale (set by middleware): ${JSON.stringify(
        i18n.get()
      )}`}</div>
      <div>
        <div>dojorc configuration:</div>
        <pre>{dojorc}</pre>
      </div>
      <button
        onclick={() => {
          i18n.set({ locale: "fr" });
        }}
      >
        french (fr)
      </button>
      <button
        onclick={() => {
          i18n.set({ locale: "de" });
        }}
      >
        french (fr-CA)
      </button>
      <button
        onclick={() => {
          i18n.set({ locale: "en" });
        }}
      >
        english (en)
      </button>
      <button
        onclick={() => {
          i18n.set({ locale: "zh-CN" });
        }}
      >
        simplified chinese (zh-CN)
      </button>
      <button
        onclick={() => {
          i18n.set({ locale: "en-GB" });
        }}
      >
        english (en-GB)
      </button>
      <button
        onclick={() => {
          i18n.set({});
        }}
      >
        default
      </button>
      {singular && <div key="s">{singular}</div>}
      {plural && <div key="p">{plural}</div>}
      {error && <div key="e">{error.message}</div>}
    </div>
  );
});
