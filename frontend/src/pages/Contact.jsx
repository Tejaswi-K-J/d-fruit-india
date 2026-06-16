import { useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";
import "./Contact.css";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    message: "",
  });

  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await api.post("/contact", formData);
      toast.success("Thank you! We’ll get back to you soon.");
      setFormData({ name: "", phone: "", message: "" });
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to send message"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="contact-page">
      <div className="contact-container">
        <div className="contact-header">
          <h1>Contact Us</h1>
          <p>
            Have a question, feedback, or need assistance? We’d love to hear from you.
          </p>
        </div>

        <div className="contact-grid">
          {/* CONTACT INFO */}
          <div className="contact-info">
            <h3>Get in Touch</h3>

            <p>📍 <strong>Location:</strong> India</p>
            <p>📧 <strong>Email:</strong> dfruitindia99@gmail.com</p>
            <p>📞 <strong>Phone:</strong> +91 9XXXXXXXXX</p>

            <p className="contact-note">
              Our support team is available to assist you with orders, products,
              and general inquiries.
            </p>
          </div>

          {/* FORM */}
          <div className="contact-form-wrapper">
            <h3>Send Us a Message</h3>

            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                required
              />

              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                required
              />

              <textarea
                name="message"
                placeholder="Your Message"
                rows="4"
                value={formData.message}
                onChange={handleChange}
                required
              />

              <button type="submit" disabled={submitting}>
                {submitting ? "Sending..." : "Submit"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
