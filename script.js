// Toggle Hamburger Menu
function toggleMenu() {
  const menu = document.querySelector(".menu-links");
  const icon = document.querySelector(".hamburger-icon");
  menu.classList.toggle("open");
  icon.classList.toggle("open");
}

// Dark/Light Mode Toggle
const themeToggle = document.getElementById("theme-icon");
const themeToggleMobile = document.getElementById("theme-icon-mobile");

function toggleTheme() {
  document.body.classList.toggle("dark-theme");
  
  // Update icon
  if (document.body.classList.contains("dark-theme")) {
    themeToggle.classList.remove("fa-moon");
    themeToggle.classList.add("fa-sun");
    
    if (themeToggleMobile) {
      themeToggleMobile.classList.remove("fa-moon");
      themeToggleMobile.classList.add("fa-sun");
    }
  } else {
    themeToggle.classList.remove("fa-sun");
    themeToggle.classList.add("fa-moon");
    
    if (themeToggleMobile) {
      themeToggleMobile.classList.remove("fa-sun");
      themeToggleMobile.classList.add("fa-moon");
    }
  }
  
  // Save preference to localStorage
  const isDarkMode = document.body.classList.contains("dark-theme");
  localStorage.setItem("darkMode", isDarkMode);
}

themeToggle.addEventListener("click", toggleTheme);
if (themeToggleMobile) {
  themeToggleMobile.addEventListener("click", toggleTheme);
}

// Check for saved theme preference
window.addEventListener("DOMContentLoaded", () => {
  const savedDarkMode = localStorage.getItem("darkMode") === "true";
  if (savedDarkMode) {
    document.body.classList.add("dark-theme");
    themeToggle.classList.remove("fa-moon");
    themeToggle.classList.add("fa-sun");
    
    if (themeToggleMobile) {
      themeToggleMobile.classList.remove("fa-moon");
      themeToggleMobile.classList.add("fa-sun");
    }
  }
});

// Animate elements on scroll
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -100px 0px"
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("animate");
      
      // Add specific animations based on element type
      if (entry.target.classList.contains("details-container")) {
        entry.target.style.animationDelay = `${entry.target.dataset.delay || "0s"}`;
      }
    }
  });
}, observerOptions);

// Observe all elements to animate
document.querySelectorAll(".details-container, .project-card, .skill-item").forEach((el, index) => {
  el.dataset.delay = `${index * 0.1}s`;
  observer.observe(el);
});

// Form submission
const contactForm = document.getElementById("contact-form");
if (contactForm) {
  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();
    
    // Get form values
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const message = document.getElementById("message").value;
    
    // Simple validation
    if (!name || !email || !message) {
      alert("Please fill in all fields.");
      return;
    }
    
    // Here you would normally send the form data to a server
    // For now, just show a success message
    alert(`Thank you ${name}! Your message has been sent. I'll get back to you soon at ${email}.`);
    
    // Reset form
    contactForm.reset();
    
    // Add visual feedback
    const submitBtn = contactForm.querySelector("button[type='submit']");
    const originalText = submitBtn.innerHTML;
    
    submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
    submitBtn.style.background = "linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)";
    
    setTimeout(() => {
      submitBtn.innerHTML = originalText;
      submitBtn.style.background = "";
    }, 3000);
  });
}

// Add floating animation to project cards on mouse move
document.querySelectorAll(".project-card").forEach(card => {
  card.addEventListener("mousemove", (e) => {
    const xAxis = (window.innerWidth / 2 - e.pageX) / 25;
    const yAxis = (window.innerHeight / 2 - e.pageY) / 25;
    
    card.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
  });
  
  card.addEventListener("mouseleave", () => {
    card.style.transform = "rotateY(0deg) rotateX(0deg)";
    card.style.transition = "all 0.5s ease";
  });
  
  card.addEventListener("mouseenter", () => {
    card.style.transition = "none";
  });
});

// Add scroll progress indicator
window.addEventListener("scroll", () => {
  const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
  const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrolled = (winScroll / height) * 100;
  
  // Update scroll indicator if exists
  const scrollIndicator = document.querySelector(".scroll-progress");
  if (scrollIndicator) {
    scrollIndicator.style.width = scrolled + "%";
  }
});

// Initialize typewriter effect for multiple texts
const typewriterTexts = [
  "Computer Science Student",
  "AI Enthusiast",
  "Web Developer",
  "Future Innovator"
];

let currentTextIndex = 0;
const typewriterElement = document.querySelector(".typewriter");

if (typewriterElement) {
  function typeWriterEffect() {
    const currentText = typewriterTexts[currentTextIndex];
    let charIndex = 0;
    
    // Clear current text
    typewriterElement.textContent = "";
    typewriterElement.style.borderRight = "3px solid var(--primary-color)";
    
    function typeChar() {
      if (charIndex < currentText.length) {
        typewriterElement.textContent += currentText.charAt(charIndex);
        charIndex++;
        setTimeout(typeChar, 100);
      } else {
        // Pause before deleting
        setTimeout(deleteText, 2000);
      }
    }
    
    function deleteText() {
      if (typewriterElement.textContent.length > 0) {
        typewriterElement.textContent = typewriterElement.textContent.slice(0, -1);
        setTimeout(deleteText, 50);
      } else {
        // Move to next text
        currentTextIndex = (currentTextIndex + 1) % typewriterTexts.length;
        setTimeout(typeWriterEffect, 500);
      }
    }
    
    typeChar();
  }
  
  // Start the typewriter effect
  typeWriterEffect();
}