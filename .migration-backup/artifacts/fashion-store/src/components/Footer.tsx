export default function Footer() {
  const linkCls = "text-[13px] text-gray-600 hover:text-gray-900 hover:underline transition-colors leading-6";
  const headCls = "text-[12px] font-bold tracking-widest text-gray-900 mb-3 uppercase";

  return (
    <footer style={{ fontFamily: "'Poppins', sans-serif", borderTop: "1px solid #e5e5e5" }}>

      {/* Main link columns */}
      <div style={{ background: "#fff", padding: "40px 32px 32px" }}>
        <div style={{ maxWidth: 1300, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1.4fr 1.3fr 1fr 1.2fr", gap: 24 }}>

          {/* DESIGNER WEAR */}
          <div>
            <p className={headCls}>Designer Wear</p>
            {["Saree Blouse", "Mens", "KALKI Influencers", "Celebrity Wear", "Zayra - LFW", "Inara - LFW II"].map((l) => (
              <a key={l} href="#" className={linkCls} style={{ display: "block" }}>{l}</a>
            ))}
          </div>

          {/* ABOUT US */}
          <div>
            <p className={headCls}>About Us</p>
            {["About Us", "Corporate Governance", "Contact Us", "Blog", "Web Stories", "Testimonial", "Press", "Lookbook", "Our Stores", "KALKI Fashion Show", "Video Call Appointment", "Buying Guide"].map((l) => (
              <a key={l} href="#" className={linkCls} style={{ display: "block" }}>{l}</a>
            ))}
          </div>

          {/* POLICIES */}
          <div>
            <p className={headCls}>Policies</p>
            {["Terms & Conditions", "Shipping", "Returns", "Privacy Policy", "Privacy Policy For APP", "Payment Policy", "FAQ's", "Customization Charges", "Sustainability", "Grievances"].map((l) => (
              <a key={l} href="#" className={linkCls} style={{ display: "block" }}>{l}</a>
            ))}
          </div>

          {/* MY ACCOUNT */}
          <div>
            <p className={headCls}>My Account</p>
            {["Shopping Bag", "Wishlist", "Order History", "Order Tracking", "Buy in bulk"].map((l) => (
              <a key={l} href="#" className={linkCls} style={{ display: "block" }}>{l}</a>
            ))}
          </div>

          {/* SAFE & SECURE + SOCIAL + CONTACT */}
          <div>
            <p className={headCls}>Safe &amp; Secure Payment</p>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 20 }}>
              {["PayPal", "MC", "VISA", "Amex", "Diners"].map((card) => (
                <span key={card} style={{ border: "1px solid #ccc", borderRadius: 4, padding: "2px 7px", fontSize: 10, color: "#555", fontWeight: 600, background: "#fafafa" }}>{card}</span>
              ))}
            </div>

            <p className={headCls} style={{ marginTop: 4 }}>Follow Us</p>
            <div style={{ display: "flex", gap: 14, marginBottom: 20 }}>
              {[
                { label: "Instagram", icon: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" },
                { label: "Facebook", icon: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" },
                { label: "WhatsApp", icon: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" },
                { label: "YouTube", icon: "M23.495 6.205a3.007 3.007 0 00-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 00.527 6.205a31.247 31.247 0 00-.522 5.805 31.247 31.247 0 00.522 5.783 3.007 3.007 0 002.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 002.088-2.088 31.247 31.247 0 00.5-5.783 31.247 31.247 0 00-.5-5.805zM9.609 15.601V8.408l6.264 3.602z" },
                { label: "Pinterest", icon: "M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" },
                { label: "X", icon: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.26 5.632L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" },
              ].map(({ label, icon }) => (
                <a key={label} href="#" aria-label={label} style={{ color: "#333", transition: "color 0.2s" }}
                  onMouseOver={(e) => (e.currentTarget.style.color = "#000")}
                  onMouseOut={(e) => (e.currentTarget.style.color = "#333")}
                >
                  <svg viewBox="0 0 24 24" width={20} height={20} fill="currentColor"><path d={icon} /></svg>
                </a>
              ))}
            </div>

            <div style={{ marginBottom: 12 }}>
              <p className={headCls} style={{ marginBottom: 4 }}>Get In Touch</p>
              <a href="tel:+912248900416" className={linkCls}>+91 (22) 4890 0416 (INDIA)</a>
            </div>
            <div>
              <p className={headCls} style={{ marginBottom: 4 }}>Email Us On</p>
              <a href="mailto:info@kalkifashion.com" className={linkCls}>info@kalkifashion.com</a>
            </div>
          </div>
        </div>
      </div>

      {/* SEO link rows */}
      <div style={{ background: "#f7f7f7", borderTop: "1px solid #e5e5e5", padding: "20px 32px" }}>
        <div style={{ maxWidth: 1300, margin: "0 auto" }}>
          {[
            { label: "Latest Ethnic Collection:", links: ["Kalki X Rhea Kapoor", "Spring Summer '26", "Bride & Baraat VIII", "Dark Romance", "La Soirée", "ZOHA", "KALKI x Alanna Pandey Collections", "Resort Prints", "RUMI", "Zayra", "Inara"] },
            { label: "New Arrival", links: ["Latest Salwar Suits", "Latest Sarees", "Latest Lehengas", "Latest Men's wear"] },
            { label: "Best Seller", links: ["Best Selling Salwar Suits", "Best Selling Saree", "Best Selling Lehengas", "Best Selling Gown", "Best Selling Kurti", "Best Selling Men's wear"] },
            { label: "Quick Links", links: ["Sale", "Lehengas Under USD 399", "Men's Wear Under USD 199", "Yellow Classics", "Fifty Shades of Black", "Sequin Saree", "Weave Saree", "Jumpsuit", "Festive Collection", "Engagement", "Mehendi", "Sangeet"] },
            { label: "Measurement", links: ["Saree and Blouse", "Salwar and Kameez", "Lehengas and Choli", "Gowns", "Size Chart", "Maternity Size Guide"] },
          ].map(({ label, links }) => (
            <div key={label} style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "baseline", marginBottom: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: "#333", whiteSpace: "nowrap", textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</span>
              {links.map((l, i) => (
                <span key={l} style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                  <a href="#" style={{ fontSize: 11, color: "#666", textDecoration: "none", whiteSpace: "nowrap" }}
                    onMouseOver={(e) => (e.currentTarget.style.textDecoration = "underline")}
                    onMouseOut={(e) => (e.currentTarget.style.textDecoration = "none")}
                  >{l}</a>
                  {i < links.length - 1 && <span style={{ color: "#bbb", fontSize: 10 }}>|</span>}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ background: "#f0f0f0", borderTop: "1px solid #e0e0e0", padding: "16px 32px" }}>
        <div style={{ maxWidth: 1300, margin: "0 auto" }}>
          {/* USP row */}
          <div style={{ display: "flex", justifyContent: "center", gap: 48, marginBottom: 12, flexWrap: "wrap" }}>
            {[
              { icon: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z", label: "24x7", sub: "Customer Support" },
              { icon: "M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z", label: "Free Shipping*", sub: "" },
              { icon: "M19 8l-4 4h3c0 3.31-2.69 6-6 6-1.01 0-1.97-.25-2.8-.7l-1.46 1.46C8.97 19.54 10.43 20 12 20c4.42 0 8-3.58 8-8h3l-4-4zM6 12c0-3.31 2.69-6 6-6 1.01 0 1.97.25 2.8.7l1.46-1.46C15.03 4.46 13.57 4 12 4c-4.42 0-8 3.58-8 8H1l4 4 4-4H6z", label: "Easy Returns*", sub: "" },
              { icon: "M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.98-4.17 3.71-6.53H17V4h-7V2H8v2H1v1.99h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z", label: "Custom", sub: "Fitting" },
            ].map(({ icon, label, sub }) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <svg viewBox="0 0 24 24" width={22} height={22} fill="#555"><path d={icon} /></svg>
                <div>
                  <span style={{ fontSize: 12, fontWeight: 600, color: "#333" }}>{label}</span>
                  {sub && <span style={{ fontSize: 12, color: "#333" }}><br />{sub}</span>}
                </div>
              </div>
            ))}
          </div>

          {/* Ship row */}
          <p style={{ textAlign: "center", fontSize: 12, color: "#555", marginBottom: 6 }}>
            <strong style={{ color: "#222" }}>We Ship Across the World</strong>
            {"  "}United States, United Kingdom, Canada, Australia, India
          </p>

          {/* Copyright */}
          <p style={{ textAlign: "center", fontSize: 11, color: "#999" }}>
            &copy; 2007 - 2026 KALKI Fashion Privat Limited All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
