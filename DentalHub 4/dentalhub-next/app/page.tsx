
"use client";

import { useEffect, useRef } from "react";

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    let script: HTMLScriptElement | null = null;

    async function loadDentalHub() {
      try {
        const response = await fetch("/original-frontend/index.html");

        if (!response.ok) {
          throw new Error("Could not load the original DentalHub HTML.");
        }

        const html = await response.text();
        const parsed = new DOMParser().parseFromString(html, "text/html");

        // Remove the original script tag; we load it after the HTML.
        parsed.body.querySelectorAll("script").forEach((tag) => tag.remove());

        const container = containerRef.current;

        if (!container || cancelled) return;

        // Preserve the original HTML and its structure.
        container.innerHTML = parsed.body.innerHTML;

        // Correct the original relative image paths.
        container.querySelectorAll<HTMLImageElement>("img").forEach((img) => {
          const src = img.getAttribute("src");

          if (src && !src.startsWith("/") && !src.startsWith("http")) {
            img.src = `/original-frontend/${src}`;
          }
        });

        // Load the original Google fonts.
        if (!document.querySelector("[data-dentalhub-fonts]")) {
          const fonts = document.createElement("link");
          fonts.rel = "stylesheet";
          fonts.href =
            "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Manrope:wght@400;500;600;700;800&display=swap";
          fonts.setAttribute("data-dentalhub-fonts", "true");
          document.head.appendChild(fonts);
        }

        // Run the original frontend JavaScript after its HTML exists.
        script = document.createElement("script");
        script.src = "/original-frontend/script.js";
        script.async = false;
        document.body.appendChild(script);
      } catch (error) {
        console.error("DentalHub loading error:", error);
        if (containerRef.current && !cancelled) {
          containerRef.current.textContent =
            "DentalHub could not load. Check the browser console for details.";
        }
      }
    }

    loadDentalHub();

    return () => {
      cancelled = true;
      script?.remove();
    };
  }, []);

  return <div ref={containerRef} />;
}
