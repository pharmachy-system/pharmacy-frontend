import React from 'react';

const products = [
  { name: "Brufen 400mg", price: "12 SAR", badge: "Best Seller" },
  { name: "Vitamin C 1000", price: "28 SAR", badge: "Today Offer" },
  { name: "Blood Pressure Monitor", price: "85 SAR", badge: "Medical" },
];

export default function HeroCarousel() {
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
      <div style={{ position: "relative", width: 300, height: 320 }}>
        {products.map((p, i) => (
          <div key={i} style={{
            position: "absolute", width: 200, background: "#fff",
            borderRadius: 20, padding: "20px 16px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.10)",
            border: "1px solid rgba(31,181,201,0.15)",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
            opacity: i === 0 ? 1 : i === 1 ? 0.5 : 0.25,
            transform: i === 0 ? "translateY(0) scale(1)" : i === 1 ? "translateY(30px) scale(0.9)" : "translateY(55px) scale(0.8)",
            zIndex: 3 - i, left: 50,
          }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: "#1FB5C9", opacity: 0.2 }} />
            <span style={{ fontSize: 13, fontWeight: 700, color: "#0a1628", textAlign: "center" }}>{p.name}</span>
            <span style={{ fontSize: 12, color: "#1FB5C9", fontWeight: 600 }}>{p.price}</span>
            <span style={{ fontSize: 10, background: "rgba(31,181,201,0.1)", color: "#1B3D6F", padding: "2px 10px", borderRadius: 20, fontWeight: 600 }}>{p.badge}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
