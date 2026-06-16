import "./About.css";

const About = () => {
  return (
    <div className="about-container">
      {/* HERO */}
      <div className="about-hero">
        <h1>About D Fruit India</h1>
        <p>
          Nourishing India with premium dry fruits, snacks, and wellness products
          crafted for everyday healthy living.
        </p>
      </div>

      {/* OUR STORY */}
      <section className="about-section">
        <h3><b>Our Story</b></h3>
        <p>
          D Fruit India was founded with a simple belief — good health starts
          with honest food. In a world full of overly processed snacks, we
          wanted to bring back the goodness of natural dry fruits and
          thoughtfully prepared products.
        </p>
        <p>
          Every product we offer is carefully sourced, hygienically processed,
          and packed to retain freshness, taste, and nutritional value.
        </p>
      </section>

      {/* WHY CHOOSE US */}
      <section className="about-section">
        <h2>Why Choose D Fruit India</h2>

        <div className="about-features">
          <div className="feature-card">
            <h4>Premium Quality</h4>
            <p>
              We use high-grade dry fruits and ingredients with strict quality
              checks.
            </p>
          </div>

          <div className="feature-card">
            <h4>Honest Sourcing</h4>
            <p>
              Transparent sourcing from trusted suppliers across India.
            </p>
          </div>

          <div className="feature-card">
            <h4>Healthy by Nature</h4>
            <p>
              No unnecessary additives — just natural goodness.
            </p>
          </div>

          <div className="feature-card">
            <h4>Customer First</h4>
            <p>
              Reliable delivery, secure payments, and responsive support.
            </p>
          </div>
        </div>
      </section>

      {/* OUR PROMISE */}
      <section className="about-section">
        <h3>Our Promise</h3>

        <ul className="about-promise">
          <li>Fresh, high-quality products you can trust</li>
          <li>Hygienic packaging and careful handling</li>
          <li>Fair pricing with no hidden compromises</li>
          <li>Commitment to customer satisfaction</li>
        </ul>
      </section>

      {/* CTA */}
      <section className="about-cta">
        <h3>Taste the goodness of nature</h3>
        <p>
          Experience premium dry fruits and snacks crafted for a healthier you.
        </p>
      </section>
    </div>
  );
};

export default About;
