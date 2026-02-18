"use client";

import { useState, useRef } from "react";
import Image from "next/image";

export default function Admin() {
  const [token, setToken] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState("");
  const [preview, setPreview] = useState("");
  const [imagePath, setImagePath] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "vase",
    status: "finished",
    date: new Date().toISOString().split("T")[0],
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
    if (data.success) {
      setToken(data.token);
    } else {
      setError("Wrong credentials. Try again.");
    }
  };

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
    if (data.success) {
      setImagePath(data.path);
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imagePath) return setError("Please upload an image first");
    
    const res = await fetch("/api/pieces", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ ...form, image: imagePath }),
    });
    
    if (res.ok) {
      setSuccess("Piece added! ✨");
      setForm({ title: "", description: "", category: "vase", status: "finished", date: new Date().toISOString().split("T")[0] });
      setPreview("");
      setImagePath("");
      if (fileRef.current) fileRef.current.value = "";
      setTimeout(() => setSuccess(""), 3000);
    }
  };

  if (!token) {
    return (
      <div className="pt-32 pb-16 min-h-screen flex items-center justify-center">
        <form onSubmit={login} className="w-full max-w-sm space-y-6 px-6">
          <div className="text-center mb-8">
            <h1 className="font-serif text-4xl font-light mb-2">Studio Access</h1>
            <p className="text-warm-gray text-sm">For Elsie&apos;s eyes only</p>
          </div>
          
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-3 bg-cream-dark border border-clay-light/30 text-charcoal placeholder:text-warm-gray/50 focus:outline-none focus:border-terracotta text-sm"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 bg-cream-dark border border-clay-light/30 text-charcoal placeholder:text-warm-gray/50 focus:outline-none focus:border-terracotta text-sm"
          />
          <button
            type="submit"
            className="w-full py-3 bg-charcoal text-cream text-sm tracking-[0.2em] uppercase hover:bg-terracotta-dark transition-colors"
          >
            Enter
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="pt-28 lg:pt-36 pb-16">
      <div className="max-w-2xl mx-auto px-6 lg:px-12">
        <div className="mb-12">
          <p className="text-warm-gray text-sm tracking-[0.3em] uppercase mb-3">Studio</p>
          <h1 className="font-serif text-4xl lg:text-5xl font-light">Add a Piece</h1>
        </div>

        {success && (
          <div className="mb-8 p-4 bg-sage/20 border border-sage text-sage-dark text-sm">
            {success}
          </div>
        )}
        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 text-red-600 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={submit} className="space-y-8">
          {/* Image upload */}
          <div>
            <label className="block text-sm tracking-[0.15em] uppercase text-warm-gray mb-3">
              Photo
            </label>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handleFile}
              className="block w-full text-sm text-warm-gray file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:bg-charcoal file:text-cream file:cursor-pointer hover:file:bg-terracotta-dark"
            />
            {uploading && <p className="text-warm-gray text-sm mt-2">Uploading...</p>}
            {preview && (
              <div className="mt-4 relative w-48 h-48">
                <Image src={preview} alt="Preview" fill className="object-cover rounded-sm" />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm tracking-[0.15em] uppercase text-warm-gray mb-3">Title</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
              className="w-full px-4 py-3 bg-cream-dark border border-clay-light/30 text-charcoal focus:outline-none focus:border-terracotta text-sm"
              placeholder="What shall we call this one?"
            />
          </div>

          <div>
            <label className="block text-sm tracking-[0.15em] uppercase text-warm-gray mb-3">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 bg-cream-dark border border-clay-light/30 text-charcoal focus:outline-none focus:border-terracotta text-sm resize-none"
              placeholder="Tell the story of this piece..."
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm tracking-[0.15em] uppercase text-warm-gray mb-3">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-4 py-3 bg-cream-dark border border-clay-light/30 text-charcoal focus:outline-none focus:border-terracotta text-sm"
              >
                <option value="vase">Vase</option>
                <option value="bowl">Bowl</option>
                <option value="plate">Plate</option>
                <option value="sculpture">Sculpture</option>
                <option value="experiment">Experiment</option>
              </select>
            </div>
            <div>
              <label className="block text-sm tracking-[0.15em] uppercase text-warm-gray mb-3">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full px-4 py-3 bg-cream-dark border border-clay-light/30 text-charcoal focus:outline-none focus:border-terracotta text-sm"
              >
                <option value="finished">Finished piece</option>
                <option value="process">In progress</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm tracking-[0.15em] uppercase text-warm-gray mb-3">Date</label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="w-full px-4 py-3 bg-cream-dark border border-clay-light/30 text-charcoal focus:outline-none focus:border-terracotta text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={!imagePath}
            className="w-full py-4 bg-charcoal text-cream text-sm tracking-[0.2em] uppercase hover:bg-terracotta-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Add to Collection
          </button>
        </form>
      </div>
    </div>
  );
}
