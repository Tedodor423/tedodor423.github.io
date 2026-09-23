/* Varroa destructor and honey-bee colony losses, by country and year.
 *
 * Transcribed from references/export_varroa_data.py and the three files it
 * writes (varroa_colony_loss_data.json, _countries.csv, _timeseries.csv),
 * which are the compiled form of the sources listed in SOURCES below. The
 * constants here are that script's own constants, extracted rather than
 * retyped, and lossAt() is a port of its loss_at(). Nothing was added to the
 * numbers.
 *
 * WHAT THIS DATASET IS, AND IS NOT. It is reported colony loss: the percentage
 * of managed colonies a country's beekeepers lost in a year. It is NOT the
 * spread of the mite. A country enters the animation in the year its loss
 * survey starts, not the year varroa arrived, and for most countries that
 * start year is simply 2008, where COLOSS coverage begins. Australia is the
 * one place where the two nearly coincide, because its first detection (June
 * 2022) and its first survey are a year apart. The component says so on the
 * page. Do not relabel this as an arrival map.
 *
 * Loss figures are TOTAL reported losses. Varroa is the most-reported cause in
 * the US, NZ and Canadian surveys, but it is not the only cause.
 */

/** The five loss bands the dataset defines, in order. */
export type Category = "low" | "moderate" | "high" | "severe" | "catastrophic";

/** What a country is painted as in a given year. */
export type Status =
  | Category
  | "no_economic_damage"
  | "varroa_free"
  | "no_survey"
  | "no_data";

/** The years the map animates over. */
export const YEARS: number[] = Array.from(
  { length: 2025 - 2008 + 1 },
  (_, i) => 2008 + i,
);

/**
 * COLOSS winter 2019-20 loss rate, per European country (Gray et al. 2022).
 * Other years are this value scaled by EU_FACTOR, which is an approximation
 * outside 2019-20 and is flagged as one wherever it is shown.
 */
const EU_BASE: Record<string, number> = {
  "Albania": 15,
  "Austria": 13.2,
  "Belarus": 11,
  "Belgium": 17.5,
  "Bosnia and Herz.": 14,
  "Bulgaria": 11.3,
  "Croatia": 16,
  "Cyprus": 14,
  "Czechia": 20.8,
  "Denmark": 22.3,
  "Estonia": 12.9,
  "Finland": 15.8,
  "France": 13.7,
  "Germany": 18.4,
  "Greece": 14.1,
  "Hungary": 15,
  "Ireland": 18,
  "Italy": 18.4,
  "Kosovo": 14,
  "Latvia": 14.3,
  "Lithuania": 14,
  "Luxembourg": 17,
  "Moldova": 12,
  "Montenegro": 14,
  "Netherlands": 15.6,
  "North Macedonia": 14.7,
  "Norway": 7.4,
  "Poland": 13.9,
  "Portugal": 22.5,
  "Romania": 15,
  "Serbia": 13,
  "Slovakia": 18.9,
  "Slovenia": 28.9,
  "Spain": 36.5,
  "Sweden": 13.1,
  "Switzerland": 13.2,
  "Ukraine": 9.3,
  "United Kingdom": 18,
};

/** Latest reported loss everywhere else, held flat across the years. */
const OTHER_LATEST: Record<string, number> = {
  "Algeria": 12.2,
  "Argentina": 22,
  "Armenia": 14,
  "Australia": 12,
  "Azerbaijan": 14,
  "Bahrain": 18,
  "Belize": 18,
  "Bolivia": 18,
  "Brazil": 30,
  "California": 62,
  "Canada": 34.6,
  "Chile": 17,
  "Colombia": 20,
  "Costa Rica": 18,
  "Cuba": 15,
  "Dominican Rep.": 18,
  "Ecuador": 18,
  "Egypt": 24.3,
  "El Salvador": 18,
  "Georgia": 14,
  "Guatemala": 18,
  "Guyana": 18,
  "Honduras": 18,
  "Iran": 21.5,
  "Iraq": 18,
  "Israel": 8.8,
  "Jordan": 18,
  "Kazakhstan": 14,
  "Kuwait": 18,
  "Kyrgyzstan": 14,
  "Lebanon": 18,
  "Libya": 15,
  "Mexico": 28.4,
  "Mongolia": 14,
  "Morocco": 18,
  "New Zealand": 12.6,
  "Nicaragua": 18,
  "Oman": 18,
  "Palestine": 12,
  "Panama": 18,
  "Paraguay": 22,
  "Peru": 18,
  "Qatar": 18,
  "Russia": 15,
  "Saudi Arabia": 20,
  "Suriname": 18,
  "Syria": 18,
  "Tajikistan": 14,
  "Tunisia": 15,
  "Turkey": 20,
  "Turkmenistan": 14,
  "United Arab Emirates": 18,
  "United States of America": 55.6,
  "Uruguay": 20,
  "Uzbekistan": 14,
  "Venezuela": 18,
  "Yemen": 18,
};

