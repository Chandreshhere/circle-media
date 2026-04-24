import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";

import "./styles/globals.css";
import "./styles/transition.css";
import "./styles/nav.css";
import "./styles/hero.css";
import "./styles/portraits.css";
import "./styles/services.css";
import "./styles/carousel.css";
import "./styles/archive.css";
import "./styles/process.css";
import "./styles/reveal.css";
import "./styles/about.css";
import "./styles/featured-work.css";
import "./styles/stats.css";
import "./styles/testimonials.css";
import "./styles/clients.css";
import "./styles/footer.css";
import "./styles/subpage.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
