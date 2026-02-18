"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

interface ContentItem {
  id: string;
  value: string;
  updated_at?: string;
}

interface Section {
  title: string;
  fields: { id: string; label: string; type: "input" | "textarea" | "photo" }[];
}

const SECTIONS: Section[] = [
  {
    title: "Homepage",
    fields: [
      { id: "home_subtitle", label: "Subtitle / Label", type: "input" },
      { id: "home_hero_line1", label: "Hero Line 1", type: "input" },
      { id: "home_hero_line2", label: "Hero Line 2 (italic)", type: "input" },
      { id: "home_hero_line3", label: "Hero Line 3", type: "input" },
      { id: "home_intro", label: "Intro Paragraph", type: "textarea" },
      { id: "home_quote", label: "Quote", type: "textarea" },
      { id: "home_cta_title", label: "CTA Section Title", type: "input" },
      { id: "home_cta_text", label: "CTA Section Text", type: "textarea" },
    ],
  },
  {
    title: "About",
    fields: [
      { id: "about_heading", label: "Heading", type: "input" },
      { id: "about_heading_accent", label: "Heading Accent (italic)", type: "input" },
      { id: "about_bio", label: "Bio (paragraphs separated by blank lines)", type: "textarea" },
      { id: "about_studio", label: "Studio Description", type: "textarea" },
      { id: "about_photo", label: "Profile Photo", type: "photo" },
    ],
  },
  {
    title: "Gallery",
    fields: [
      { id: "gallery_subtitle", label: "Label", type: "input" },
      { id: "gallery_heading", label: "Heading", type: "input" },
      { id: "gallery_intro", label: "Intro Text", type: "textarea" },
    ],
  },
  {
    title: "Logbook",
    fields: [
      { id: "logbook_subtitle", label: "Label", type: "input" },
      { id: "logbook_heading", label: "Heading", type: "input" },
      { id: "logbook_intro", label: "Intro Text", type: "textarea" },
    ],
  },
  {
    title: "Footer",
    fields: [
      { id: "footer_name", label: "Name", type: "input" },
      { id: "footer_tagline", label: "Tagline", type: "input" },
      { id: "footer_quote", label: "Footer Quote", type: "input" },
    ],
  },
  {
    title: "Site-wide",
    fields: [
      { id: "site_title", label: "Site Title (browser tab)", type: "input" },
    ],
  },
];

export default function ContentEditor({ token }: { token: string }) {
  const [content, setContent] = useState<Record<string, string>>({});
  const [original, setOriginal] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const photoRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/content")
      .then((r) => r.json())
      .then((data: ContentItem[]) => {
        const map: Record<string, string> = {};
        for (const item of data) map[item.id] = item.value;
        setContent(map);
        setOriginal(map);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const updateField = (id: string, value: string) => {
    setContent((prev) => ({ ...prev, [id]: value }));
  };

  const saveSection = async (section: Section) => {
    setSaving(section.title);
    setError("");
    setSuccess("");

    const updates = section.fields
      .filter((f) => f.type !== "photo")
      .map((f) => ({ id: f.id, value: content[f.id] || "" }));

    // Include photo field value too
    const photoField = section.fields.find((f) => f.type === "photo");
    if (photoField) {
      updates.push({ id: photoField.id, value: content[photoField.id] || "" });
    }

    const res = await fetch("/api/content", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updates),
    });

    if (res.ok) {
      setSuccess(`${section.title} saved! ✨`);
      setOriginal((prev) => {
        const next = { ...prev };
        for (const u of updates) next[u.id] = u.value;
        return next;
      });
      setTimeout(() => setSuccess(""), 3000);
    } else {
      setError("Failed to save. Please try again.");
    }
    setSaving(null);
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingPhoto(true);
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/upload", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    const data = await res.json();
    setUploadingPhoto(false);
    if (data.success) {
      updateField("about_photo", data.path);
    }
  };

  const hasChanges = (section: Section) => {
    return section.fields.some((f) => content[f.id] !== original[f.id]);
  };

  const inputClass =
    "w-full max-w-full px-4 py-3 bg-cream-dark border border-clay-light/30 text-charcoal placeholder:text-warm-gray/50 focus:outline-none focus:border-terracotta text-sm box-border";
  const labelClass = "block text-sm tracking-[0.15em] uppercase text-warm-gray mb-2";

  if (loading) {
    return (
      <div className="text-center py-16 text-warm-gray">Loading content...</div>
    );
  }

  return (
    <div className="space-y-12">
      {success && (
        <div className="p-4 bg-sage/20 border border-sage text-sage-dark text-sm">
          {success}
        </div>
      )}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-600 text-sm">
          {error}
        </div>
      )}

      {SECTIONS.map((section) => (
        <div key={section.title} className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-clay-light/30" />
            <span className="text-xs tracking-[0.3em] uppercase text-terracotta font-light">
              {section.title}
            </span>
            <div className="h-px flex-1 bg-clay-light/30" />
          </div>

          {section.fields.map((field) => {
            if (field.type === "photo") {
              return (
                <div key={field.id}>
                  <label className={labelClass}>{field.label}</label>
                  {content[field.id] && (
                    <div className="relative w-48 h-48 mb-3">
                      <Image
                        src={content[field.id]}
                        alt="About photo"
                        fill
                        className="object-cover rounded-sm"
                      />
                    </div>
                  )}
                  <input
                    ref={photoRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="block w-full text-sm text-warm-gray file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:bg-charcoal file:text-cream file:cursor-pointer hover:file:bg-terracotta-dark"
                  />
                  {uploadingPhoto && (
                    <p className="text-warm-gray text-sm mt-2">Uploading...</p>
                  )}
                </div>
              );
            }

            if (field.type === "textarea") {
              return (
                <div key={field.id}>
                  <label className={labelClass}>{field.label}</label>
                  <textarea
                    value={content[field.id] || ""}
                    onChange={(e) => updateField(field.id, e.target.value)}
                    rows={field.id === "about_bio" ? 12 : 4}
                    className={`${inputClass} resize-y`}
                  />
                </div>
              );
            }

            return (
              <div key={field.id}>
                <label className={labelClass}>{field.label}</label>
                <input
                  type="text"
                  value={content[field.id] || ""}
                  onChange={(e) => updateField(field.id, e.target.value)}
                  className={inputClass}
                />
              </div>
            );
          })}

          <button
            onClick={() => saveSection(section)}
            disabled={saving !== null || !hasChanges(section)}
            className="px-8 py-3 bg-charcoal text-cream text-sm tracking-[0.2em] uppercase hover:bg-terracotta-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {saving === section.title
              ? "Saving..."
              : hasChanges(section)
              ? `Save ${section.title}`
              : "No changes"}
          </button>
        </div>
      ))}
    </div>
  );
}
