import { promises as fs } from "fs";
import path from "path";
import LogbookClient from "./LogbookClient";

export interface LogEntry {
  id: string;
  date: string;
  title: string;
  photos: string[];
  clayType: string;
  clayBrand: string;
  techniques: string[];
  formingDetails: string;
  stage: string;
  firingType: string;
  firingTemp: string;
  firingTempUnit: string;
  firingSchedule: string;
  glazes: string;
  glazeApplication: string;
  glazeCoats: number;
  underglazeDecoration: string;
  roomTemp: string;
  roomHumidity: string;
  dryingTime: string;
  kilnPosition: string;
  outcomeNotes: string;
  mood: string;
  learnings: string;
  linkedPieceId: string;
  createdAt: string;
}

async function getEntries(): Promise<LogEntry[]> {
  try {
    const filePath = path.join(process.cwd(), "public", "data", "logbook.json");
    const data = await fs.readFile(filePath, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export default async function LogbookPage() {
  const entries = await getEntries();

  return (
    <div className="pt-24 lg:pt-32 pb-16">
      <div className="max-w-4xl mx-auto px-6 lg:px-12">
        <div className="mb-16">
          <p className="text-warm-gray text-sm tracking-[0.3em] uppercase mb-3">Studio</p>
          <h1 className="font-serif text-5xl lg:text-6xl font-light mb-6">Logbook</h1>
          <p className="text-warm-gray font-light text-lg max-w-xl">
            Every session tells a story. Clay temperatures, glaze experiments, 
            and the quiet moments at the wheel.
          </p>
        </div>

        {entries.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-12 h-px bg-terracotta/30 mx-auto mb-8" />
            <p className="font-serif text-2xl text-warm-gray/50 italic">
              The logbook is waiting for its first entry...
            </p>
            <p className="text-warm-gray/40 text-sm mt-3">
              Studio sessions will appear here as a living record of the craft.
            </p>
          </div>
        ) : (
          <LogbookClient entries={entries} />
        )}
      </div>
    </div>
  );
}
