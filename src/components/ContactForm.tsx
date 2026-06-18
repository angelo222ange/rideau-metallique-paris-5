"use client";
import { useState } from "react";
import { siteConfig } from "@/config/site";

const WEBHOOK = "https://lioai.app.n8n.cloud/webhook/drm-contact";

export default function ContactForm() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const payload = {
      nom: String(fd.get("nom") || ""),
      telephone: String(fd.get("telephone") || ""),
      email: String(fd.get("email") || ""),
      prestation: String(fd.get("prestation") || ""),
      message: String(fd.get("message") || ""),
      source: `${siteConfig.domain}-contact-form`,
      brand: siteConfig.brand,
      city: siteConfig.city,
      sitePhone: siteConfig.telephone,
      submittedAt: new Date().toISOString(),
    };
    try {
      await fetch(WEBHOOK, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      setSent(true);
    } catch {
      setSent(true);
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return <p style={{ fontSize: 16, color: "#04323F", fontWeight: 600 }}>Merci, votre demande a bien ete envoyee. Nous vous rappelons rapidement.</p>;
  }

  const field: React.CSSProperties = { width: "100%", padding: "12px 14px", borderRadius: 10, border: "1px solid #E2DCD0", fontSize: 15, marginBottom: 14, fontFamily: "var(--font-geist)" };

  return (
    <form onSubmit={onSubmit}>
      <input name="nom" required placeholder="Votre nom" style={field} />
      <input name="telephone" required placeholder="Telephone" style={field} />
      <input name="email" type="email" placeholder="Email (optionnel)" style={field} />
      <select name="prestation" style={field} defaultValue="Depannage">
        <option>Depannage</option>
        <option>Installation</option>
        <option>Reparation</option>
        <option>Motorisation</option>
        <option>Deblocage</option>
        <option>Entretien</option>
        <option>Fabrication</option>
      </select>
      <textarea name="message" placeholder="Decrivez votre besoin" rows={4} style={{ ...field, resize: "vertical" }} />
      <button type="submit" className="btn-primary" disabled={loading} style={{ width: "100%" }}>
        {loading ? "Envoi..." : "Envoyer ma demande"}
      </button>
    </form>
  );
}
