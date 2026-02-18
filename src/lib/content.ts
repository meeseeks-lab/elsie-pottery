import { supabase } from "./supabase";

export interface ContentMap {
  [key: string]: string;
}

const DEFAULTS: ContentMap = {
  site_title: "Elsie Leung — Learning with Clay",
  home_subtitle: "A pottery journal from Barcelona",
  home_hero_line1: "Hands,",
  home_hero_line2: "clay,",
  home_hero_line3: "patience",
  home_intro: "Three years of learning. Every piece a small lesson in letting go, embracing imperfection, and finding beauty in the process.",
  home_quote: "The kiln decides the final word. I\u2019m just here to start the conversation.",
  home_cta_title: "The Journey Continues",
  home_cta_text: "Follow along as I learn, fail, and occasionally create something worth keeping.",
  about_heading: "Not a potter.",
  about_heading_accent: "A student of clay.",
  about_bio: "",
  about_studio: "",
  about_photo: "/uploads/lavender-vase.jpg",
  gallery_heading: "Gallery",
  gallery_subtitle: "Collection",
  gallery_intro: "Each piece carries a story — of the clay, the glaze, and the moment it all came together (or didn\u2019t).",
  logbook_heading: "Logbook",
  logbook_subtitle: "Studio",
  logbook_intro: "Every session tells a story. Clay temperatures, glaze experiments, and the quiet moments at the wheel.",
  footer_name: "Elsie Leung",
  footer_tagline: "Barcelona · Learning with clay since 2022",
  footer_quote: "Every piece is a lesson. Every glaze is a surprise.",
};

export async function getContent(): Promise<ContentMap> {
  try {
    const { data, error } = await supabase
      .from("elsie_content")
      .select("id, value");
    if (error || !data) return { ...DEFAULTS };
    const map: ContentMap = { ...DEFAULTS };
    for (const row of data) {
      map[row.id] = row.value;
    }
    return map;
  } catch {
    return { ...DEFAULTS };
  }
}

export function c(content: ContentMap, key: string): string {
  return content[key] ?? DEFAULTS[key] ?? "";
}
