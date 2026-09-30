# E-Ink Portfolio Experience

A minimalist, high-performance personal portfolio featuring interactive e-ink fluid dynamics, custom paper textures, and responsive design.

![E-Ink Portfolio Preview](assets/images/profile-avatar.png)

---

## ✦ Key Features

- **Interactive Ink Flow Engine**: Real-time 2D HTML5 canvas wave physics animation simulating organic e-ink motion with interactive touch and pointer force feedback.
- **E-Ink Design System**: Built with modern CSS variables, paper grain texture overlays, tactile shadow effects, and typography featuring **Newsreader**, **Space Grotesk**, and **JetBrains Mono**.
- **Adaptive Light/Dark Theme**: Smooth transition between light and dark e-ink paper modes with persistent local preferences and system theme detection.
- **Responsive Floating Navigation**: Sleek floating glassmorphism/paper navbar and footer with mobile menu support.
- **Contact Integration**: Contact form powered by Formspree with client-side validation and anti-spam protection.

---

## 🛠️ Tech Stack

- **HTML5**: Semantic markup with structured sections and accessible ARIA attributes.
- **Vanilla CSS**: Custom design system without heavy frameworks for maximum speed and smooth rendering.
- **JavaScript (ES6+)**: Zero-GC memory-pooled 2D Canvas animation controller for fluid 60FPS motion.

---

## 📁 Repository Structure

```
├── assets/
│   ├── css/
│   │   └── style.css            # E-Ink design system & custom styling
│   ├── js/
│   │   ├── inkflow.js           # Interactive canvas fluid dynamics controller
│   │   └── script.js            # Navbar, theme toggle, & form validation
│   └── images/
│       └── profile-avatar.png   # Profile media assets
├── index.html                   # Main portfolio landing page
└── README.md                    # Project documentation
```

---

## 🚀 Quick Start

1. **Clone the repository:**
   ```bash
   git clone https://github.com/fnz78/Farhan_Nazim.git
   ```

2. **Run locally:**
   - Open `index.html` directly in any web browser, or serve it using any HTTP local server (e.g. `npx serve`, Live Server extension, or `python -m http.server`).

---

## 📜 License

This project is open-source and available under the [MIT License](LICENSE).