/** Overall European COLOSS winter loss rate: the scaling factor for EU_BASE. */
const EU_FACTOR: Record<number, number> = {
  2008: 20,
  2009: 18,
  2010: 16,
  2011: 17,
  2012: 16,
  2013: 20,
  2014: 9,
  2015: 17.4,
  2016: 12,
  2017: 20.9,
  2018: 16.4,
  2019: 16.7,
  2020: 18.1,
  2021: 14,
  2022: 15,
  2023: 16,
  2024: 17,
  2025: 17,
};

/** The four year-resolved national series. California is derived from the US one. */
const SERIES: Record<string, Record<number, number>> = {
  "United States of America": {
    2008: 36,
    2009: 29,
    2010: 34,
    2011: 38.4,
    2012: 29,
    2013: 45.2,
    2014: 34.2,
    2015: 40.6,
    2016: 40.5,
    2017: 33.2,
    2018: 40.1,
    2019: 40.7,
    2020: 43.7,
    2021: 50.8,
    2022: 39,
    2023: 48.2,
    2024: 55.1,
    2025: 55.6,
  },
  Canada: {
    2008: 35,
    2009: 34,
    2010: 21,
    2011: 29,
    2012: 15,
    2013: 29,
    2014: 25,
    2015: 16,
    2016: 17,
    2017: 25,
    2018: 33,
    2019: 26,
    2020: 31,
    2021: 23,
    2022: 45.5,
    2023: 32.4,
    2024: 34.6,
    2025: 34.6,
  },
  "New Zealand": {
    2015: 10.7,
    2016: 9.8,
    2017: 9.7,
    2018: 10.2,
    2019: 10.5,
    2020: 11.3,
    2021: 13.6,
    2022: 13.5,
    2023: 13.5,
    2024: 12.6,
    2025: 12.6,
  },
  Australia: {
    2023: 8,
    2024: 10,
    2025: 12,
  },
};

