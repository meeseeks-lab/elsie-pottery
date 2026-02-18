"use client";

import { useState } from "react";
import Image from "next/image";
import type { LogEntry } from "./page";

const CONE_MAP: Record<string, string> = {
  "600": "022", "700": "019", "800": "015", "900": "010", "1000": "06",
  "1100": "03", "1200": "6", "1220": "7", "1260": "10", "1280": "11", "1300": "12",
};

function getConeEquivalent(temp: string, unit: string): string {
  let celsius = parseInt(temp);
  if (!celsius) return "";
  if (unit === "°F") celsius = Math.round((celsius - 32) * 5 / 9);
  const closest = Object.keys(CONE_MAP)
    .map(Number)
    .sort((a, b) => Math.abs(a - celsius) - Math.abs(b - celsius))[0];
  if (Math.abs(closest - celsius) > 50) return "";
  return `≈ Cone ${CONE_MAP[String(closest)]}`;
}

const MOOD_LABELS: Record<string, string> = {
  "🧘": "Calm & focused",
  "✨": "Inspired",
  "😤": "Frustrated",
  "🎉": "Excited",
  "😌": "Content",
  "🤔": "Experimental",
  "💪": "Energized",
  "😴": "Low energy",
};

function EntryCard({ entry }: { entry: LogEntry }) {
  const [expanded, setExpanded] = useState(false);
  const cone = getConeEquivalent(entry.firingTemp, entry.firingTempUnit);

  return (
    <article className="group">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left"
      >
        <div className="flex flex-col sm:flex-row gap-6">
          {/* Photo */}
          {entry.photos?.[0] && (
            <div className="relative w-full sm:w-40 h-48 sm:h-40 flex-shrink-0 overflow-hidden">
              <Image
                src={entry.photos[0]}
                alt={entry.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          )}

          {/* Summary */}
          <div className="flex-1 min-w-0">
            <time className="font-serif italic text-terracotta text-sm">
              {new Date(entry.date).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
            {entry.mood && (
              <span className="ml-3 text-lg" title={MOOD_LABELS[entry.mood] || ""}>
                {entry.mood}
              </span>
            )}
            <h2 className="font-serif text-2xl lg:text-3xl font-light mt-1 mb-3 text-charcoal group-hover:text-terracotta transition-colors">
              {entry.title}
            </h2>
            <div className="flex flex-wrap gap-2 text-xs tracking-wide">
              {entry.clayType && (
                <span className="px-3 py-1 bg-clay-light/40 text-charcoal-light rounded-full">
                  {entry.clayType}
                </span>
              )}
              {entry.techniques?.map((t) => (
                <span key={t} className="px-3 py-1 bg-sage/20 text-sage-dark rounded-full">
                  {t}
                </span>
              ))}
              {entry.stage && (
                <span className="px-3 py-1 bg-terracotta/10 text-terracotta-dark rounded-full">
                  {entry.stage}
                </span>
              )}
            </div>
            <p className="text-warm-gray text-sm mt-3 flex items-center gap-1">
              {expanded ? "▾ Collapse" : "▸ View details"}
            </p>
          </div>
        </div>
      </button>

      {/* Expanded details */}
      {expanded && (
        <div className="mt-6 ml-0 sm:ml-46 animate-fade-in">
          {/* Photo gallery */}
          {entry.photos?.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-4 mb-6">
              {entry.photos.map((photo, i) => (
                <div key={i} className="relative w-32 h-32 flex-shrink-0 overflow-hidden">
                  <Image src={photo} alt={`${entry.title} ${i + 1}`} fill className="object-cover" />
                </div>
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-sm">
            {/* Clay */}
            {(entry.clayType || entry.clayBrand) && (
              <div>
                <h4 className="text-warm-gray tracking-[0.15em] uppercase text-xs mb-1">Clay</h4>
                <p className="text-charcoal">{[entry.clayType, entry.clayBrand].filter(Boolean).join(" — ")}</p>
              </div>
            )}

            {/* Forming */}
            {entry.formingDetails && (
              <div className="sm:col-span-2">
                <h4 className="text-warm-gray tracking-[0.15em] uppercase text-xs mb-1">Forming Details</h4>
                <p className="text-charcoal whitespace-pre-line">{entry.formingDetails}</p>
              </div>
            )}

            {/* Firing */}
            {entry.firingType && entry.firingType !== "N/A" && (
              <div>
                <h4 className="text-warm-gray tracking-[0.15em] uppercase text-xs mb-1">Firing</h4>
                <p className="text-charcoal">
                  {entry.firingType}
                  {entry.firingTemp && ` — ${entry.firingTemp}${entry.firingTempUnit}`}
                  {cone && <span className="text-warm-gray ml-1">({cone})</span>}
                </p>
              </div>
            )}

            {entry.firingSchedule && (
              <div>
                <h4 className="text-warm-gray tracking-[0.15em] uppercase text-xs mb-1">Firing Schedule</h4>
                <p className="text-charcoal">{entry.firingSchedule}</p>
              </div>
            )}

            {entry.kilnPosition && (
              <div>
                <h4 className="text-warm-gray tracking-[0.15em] uppercase text-xs mb-1">Kiln Position</h4>
                <p className="text-charcoal">{entry.kilnPosition}</p>
              </div>
            )}

            {/* Glazing */}
            {entry.glazes && (
              <div>
                <h4 className="text-warm-gray tracking-[0.15em] uppercase text-xs mb-1">Glaze(s)</h4>
                <p className="text-charcoal">{entry.glazes}</p>
              </div>
            )}

            {entry.glazeApplication && (
              <div>
                <h4 className="text-warm-gray tracking-[0.15em] uppercase text-xs mb-1">Application</h4>
                <p className="text-charcoal">
                  {entry.glazeApplication}
                  {entry.glazeCoats ? ` — ${entry.glazeCoats} coat${entry.glazeCoats > 1 ? "s" : ""}` : ""}
                </p>
              </div>
            )}

            {entry.underglazeDecoration && (
              <div>
                <h4 className="text-warm-gray tracking-[0.15em] uppercase text-xs mb-1">Underglaze / Oxide</h4>
                <p className="text-charcoal">{entry.underglazeDecoration}</p>
              </div>
            )}

            {/* Environment */}
            {(entry.roomTemp || entry.roomHumidity || entry.dryingTime) && (
              <div>
                <h4 className="text-warm-gray tracking-[0.15em] uppercase text-xs mb-1">Environment</h4>
                <p className="text-charcoal">
                  {[
                    entry.roomTemp && `${entry.roomTemp}°C`,
                    entry.roomHumidity && `${entry.roomHumidity}% humidity`,
                    entry.dryingTime && `Drying: ${entry.dryingTime}`,
                  ].filter(Boolean).join(" · ")}
                </p>
              </div>
            )}

            {/* Outcome */}
            {entry.outcomeNotes && (
              <div className="sm:col-span-2 mt-2">
                <h4 className="text-warm-gray tracking-[0.15em] uppercase text-xs mb-1">Outcome</h4>
                <p className="text-charcoal whitespace-pre-line">{entry.outcomeNotes}</p>
              </div>
            )}

            {/* Learnings */}
            {entry.learnings && (
              <div className="sm:col-span-2 mt-2 p-4 bg-sage/10 border-l-2 border-sage/40">
                <h4 className="text-sage-dark tracking-[0.15em] uppercase text-xs mb-1">Key Learnings</h4>
                <p className="text-charcoal whitespace-pre-line">{entry.learnings}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </article>
  );
}

export default function LogbookClient({ entries }: { entries: LogEntry[] }) {
  return (
    <div className="space-y-12">
      {entries.map((entry, i) => (
        <div key={entry.id}>
          {i > 0 && <div className="w-16 h-px bg-clay-light/50 mx-auto mb-12" />}
          <EntryCard entry={entry} />
        </div>
      ))}
    </div>
  );
}
