import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Hero.css";

const slides = [
  {
    image: "/hero/d1.jpg",
    eyebrow: "🌿 100% Natural & Organic",
    title: "Nourishing India,",
    highlight: "Naturally.",
    desc: "Premium dry fruits and wholesome snacks — handpicked for everyday health, energy, and taste.",
  },
  {
    image: "/hero/d2.png",
    eyebrow: "✨ Handpicked Quality",
    title: "Pure Nutrition,",
    highlight: "Every Day.",
    desc: "From the farms of India to your table — no additives, no compromise, only goodness.",
  },
  {
    image: "/hero/d3.jpg",
    eyebrow: "🇮🇳 Made for Indian Families",
    title: "Healthy Choices,",
    highlight: "Better Living.",
    desc: "Fuel your body with nature's finest ingredients, crafted with Indian traditions in mind.",
  },
];

const stats = [
  { value: "50+", label: "Products" },
  { value: "100%", label: "Natural" },
  { value: "Pan-India", label: "Delivery" },
  { value: "10K+", label: "Happy Customers" },
];

const Hero = () => {
  const [current, setCurrent] = useState(0);
  const [imgLoaded, setImgLoaded] = useState(false);

  useEffect(() => {
    setImgLoaded(false);
    const t = setTimeout(() => setImgLoaded(true), 50);
    return () => clearTimeout(t);
  }, [current]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const slide = slides[current];

  return (
    <section className="hero">
      {/* BACKGROUND */}
      <img
        key={current}
        src={slide.image}
        alt="Hero background"
        className={`hero-bg-img ${imgLoaded ? "loaded" : ""}`}
        onLoad={() => setImgLoaded(true)}
      />

      {/* OVERLAYS */}
      <div className="hero-overlay" />
      <div className="hero-pattern" />

      {/* CONTENT */}
      <div className="hero-content" key={`content-${current}`}>
        <div className="hero-eyebrow">{slide.eyebrow}</div>

        <h1>
          {slide.title}
          <br />
          <em>{slide.highlight}</em>
        </h1>

        <p>{slide.desc}</p>

        <div className="hero-ctas">
          <Link to="/products" className="hero-cta-primary">
            Shop Now →
          </Link>
          <Link to="/about" className="hero-cta-secondary">
            Our Story
          </Link>
        </div>
      </div>

      {/* SLIDE DOTS */}
      <div className="hero-dots">
        {slides.map((_, i) => (
          <button
            key={i}
            className={`hero-dot ${i === current ? "active" : ""}`}
            onClick={() => setCurrent(i)}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      {/* STATS BAR */}
      <div className="hero-stats">
        {stats.map((s) => (
          <div key={s.label} className="hero-stat">
            <span className="hero-stat-value">{s.value}</span>
            <span className="hero-stat-label">{s.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Hero;