/** First year a country has survey coverage. Not the year varroa arrived. */
const SERIES_START: Record<string, number> = {
  "Albania": 2008,
  "Algeria": 2016,
  "Argentina": 2017,
  "Armenia": 2018,
  "Australia": 2023,
  "Austria": 2008,
  "Azerbaijan": 2018,
  "Bahrain": 2018,
  "Belarus": 2008,
  "Belgium": 2008,
  "Belize": 2017,
  "Bolivia": 2017,
  "Bosnia and Herz.": 2008,
  "Brazil": 2017,
  "Bulgaria": 2008,
  "California": 2008,
  "Canada": 2008,
  "Chile": 2017,
  "Colombia": 2017,
  "Costa Rica": 2017,
  "Croatia": 2008,
  "Cuba": 2017,
  "Cyprus": 2008,
  "Czechia": 2008,
  "Denmark": 2008,
  "Dominican Rep.": 2017,
  "Ecuador": 2017,
  "Egypt": 2017,
  "El Salvador": 2017,
  "Estonia": 2008,
  "Finland": 2008,
  "France": 2008,
  "Georgia": 2018,
  "Germany": 2008,
  "Greece": 2008,
  "Guatemala": 2017,
  "Guyana": 2017,
  "Honduras": 2017,
  "Hungary": 2008,
  "Iran": 2016,
  "Iraq": 2018,
  "Ireland": 2008,
  "Israel": 2014,
  "Italy": 2008,
  "Jordan": 2018,
  "Kazakhstan": 2018,
  "Kosovo": 2008,
  "Kuwait": 2018,
  "Kyrgyzstan": 2018,
  "Latvia": 2008,
  "Lebanon": 2018,
  "Libya": 2018,
  "Lithuania": 2008,
  "Luxembourg": 2008,
  "Mexico": 2015,
  "Moldova": 2008,
  "Mongolia": 2018,
  "Montenegro": 2008,
  "Morocco": 2018,
  "Netherlands": 2008,
  "New Zealand": 2015,
  "Nicaragua": 2017,
  "North Macedonia": 2008,
  "Norway": 2008,
  "Oman": 2018,
  "Palestine": 2018,
  "Panama": 2017,
  "Paraguay": 2017,
  "Peru": 2017,
  "Poland": 2008,
  "Portugal": 2008,
  "Qatar": 2018,
  "Romania": 2008,
  "Russia": 2013,
  "Saudi Arabia": 2018,
  "Serbia": 2008,
  "Slovakia": 2008,
  "Slovenia": 2008,
  "Spain": 2008,
  "Suriname": 2017,
  "Sweden": 2008,
  "Switzerland": 2008,
  "Syria": 2018,
  "Tajikistan": 2018,
  "Tunisia": 2018,
  "Turkey": 2012,
  "Turkmenistan": 2018,
  "Ukraine": 2008,
  "United Arab Emirates": 2018,
  "United Kingdom": 2008,
  "United States of America": 2008,
  "Uruguay": 2017,
  "Uzbekistan": 2018,
  "Venezuela": 2017,
  "Yemen": 2018,
};

/**
 * Varroa is present but does no meaningful economic damage: the native range
 * of Apis cerana, and the African Apis mellifera subspecies, both of which
 * tolerate the mite without a treatment economy forming around it.
 */
export const NO_DAMAGE: string[] = [
  "Afghanistan",
  "Angola",
  "Bangladesh",
  "Benin",
  "Bhutan",
  "Botswana",
  "Brunei",
  "Burkina Faso",
  "Burundi",
  "Cambodia",
  "Cameroon",
  "Central African Rep.",
  "Chad",
  "China",
  "Congo",
  "Côte d'Ivoire",
  "Dem. Rep. Congo",
  "Djibouti",
  "Eq. Guinea",
  "Eritrea",
  "Ethiopia",
  "Gabon",
  "Gambia",
  "Ghana",
  "Guinea",
  "Guinea-Bissau",
  "India",
  "Indonesia",
  "Japan",
  "Kenya",
  "Laos",
  "Lesotho",
  "Liberia",
  "Madagascar",
  "Malawi",
  "Malaysia",
  "Mali",
  "Mauritania",
  "Mozambique",
  "Myanmar",
  "Namibia",
  "Nepal",
  "Niger",
  "Nigeria",
  "North Korea",
  "Pakistan",
  "Papua New Guinea",
  "Philippines",
  "Rwanda",
  "S. Sudan",
  "Senegal",
  "Sierra Leone",
  "Somalia",
  "Somaliland",
  "South Africa",
  "South Korea",
  "Sri Lanka",
  "Sudan",
  "Taiwan",
  "Tanzania",
  "Thailand",
  "Timor-Leste",
  "Togo",
  "Uganda",
  "Vietnam",
  "W. Sahara",
  "Zambia",
  "Zimbabwe",
  "eSwatini",
];

/** No confirmed Varroa destructor records. */
export const VARROA_FREE: string[] = [
  "Greenland",
  "Iceland",
  "Solomon Is.",
  "Vanuatu",
];

const EU_NAMES = new Set(Object.keys(EU_BASE));
const NO_DAMAGE_SET = new Set(NO_DAMAGE);
const FREE_SET = new Set(VARROA_FREE);

