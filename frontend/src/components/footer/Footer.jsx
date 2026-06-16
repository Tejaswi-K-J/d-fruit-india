import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">

      {/* ── BRAND + SUBSCRIBE ─────────────── */}
      <div className="footer-brand-row">
        <div className="footer-brand">
          <div className="footer-brand-name">
            <div className="footer-brand-icon">🌿</div>
            D Fruit India
          </div>
          <p className="footer-brand-desc">
            Bringing the finest natural dry fruits and wholesome snacks to Indian families.
            Pure, honest nutrition you can trust — every day.
          </p>
          <div className="footer-social">
            <a className="footer-social-btn" href="#" aria-label="Instagram">📸</a>
            <a className="footer-social-btn" href="#" aria-label="Facebook">👍</a>
            <a className="footer-social-btn" href="#" aria-label="WhatsApp">💬</a>
            <a className="footer-social-btn" href="#" aria-label="YouTube">▶</a>
          </div>
        </div>

        <div className="footer-subscribe">
          <h4>Stay in the loop</h4>
          <p>Get exclusive offers, new arrivals &amp; health tips.</p>
          <div className="subscribe-box">
            <input type="text" placeholder="Your WhatsApp number" />
            <button>
              <img src="/icons/whatsapp.svg" alt="WhatsApp" />
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* ── LINKS ─────────────────────────── */}
      <div className="footer-top">
        <div className="footer-col">
          <h4>Shop</h4>
          <p>All Products</p>
          <p>Dry Fruits</p>
          <p>Nuts &amp; Seeds</p>
          <p>Healthy Snacks</p>
          <p>Gift Packs</p>
        </div>

        <div className="footer-col">
          <h4>Help</h4>
          <p>Track My Order</p>
          <p>My Account</p>
          <p>Contact Us</p>
          <p>FAQs</p>
        </div>

        <div className="footer-col">
          <h4>Company</h4>
          <p>About D Fruit India</p>
          <p>Our Vision</p>
          <p>Blogs &amp; Articles</p>
          <p>Careers</p>
        </div>

        <div className="footer-col">
          <h4>Policies</h4>
          <p>Terms of Service</p>
          <p>Privacy Policy</p>
          <p>Shipping Policy</p>
          <p>Return &amp; Refund</p>
        </div>
      </div>

      {/* ── PAYMENTS ──────────────────────── */}
      <div className="footer-payments">
        <span className="footer-payments-label">We accept</span>
        <div className="payment-icons">
          <img src="/icons/gpay.svg"       alt="Google Pay" />
          <img src="/icons/phonepe.svg"    alt="PhonePe" />
          <img src="/icons/paytm.svg"      alt="Paytm" />
          <img src="/icons/amazonpay.svg"  alt="Amazon Pay" />
          <img src="/icons/visa.svg"       alt="Visa" />
          <img src="/icons/mastercard.svg" alt="Mastercard" />
        </div>
      </div>

      {/* ── BOTTOM ────────────────────────── */}
      <div className="footer-bottom">
        <span className="footer-copyright">
          © {new Date().getFullYear()} D Fruit India. All rights reserved.
        </span>
        <div className="footer-bottom-links">
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">Sitemap</a>
        </div>
      </div>

    </footer>
  );
};

export default Footer;