"use client";

import { useState } from "react";

interface Review {
  author: string;
  rating: number;
  date: string;
  text: string;
}

const placeholderReviews: Review[] = [
  {
    author: "Olivier Tavernier",
    rating: 5,
    date: "Il y a 2 semaines",
    text: "Rideau metallique de ma boutique bloque un dimanche soir rue Mouffetard. Technicien arrive en 25 minutes, deblocage et reparation du moteur sur place. Service rapide et serieux.",
  },
  {
    author: "Sophie Lambert",
    rating: 5,
    date: "Il y a 3 semaines",
    text: "Apres une tentative d'effraction pres de la place Maubert, ils ont remplace la serrure et la lame finale le matin meme. Ma devanture etait de nouveau securisee avant l'ouverture.",
  },
  {
    author: "Romain Delcourt",
    rating: 5,
    date: "Il y a 1 mois",
    text: "Motorisation de mon rideau manuel dans mon local du Quartier Latin. Pose d'un moteur Somfy propre et bien reglee, avec une vraie explication du fonctionnement. Je recommande.",
  },
  {
    author: "Camille Rousseau",
    rating: 5,
    date: "Il y a 1 mois",
    text: "Installation d'un rideau metallique neuf pour mon commerce pres de la Sorbonne. Prise de mesures precise, devis gratuit et pose impeccable. Tres bon contact du debut a la fin.",
  },
  {
    author: "Sebastien Fournel",
    rating: 4,
    date: "Il y a 2 mois",
    text: "Entretien annuel de mon rideau metallique pres du Pantheon. Equipe ponctuelle, axe et lames verifies, plus aucun grincement. Contrat d'entretien clair et raisonnable.",
  },
  {
    author: "Nathalie Dubois",
    rating: 5,
    date: "Il y a 3 mois",
    text: "Rideau coince a moitie ouvert pres du Jardin des Plantes, impossible de fermer la boutique. Deblocage en urgence le soir meme, sans aucune degradation de la devanture. Parfait.",
  },
];

function GoogleLogo({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  );
}

function Stars({ rating, size = "normal" }: { rating: number; size?: "small" | "normal" }) {
  const s = size === "small" ? 14 : 18;
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg key={star} width={s} height={s} viewBox="0 0 20 20" fill={star <= rating ? "#FBBC05" : "#E4E4E4"}>
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function GoogleReviewCard({ review, isActive, onClick }: { review: Review; isActive: boolean; onClick: () => void }) {
  const initials = review.author.split(" ").map(n => n[0]).join("").toUpperCase();
  const colors = ["#2563eb", "#16a34a", "#9333ea", "#ea580c", "#db2777", "#0d9488"];
  const color = colors[initials.charCodeAt(0) % colors.length];

  return (
    <div
      className="cursor-pointer transition-all duration-300"
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius: 14,
        border: isActive ? "2px solid #04323F" : "1px solid #E2DCD0",
        padding: "24px",
      }}
      onClick={onClick}
    >
      {/* Header: avatar + name + Google badge */}
      <div className="flex items-start gap-3 mb-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: color }}
        >
          <span style={{ color: "#FFFFFF", fontWeight: 600, fontSize: 14 }}>{initials[0]}</span>
        </div>
        <div className="flex-1 min-w-0">
          <h4 style={{ fontSize: 14, fontWeight: 600, color: "#082228" }}>{review.author}</h4>
          <div className="flex items-center gap-1.5">
            <span style={{ fontSize: 12, color: "#033040", opacity: 0.5 }}>Avis de</span>
            <GoogleLogo className="w-3.5 h-3.5" />
            <span style={{ fontSize: 12, color: "#4285F4", fontWeight: 500 }}>Google</span>
          </div>
        </div>
      </div>

      {/* Rating + date */}
      <div className="flex items-center gap-2 mb-3">
        <Stars rating={review.rating} size="small" />
        <span style={{ fontSize: 12, color: "#033040", opacity: 0.4 }}>{review.date}</span>
      </div>

      {/* Review text */}
      <p style={{ fontSize: 14, color: "#082228", lineHeight: 1.6, opacity: 0.8 }}>
        &ldquo;{review.text}&rdquo;
      </p>
    </div>
  );
}

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section id="testimonials" style={{ backgroundColor: "#F5F3EC" }}>
      <div style={{ maxWidth: 1200, padding: "80px 30px", margin: "0 auto" }}>
        {/* Header: LEFT title + RIGHT Google badge */}
        <div
          className="flex flex-col lg:flex-row lg:items-end justify-between"
          style={{ gap: 30, marginBottom: 50 }}
        >
          <div>
            <div
              className="inline-flex items-center px-3 py-1 mb-6"
              style={{ border: "1px solid #E2DCD0", borderRadius: 1000 }}
            >
              <span style={{ fontSize: 13, fontWeight: 500, color: "#04323F" }}>Avis clients</span>
            </div>
            <h2 style={{ fontSize: 52, fontWeight: 500, fontFamily: "var(--font-geist)", color: "#04323F", letterSpacing: "-0.01em", lineHeight: 1.1 }}>
              Ce que disent les commercants de{" "}
              <span style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic" }}>Paris 5</span>
            </h2>
          </div>

          {/* Google Rating Badge */}
          <div
            className="flex items-center gap-4 flex-shrink-0"
            style={{ backgroundColor: "#FFFFFF", borderRadius: 12, padding: "16px 24px", border: "1px solid #E2DCD0" }}
          >
            <div
              className="w-12 h-12 flex items-center justify-center"
              style={{ backgroundColor: "#F5F3EC", borderRadius: "50%" }}
            >
              <GoogleLogo className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span style={{ fontSize: 24, fontWeight: 700, color: "#04323F" }}>4.9</span>
                <Stars rating={5} />
              </div>
              <p style={{ fontSize: 13, color: "#04323F", opacity: 0.5 }}>127 avis Google</p>
            </div>
          </div>
        </div>

        {/* Google Review Cards — 3x2 grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {placeholderReviews.map((review, i) => (
            <GoogleReviewCard
              key={i}
              review={review}
              isActive={i === activeIndex}
              onClick={() => setActiveIndex(i)}
            />
          ))}
        </div>

        {/* CTA: Voir tous les avis sur Google */}
        <div className="mt-10 text-center">
          <a
            href="#"
            className="inline-flex items-center gap-2 transition-all hover:opacity-80"
            style={{ fontSize: 14, fontWeight: 500, color: "#082228" }}
          >
            <GoogleLogo className="w-4 h-4" />
            Voir tous les avis sur Google
            <svg width="14" height="14" fill="none" stroke="#082228" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