/** Every country the dataset carries a loss value for. */
export const LOSS_COUNTRIES: string[] = [
  // A Set, because "California" is both a key of OTHER_LATEST and named here.
  // Without it the name appears twice, and two table rows keyed by the same
  // country stop React updating either of them as the year changes.
  ...new Set([...Object.keys(EU_BASE), ...Object.keys(OTHER_LATEST), "California"]),
].sort();

/**
 * Reported loss for a country in a year, or null where the survey does not
 * reach that year. A port of loss_at() in the source script.
 *
 * California is the US series scaled to the 62% commercial-operation figure.
 * European countries are their 2019-20 rate scaled by that year's European
 * average. Everywhere else is one latest value, repeated.
 */
export function lossAt(name: string, year: number): number | null {
  if (name === "California") {
    const us = SERIES["United States of America"][year];
    return us === undefined ? null : Math.round(((us * 62) / 55.6) * 10) / 10;
  }
  if (year < (SERIES_START[name] ?? Infinity)) return null;
  const series = SERIES[name];
  if (series) return series[year] ?? null;
  if (EU_NAMES.has(name)) {
    const factor = EU_FACTOR[year];
    return factor === undefined
      ? null
      : Math.round(((EU_BASE[name] * factor) / 18.1) * 10) / 10;
  }
  return OTHER_LATEST[name] ?? null;
}

/** The dataset's own five bands. */
export function categoryOf(value: number): Category {
  if (value >= 40) return "catastrophic";
  if (value >= 25) return "severe";
  if (value >= 15) return "high";
  if (value >= 8) return "moderate";
  return "low";
}

/**
 * What to paint a country in a given year: a loss band, one of the two
 * non-numeric states, "no_survey" for a country whose series has not started
 * yet, or "no_data" for one the dataset does not list at all.
 */
export function statusAt(name: string, year: number): Status {
  if (FREE_SET.has(name)) return "varroa_free";
  if (NO_DAMAGE_SET.has(name)) return "no_economic_damage";
  const value = lossAt(name, year);
  if (value !== null) return categoryOf(value);
  const known = name === "California" || EU_NAMES.has(name) || name in OTHER_LATEST;
  return known ? "no_survey" : "no_data";
}

/** What the number in a country's series actually measures. */
export function metricOf(name: string): string {
  if (name === "United States of America") return "annual total loss";
  if (name === "California") return "annual total loss, commercial-operation proxy";
  if (name === "Canada") return "winter loss";
  if (name === "New Zealand") return "annual loss";
  if (name === "Australia") return "annual loss attributed to varroa";
  if (EU_NAMES.has(name)) return "winter loss, COLOSS";
  return "latest reported loss, held flat";
}

/** Citation tag and one line on where a country's number comes from. */
export function provenanceOf(name: string): {
  tag: "LIT" | "CALC" | "FLAG";
  text: string;
} {
  if (name === "United States of America")
    return { tag: "LIT", text: "AIA / BIP US Beekeeping Survey, 2008 to 2025." };
  if (name === "California")
    return {
      tag: "CALC",
      text:
        "California is not surveyed on its own. 62% is the AIA / BIP 2024-25 figure for commercial operations, used as an almond-fleet proxy and scaled back through the US series.",
    };
  if (name === "Canada")
    return { tag: "LIT", text: "CAPA winter loss reports, 2008 to 2024." };
  if (name === "New Zealand")
    return {
      tag: "LIT",
      text: "NZ Colony Loss Survey (Manaaki Whenua), 2015 to 2024.",
    };
  if (name === "Australia")
    return {
      tag: "FLAG",
      text:
        "Australian Colony Loss Survey 2023-2025. Approximate: the full report could not be retrieved, so these three values are unverified.",
    };
  if (EU_NAMES.has(name))
    return {
      tag: "CALC",
      text:
        "COLOSS winter 2019-20 (Gray et al. 2022), scaled to other years by the overall European rate. Exact for 2019-20, an approximation either side of it.",
    };
  if (["Algeria", "Egypt", "Iran", "Israel", "Mexico"].includes(name))
    return { tag: "LIT", text: "COLOSS winter 2019-20 (Gray et al. 2022)." };
  return {
    tag: "FLAG",
    text: "Regional approximation. No per-country survey was found for it.",
  };
}

