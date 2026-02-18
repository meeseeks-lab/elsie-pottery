"use client";

import { useState, useRef } from "react";
import Image from "next/image";

const CLAY_TYPES = ["stoneware", "porcelain", "earthenware", "terracotta", "raku"];
const TECHNIQUES = ["wheel throwing", "hand building", "coiling", "slab building", "pinching", "sculpting", "trimming", "carving", "other"];
const STAGES = ["greenware", "leather-hard", "bone-dry", "bisque fired", "glazed", "glaze fired", "finished"];
const FIRING_TYPES = ["electric kiln", "gas kiln", "wood kiln", "raku", "pit firing", "N/A"];
const GLAZE_APPLICATIONS = ["dipping", "brushing", "spraying", "pouring", "layering"];
const MOODS = ["🧘", "✨", "😤", "🎉", "😌", "🤔", "💪", "😴"];

export default function Admin() {
  const [token, setToken] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [activeTab, setActiveTab] = useState<"piece" | "logbook">("piece");

  // === Piece form state ===
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState("");
  const [imagePath, setImagePath] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const [pieceForm, setPieceForm] = useState({
    title: "",
    description: "",
    category: "vase",
    status: "finished",
    date: new Date().toISOString().split("T")[0],
  });

  // === Logbook form state ===
  const [logPhotos, setLogPhotos] = useState<string[]>([]);
  const [logPhotoPreviews, setLogPhotoPreviews] = useState<string[]>([]);
  const [logUploading, setLogUploading] = useState(false);
  const logFileRef = useRef<HTMLInputElement>(null);
  const [logForm, setLogForm] = useState({
    date: new Date().toISOString().split("T")[0],
    title: "",
    clayType: "",
    customClayType: "",
    clayBrand: "",
    techniques: [] as string[],
    formingDetails: "",
    stage: "",
    firingType: "",
    firingTemp: "",
    firingTempUnit: "°C",
    firingSchedule: "",
    glazes: "",
    glazeApplication: "",
    glazeCoats: "",
    underglazeDecoration: "",
    roomTemp: "",
    roomHumidity: "",
    dryingTime: "",
    kilnPosition: "",
    outcomeNotes: "",
    mood: "",
    learnings: "",
    linkedPieceId: "",
  });

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (data.success) setToken(data.token);
    else setError("Wrong credentials. Try again.");
  };

  // === Piece handlers ===
  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/upload", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    const data = await res.json();
    setUploading(false);
    if (data.success) setImagePath(data.path);
  };

  const submitPiece = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imagePath) return setError("Please upload an image first");
    const res = await fetch("/api/pieces", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ ...pieceForm, image: imagePath }),
    });
    if (res.ok) {
      setSuccess("Piece added! ✨");
      setPieceForm({ title: "", description: "", category: "vase", status: "finished", date: new Date().toISOString().split("T")[0] });
      setPreview("");
      setImagePath("");
      if (fileRef.current) fileRef.current.value = "";
      setTimeout(() => setSuccess(""), 3000);
    }
  };

  // === Logbook handlers ===
  const handleLogPhotos = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    setLogUploading(true);
    for (const file of Array.from(files)) {
      setLogPhotoPreviews((prev) => [...prev, URL.createObjectURL(file)]);
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (data.success) setLogPhotos((prev) => [...prev, data.path]);
    }
    setLogUploading(false);
  };

  const toggleTechnique = (t: string) => {
    setLogForm((f) => ({
      ...f,
      techniques: f.techniques.includes(t)
        ? f.techniques.filter((x) => x !== t)
        : [...f.techniques, t],
    }));
  };

  const submitLog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!logForm.title) return setError("Please add a session title");
    const entry = {
      ...logForm,
      clayType: logForm.clayType === "custom" ? logForm.customClayType : logForm.clayType,
      glazeCoats: logForm.glazeCoats ? parseInt(logForm.glazeCoats) : 0,
      photos: logPhotos,
    };
    const res = await fetch("/api/logbook", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(entry),
    });
    if (res.ok) {
      setSuccess("Log entry saved! 📓");
      setLogForm({
        date: new Date().toISOString().split("T")[0], title: "", clayType: "", customClayType: "",
        clayBrand: "", techniques: [], formingDetails: "", stage: "", firingType: "",
        firingTemp: "", firingTempUnit: "°C", firingSchedule: "", glazes: "",
        glazeApplication: "", glazeCoats: "", underglazeDecoration: "", roomTemp: "",
        roomHumidity: "", dryingTime: "", kilnPosition: "", outcomeNotes: "",
        mood: "", learnings: "", linkedPieceId: "",
      });
      setLogPhotos([]);
      setLogPhotoPreviews([]);
      if (logFileRef.current) logFileRef.current.value = "";
      setTimeout(() => setSuccess(""), 3000);
    }
  };

  const inputClass = "w-full px-4 py-3 bg-cream-dark border border-clay-light/30 text-charcoal placeholder:text-warm-gray/50 focus:outline-none focus:border-terracotta text-sm";
  const labelClass = "block text-sm tracking-[0.15em] uppercase text-warm-gray mb-2";
  const sectionTitle = (text: string) => (
    <div className="mt-8 mb-4 flex items-center gap-3">
      <div className="h-px flex-1 bg-clay-light/30" />
      <span className="text-xs tracking-[0.3em] uppercase text-terracotta font-light">{text}</span>
      <div className="h-px flex-1 bg-clay-light/30" />
    </div>
  );

  if (!token) {
    return (
      <div className="pt-32 pb-16 min-h-screen flex items-center justify-center">
        <form onSubmit={login} className="w-full max-w-sm space-y-6 px-6">
          <div className="text-center mb-8">
            <h1 className="font-serif text-4xl font-light mb-2">Studio Access</h1>
            <p className="text-warm-gray text-sm">For Elsie&apos;s eyes only</p>
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)}
            className={inputClass} />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}
            className={inputClass} />
          <button type="submit"
            className="w-full py-3 bg-charcoal text-cream text-sm tracking-[0.2em] uppercase hover:bg-terracotta-dark transition-colors">
            Enter
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="pt-28 lg:pt-36 pb-16">
      <div className="max-w-2xl mx-auto px-6 lg:px-12">
        <div className="mb-8">
          <p className="text-warm-gray text-sm tracking-[0.3em] uppercase mb-3">Studio</p>
          <h1 className="font-serif text-4xl lg:text-5xl font-light">Admin</h1>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-10 border-b border-clay-light/30">
          {(["piece", "logbook"] as const).map((tab) => (
            <button key={tab} onClick={() => { setActiveTab(tab); setError(""); setSuccess(""); }}
              className={`px-6 py-3 text-sm tracking-[0.2em] uppercase transition-colors border-b-2 -mb-px ${
                activeTab === tab ? "border-terracotta text-charcoal" : "border-transparent text-warm-gray hover:text-charcoal"
              }`}>
              {tab === "piece" ? "Add Piece" : "Log Session"}
            </button>
          ))}
        </div>

        {success && (
          <div className="mb-8 p-4 bg-sage/20 border border-sage text-sage-dark text-sm">{success}</div>
        )}
        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 text-red-600 text-sm">{error}</div>
        )}

        {/* === PIECE TAB === */}
        {activeTab === "piece" && (
          <form onSubmit={submitPiece} className="space-y-8">
            <div>
              <label className={labelClass}>Photo</label>
              <input ref={fileRef} type="file" accept="image/*" onChange={handleFile}
                className="block w-full text-sm text-warm-gray file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:bg-charcoal file:text-cream file:cursor-pointer hover:file:bg-terracotta-dark" />
              {uploading && <p className="text-warm-gray text-sm mt-2">Uploading...</p>}
              {preview && (
                <div className="mt-4 relative w-48 h-48">
                  <Image src={preview} alt="Preview" fill className="object-cover rounded-sm" />
                </div>
              )}
            </div>
            <div>
              <label className={labelClass}>Title</label>
              <input type="text" value={pieceForm.title} onChange={(e) => setPieceForm({ ...pieceForm, title: e.target.value })}
                required className={inputClass} placeholder="What shall we call this one?" />
            </div>
            <div>
              <label className={labelClass}>Description</label>
              <textarea value={pieceForm.description} onChange={(e) => setPieceForm({ ...pieceForm, description: e.target.value })}
                rows={4} className={`${inputClass} resize-none`} placeholder="Tell the story of this piece..." />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className={labelClass}>Category</label>
                <select value={pieceForm.category} onChange={(e) => setPieceForm({ ...pieceForm, category: e.target.value })} className={inputClass}>
                  <option value="vase">Vase</option><option value="bowl">Bowl</option><option value="plate">Plate</option>
                  <option value="sculpture">Sculpture</option><option value="experiment">Experiment</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Status</label>
                <select value={pieceForm.status} onChange={(e) => setPieceForm({ ...pieceForm, status: e.target.value })} className={inputClass}>
                  <option value="finished">Finished piece</option><option value="process">In progress</option>
                </select>
              </div>
            </div>
            <div>
              <label className={labelClass}>Date</label>
              <input type="date" value={pieceForm.date} onChange={(e) => setPieceForm({ ...pieceForm, date: e.target.value })} className={inputClass} />
            </div>
            <button type="submit" disabled={!imagePath}
              className="w-full py-4 bg-charcoal text-cream text-sm tracking-[0.2em] uppercase hover:bg-terracotta-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
              Add to Collection
            </button>
          </form>
        )}

        {/* === LOGBOOK TAB === */}
        {activeTab === "logbook" && (
          <form onSubmit={submitLog} className="space-y-6">
            {/* Session Info */}
            {sectionTitle("Session Info")}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="sm:col-span-2">
                <label className={labelClass}>Session Title *</label>
                <input type="text" value={logForm.title} onChange={(e) => setLogForm({ ...logForm, title: e.target.value })}
                  required className={inputClass} placeholder="First raku firing attempt" />
              </div>
              <div>
                <label className={labelClass}>Date</label>
                <input type="date" value={logForm.date} onChange={(e) => setLogForm({ ...logForm, date: e.target.value })} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Mood</label>
                <div className="flex gap-2 flex-wrap">
                  {MOODS.map((m) => (
                    <button key={m} type="button" onClick={() => setLogForm({ ...logForm, mood: logForm.mood === m ? "" : m })}
                      className={`text-2xl p-2 rounded transition-all ${logForm.mood === m ? "bg-terracotta/20 scale-110" : "hover:bg-cream-dark"}`}>
                      {m}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Photos */}
            <div>
              <label className={labelClass}>Photos</label>
              <input ref={logFileRef} type="file" accept="image/*" multiple onChange={handleLogPhotos}
                className="block w-full text-sm text-warm-gray file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:bg-charcoal file:text-cream file:cursor-pointer hover:file:bg-terracotta-dark" />
              {logUploading && <p className="text-warm-gray text-sm mt-2">Uploading...</p>}
              {logPhotoPreviews.length > 0 && (
                <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
                  {logPhotoPreviews.map((p, i) => (
                    <div key={i} className="relative w-24 h-24 flex-shrink-0">
                      <Image src={p} alt={`Photo ${i + 1}`} fill className="object-cover rounded-sm" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Clay */}
            {sectionTitle("Clay")}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className={labelClass}>Clay Type</label>
                <select value={logForm.clayType} onChange={(e) => setLogForm({ ...logForm, clayType: e.target.value })} className={inputClass}>
                  <option value="">Select...</option>
                  {CLAY_TYPES.map((c) => <option key={c} value={c}>{c}</option>)}
                  <option value="custom">Custom</option>
                </select>
                {logForm.clayType === "custom" && (
                  <input type="text" value={logForm.customClayType} onChange={(e) => setLogForm({ ...logForm, customClayType: e.target.value })}
                    className={`${inputClass} mt-2`} placeholder="Custom clay type" />
                )}
              </div>
              <div>
                <label className={labelClass}>Brand / Source</label>
                <input type="text" value={logForm.clayBrand} onChange={(e) => setLogForm({ ...logForm, clayBrand: e.target.value })}
                  className={inputClass} placeholder="Optional" />
              </div>
            </div>

            {/* Forming */}
            {sectionTitle("Forming")}
            <div>
              <label className={labelClass}>Techniques</label>
              <div className="flex flex-wrap gap-2">
                {TECHNIQUES.map((t) => (
                  <button key={t} type="button" onClick={() => toggleTechnique(t)}
                    className={`px-3 py-1.5 text-xs tracking-wide rounded-full border transition-colors ${
                      logForm.techniques.includes(t)
                        ? "bg-terracotta text-cream border-terracotta"
                        : "border-clay-light/50 text-warm-gray hover:border-terracotta hover:text-charcoal"
                    }`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className={labelClass}>Forming Details</label>
              <textarea value={logForm.formingDetails} onChange={(e) => setLogForm({ ...logForm, formingDetails: e.target.value })}
                rows={3} className={`${inputClass} resize-none`} placeholder="Wall thickness, shape goals, challenges..." />
            </div>
            <div>
              <label className={labelClass}>Stage</label>
              <select value={logForm.stage} onChange={(e) => setLogForm({ ...logForm, stage: e.target.value })} className={inputClass}>
                <option value="">Select...</option>
                {STAGES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            {/* Firing */}
            {sectionTitle("Firing")}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className={labelClass}>Firing Type</label>
                <select value={logForm.firingType} onChange={(e) => setLogForm({ ...logForm, firingType: e.target.value })} className={inputClass}>
                  <option value="">Select...</option>
                  {FIRING_TYPES.map((f) => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>Temperature</label>
                <div className="flex gap-2">
                  <input type="number" value={logForm.firingTemp} onChange={(e) => setLogForm({ ...logForm, firingTemp: e.target.value })}
                    className={`${inputClass} flex-1`} placeholder="e.g. 1260" />
                  <select value={logForm.firingTempUnit} onChange={(e) => setLogForm({ ...logForm, firingTempUnit: e.target.value })}
                    className="px-3 py-3 bg-cream-dark border border-clay-light/30 text-charcoal text-sm focus:outline-none">
                    <option value="°C">°C</option><option value="°F">°F</option>
                  </select>
                </div>
              </div>
            </div>
            <div>
              <label className={labelClass}>Firing Schedule</label>
              <input type="text" value={logForm.firingSchedule} onChange={(e) => setLogForm({ ...logForm, firingSchedule: e.target.value })}
                className={inputClass} placeholder="Ramp rate, hold time, cooling..." />
            </div>

            {/* Glazing */}
            {sectionTitle("Glazing")}
            <div>
              <label className={labelClass}>Glaze(s) Used</label>
              <input type="text" value={logForm.glazes} onChange={(e) => setLogForm({ ...logForm, glazes: e.target.value })}
                className={inputClass} placeholder="Name, brand, recipe..." />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className={labelClass}>Application</label>
                <select value={logForm.glazeApplication} onChange={(e) => setLogForm({ ...logForm, glazeApplication: e.target.value })} className={inputClass}>
                  <option value="">Select...</option>
                  {GLAZE_APPLICATIONS.map((g) => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>Number of Coats</label>
                <input type="number" min="0" value={logForm.glazeCoats} onChange={(e) => setLogForm({ ...logForm, glazeCoats: e.target.value })}
                  className={inputClass} placeholder="e.g. 3" />
              </div>
            </div>
            <div>
              <label className={labelClass}>Underglaze / Oxide Decoration</label>
              <input type="text" value={logForm.underglazeDecoration} onChange={(e) => setLogForm({ ...logForm, underglazeDecoration: e.target.value })}
                className={inputClass} placeholder="Optional" />
            </div>

            {/* Environment */}
            {sectionTitle("Environment")}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <label className={labelClass}>Room Temp (°C)</label>
                <input type="number" value={logForm.roomTemp} onChange={(e) => setLogForm({ ...logForm, roomTemp: e.target.value })}
                  className={inputClass} placeholder="Optional" />
              </div>
              <div>
                <label className={labelClass}>Humidity (%)</label>
                <input type="number" value={logForm.roomHumidity} onChange={(e) => setLogForm({ ...logForm, roomHumidity: e.target.value })}
                  className={inputClass} placeholder="Optional" />
              </div>
              <div>
                <label className={labelClass}>Drying Time</label>
                <input type="text" value={logForm.dryingTime} onChange={(e) => setLogForm({ ...logForm, dryingTime: e.target.value })}
                  className={inputClass} placeholder="Optional" />
              </div>
            </div>
            <div>
              <label className={labelClass}>Kiln Position</label>
              <input type="text" value={logForm.kilnPosition} onChange={(e) => setLogForm({ ...logForm, kilnPosition: e.target.value })}
                className={inputClass} placeholder="Top/middle/bottom shelf..." />
            </div>

            {/* Reflections */}
            {sectionTitle("Reflections")}
            <div>
              <label className={labelClass}>Outcome Notes</label>
              <textarea value={logForm.outcomeNotes} onChange={(e) => setLogForm({ ...logForm, outcomeNotes: e.target.value })}
                rows={4} className={`${inputClass} resize-none`} placeholder="What worked, what didn't, cracks, warping, glaze results..." />
            </div>
            <div>
              <label className={labelClass}>Key Learnings</label>
              <textarea value={logForm.learnings} onChange={(e) => setLogForm({ ...logForm, learnings: e.target.value })}
                rows={3} className={`${inputClass} resize-none`} placeholder="Takeaways for next time..." />
            </div>
            <div>
              <label className={labelClass}>Link to Gallery Piece (ID)</label>
              <input type="text" value={logForm.linkedPieceId} onChange={(e) => setLogForm({ ...logForm, linkedPieceId: e.target.value })}
                className={inputClass} placeholder="Optional — piece ID from gallery" />
            </div>

            <button type="submit"
              className="w-full py-4 bg-charcoal text-cream text-sm tracking-[0.2em] uppercase hover:bg-terracotta-dark transition-colors">
              Save Log Entry
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
