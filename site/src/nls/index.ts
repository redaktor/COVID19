/* conventions
Texts in '' MUST NOT exceed 150 characters
Texts in `` CAN be multiline or markdown
*/
const messages = {
  counter: `{count, plural,
	=1 {item left}
	other {items left}}`,
  about: 'about',
  dashboards: 'dashboards',
  docs: 'docs',
  community: 'community',
  versions: 'versions',
  languages: 'languages',
  toolOverview: 'Overview',
  blogpost: 'Blog post',
  codeOfConduct: 'Code of Conduct',
  heroTitle: `Crisis Response to COVID-19 :
Help, Solidarity, Information.`,
  heroContent1: `**Young people help high-risk groups through the COVID-19-time.**
An exceptional situation calls for exceptional measures.`,
  heroContent2: `The new type of corona virus has turned our society upside down.
**Now it is mobilizing our community.**`,

  heroButtonText: 'Open the app',
  helpTeaser: 'Finding help',
  helpTitle: 'I need help',
  helpText: `### Map and List
  [Look for your place on the map](https://redaktor.ushahidi.io/savedsearches/12/map).
  If you couldn't find any assistance in the map or [list](https://redaktor.ushahidi.io/savedsearches/12/data) :
  ## I need help
  **[Register](https://redaktor.ushahidi.io/register)** to be contacted without revealing your data.

  **[Tell people what you need.](https://redaktor.ushahidi.io/posts/create/2)**

  Scroll down for country-specific information.`,
  offerTeaser: 'Help',
  offerTitle: 'I can offer',
  offerText: `*Use this option if you do NOT belong to a risk group.*
  [Read the guide by the WHO](https://www.who.int/emergencies/diseases/novel-coronavirus-2019/advice-for-public)
  [See the flyer of BZgA](https://www.infektionsschutz.de/fileadmin/infektionsschutz.de/Downloads/200326_BZgA_Atemwegsinfektion-Hygiene_schuetzt_A4_EN_RZ_Ansicht.pdf)

  [Look for a place to help on the map](https://redaktor.ushahidi.io/savedsearches/13/map)
  and search unsolved support.

  ### I can offer help:
  **[Tell people what you can give.](https://redaktor.ushahidi.io/posts/create/3)**

  **[Enter solidary neighbourhoods and local initiatives.](https://redaktor.ushahidi.io/posts/create/6)**
  `,
  infoTeaser: 'Inform',
  infoTitle: 'Info',
  infoText: `Research [**informations and experts**](https://redaktor.ushahidi.io/savedsearches/35/data) in the list.
  Find [restrictions](https://redaktor.ushahidi.io/savedsearches/22/map) and [incidents](https://redaktor.ushahidi.io/savedsearches/14/map) on the map.
  `,
  /* <p>questions? <span class="nospace_m">suggestion redaktor.me</span></p> */
  countryDefault: 'US',
  countryTitle: 'Country specific infos',
  country1: 'USA United States',
  country1Text: `**Official WHO Links** [are here](https://redaktor.ushahidi.io/posts/1313)
**Official US Links** [are here](https://redaktor.ushahidi.io/posts/5059)

For a network overview visit the site [COVID-19 Mutual Aid](https://itsgoingdown.org/c19-mutual-aid/).
We are desperately looking for more neighbourhood networks in South- and Northamerica.`,
  country2: 'UK United Kingdom',
  country2Text: `**Official WHO Links** [are here](https://redaktor.ushahidi.io/posts/1313)
**Official UK Links** [are here](https://redaktor.ushahidi.io/posts/5066)

For a network overview visit the site [COVID-19 Mutual Aid](https://covidmutualaid.org)
`,
  country3: 'Spain',
  country3Text: `[See also](https://redaktor.ushahidi.io/posts/1317)
**Official WHO Links** [are here](https://redaktor.ushahidi.io/posts/1313)

Visit [the neighbourhood App of Frena la curva Maps](https://es.mapa.frenalacurva.net/views/map).

[Apps](https://frenalacurva.net)`,
  country4: 'Italy',
  country4Text: `[See also](https://redaktor.ushahidi.io/posts/1315)

Visit [the neighbourhood App of ANPAS](https://anpas.ushahidi.io/views/map)
or call **+39 055303821** or inform at [Ministero della Salute](http://www.salute.gov.it/nuovocoronavirus).
The public utility phone number **1500** of the Ministry of Health is also active.
`,
  country5: 'India',
  country5Text: `**Official WHO Links** [are here](https://redaktor.ushahidi.io/posts/1313).
  **Official India Info** [are here](https://www.mohfw.gov.in) --- [cache](https://www.google.com/url?sa=t&rct=j&q=&esrc=s&source=web&cd=2&ved=2ahUKEwjB3vKkg8LoAhX-QEEAHfMxCV4Qi-8BKAEwAXoECGYQAg&url=https%3A%2F%2Fwebcache.googleusercontent.com%2Fsearch%3Fq%3Dcache%3AQ7S18eyhhpgJ%3Ahttps%3A%2F%2Fwww.mohfw.gov.in%2F&usg=AOvVaw1Sb1EVUgbJejU4Y5_2-uY0)
  [Situation Reports](https://www.who.int/india/emergencies/india-situation-report)`,
  moreCountries: `Find more countries by changing the language or [here](https://redaktor.ushahidi.io/savedsearches/36/data).`,
  infoTextMain1: `### COVID-19
COVID-19 is the infectious disease caused by the most recently discovered coronavirus. This new virus and disease were unknown before the outbreak began in Dec. 2019.
The most common symptoms of COVID-19 are fever, tiredness, and dry cough.
[Q&A](https://www.who.int/news-room/q-a-detail/q-a-coronaviruses)
`,
  infoTextMain2: `### Spreading
People can catch COVID-19 from others who have the virus. The disease can spread from person to person through small droplets from the nose or mouth which are spread when a person with COVID-19 coughs or exhales.

This is why it is important to wash hands and stay more than 1 meter (3 feet) away from people.`,
  infoTextMain3: `### Contributions
Let us tinker **a map of solidarity and creativity** together

We are now looking for
- Suggestions
- Moderators
- Translators
`
};
const locales = {
  en: () => messages,
  de: () => import("./de/"),
  es: () => import("./es/"),
  fr: () => import("./fr/")
};


export default { messages, locales };