/**
 * The five places this wiki argues from, and what their series does not say.
 * Every sentence traces to references/. The two interview lines are what a
 * named interviewee told us, reported as that rather than as a survey finding.
 */
export const NOTES: Record<string, string[]> = {
  "United States of America": [
    "The steepest trend on the map: 36% in 2008, 55.6% in 2024-25, against a 14-year mean of 41.4%.",
    "Varroa is the most-reported cause of winter loss across every operation size in the BIP survey.",
  ],
  California: [
    "Not a survey result. The almond bloom pulls the migratory fleet into one state each February, and commercial operations lose more than the national average, so the map carries the 62% commercial figure here.",
    "Read it as the pressure the pollination market puts on that fleet, not as a measured California rate.",
  ],
  Australia: [
    "Varroa was first detected in June 2022, at the Port of Newcastle, New South Wales. The eradication campaign destroyed roughly 30,000 hives and cost AU$101 million before it was abandoned in September 2023, 14 months in.",
    "The mite is established in New South Wales, Queensland, Victoria, the ACT and South Australia. Western Australia and the Northern Territory remain free of it. Resistance to the major synthetic miticides was first seen in early 2026.",
    "Danny Le Feuvre, Australian Honey Bee Industry Council, described reinvasion from untreated feral colonies undoing the successful treatment of managed hives.",
  ],
  "United Kingdom": [
    "One measured point: 18.0% in COLOSS winter 2019-20. Every other year drawn here is that figure scaled by the European average, not a UK measurement.",
    "Mark Sandham, an Oxford beekeeper, told us varroa reached the UK in the 1990s, and that he has not seen it devastate local colonies the way it has elsewhere, though he found deformed-wing evidence in hives he inherited.",
  ],
  "New Zealand": [
    "The flattest of the five series: 9.7% to 13.6% across a decade of national surveys.",
  ],
};

export const SOURCES: { ref: string; url: string }[] = [
  {
    ref: "Gray et al. 2022, J. Apic. Res. 61(2), COLOSS winter 2019-20 loss rates across 37 countries",
    url: "https://strathprints.strath.ac.uk/82475/1/Gray_etal_JAR_2022_Honey_bee_colony_loss_rates_in_37_countries_using_the_COLOSS_survey_for_winter_2019_2020.pdf",
  },
  {
    ref: "Apiary Inspectors of America / Bee Informed Partnership, US Beekeeping Survey 2024-25",
    url: "https://apiaryinspectors.org/US-beekeeping-survey-24-25",
  },
  {
    ref: "Bee Informed Partnership 2022-23 loss abstract, varroa the most-reported cause of winter loss",
    url: "https://www.sdnewswatch.org/content/files/wp-content/uploads/2023/06/bip-2022-23-loss-abstract.pdf",
  },
  {
    ref: "NZ Colony Loss Survey 2024, Manaaki Whenua Landcare Research",
    url: "https://www.landcareresearch.co.nz/discover-our-research/environment/sustainable-society-and-policy/nz-colony-loss-survey/2024-colony-loss-survey",
  },
  {
    ref: "Australian Colony Loss Survey Results Report 2025, AHBIC and AgriFutures",
    url: "https://honeybee.org.au/australian-colony-loss-survey-results-report-2025/",
  },
];

export const CAVEATS: string[] = [
  "This is reported colony loss, not the spread of the mite. A country appears in the year its survey coverage begins, which for most of Europe is 2008.",
  "Only the United States, California, Canada, New Zealand and Australia are resolved year by year. European countries are one measured year scaled by the European average. Every other country is a single latest value, repeated across the animation.",
  "Losses are total reported losses. Varroa is the most-reported cause in the US, New Zealand and Canadian surveys, not the sole cause.",
  "US figures for 2008 to 2010 are winter-loss based. The annual survey began in 2010-11.",
  "Latin America, the Middle East, Central Asia, Russia, Turkey and North Africa outside Egypt and Algeria are regional approximations, tagged FLAG.",
];
