document.addEventListener("DOMContentLoaded", () => {
    
    // --- EFFECT 1: HACKER TEXT SCRAMBLE ---
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const navLinks = document.querySelectorAll(".sidebar-link");

    navLinks.forEach(link => {
        link.addEventListener("mouseenter", event => {
            let iteration = 0;
            const originalText = event.target.dataset.value; // We will store original text in data-value
            
            clearInterval(event.target.interval);

            event.target.interval = setInterval(() => {
                // Manipulate the text content directly
                event.target.innerText = originalText
                    .split("")
                    .map((letter, index) => {
                        if(index < iteration) {
                            return originalText[index];
                        }
                        return letters[Math.floor(Math.random() * 36)];
                    })
                    .join(""); // Rejoin with arrow icon if needed, but simple text for now

                if(iteration >= originalText.length){ 
                    clearInterval(event.target.interval);
                }
                
                iteration += 1 / 3;
            }, 30); // Speed of scramble
        });
    });

    // --- EFFECT 2: 3D TILT ON PROFILE IMAGE ---
    const card = document.querySelector(".profile-container");
    const image = document.querySelector(".profile-img");

    if (card && image) {
        card.addEventListener("mousemove", (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left; // x position within the element.
            const y = e.clientY - rect.top;  // y position within the element.
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -10; // Max rotation deg
            const rotateY = ((x - centerX) / centerX) * 10;

            // CSS Manipulation
            image.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
        });

        card.addEventListener("mouseleave", () => {
            // Reset CSS
            image.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)`;
        });
    }

    // --- EFFECT 3: MOUSE SPOTLIGHT BACKGROUND ---
    const body = document.querySelector("body");
    document.addEventListener("mousemove", (e) => {
        const x = e.clientX;
        const y = e.clientY;
        
        // CSS Variable Manipulation
        body.style.setProperty("--x", `${x}px`);
        body.style.setProperty("--y", `${y}px`);
    });
});


// animations.js (add INSIDE DOMContentLoaded, near the bottom)
const toggle = document.getElementById("projectsToggle");
const menu = document.getElementById("projectsMenu");

if (toggle && menu) {
  const icon = toggle.querySelector("i");

  toggle.addEventListener("click", () => {
    const isOpen = toggle.getAttribute("aria-expanded") === "true";

    toggle.setAttribute("aria-expanded", String(!isOpen));
    menu.classList.toggle("open", !isOpen);

    if (icon) icon.style.transform = !isOpen ? "rotate(90deg)" : "rotate(0deg)";
  });
}

