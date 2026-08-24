document.documentElement.classList.add("js");

const header = document.querySelector(".site-header");
const menuButton = document.querySelector(".menu-toggle");
const nav = document.querySelector(".site-nav");
const navLinks = [...document.querySelectorAll(".site-nav a")];
const revealItems = [...document.querySelectorAll(".reveal")];

function updateHeader() {
  header.dataset.elevated = window.scrollY > 18 ? "true" : "false";
}

menuButton.addEventListener("click", () => {
  const isOpen = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!isOpen));
  nav.classList.toggle("is-open", !isOpen);
  document.body.classList.toggle("menu-open", !isOpen);
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    menuButton.setAttribute("aria-expanded", "false");
    nav.classList.remove("is-open");
    document.body.classList.remove("menu-open");
  });
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { rootMargin: "0px 0px -12% 0px", threshold: 0.12 },
);

revealItems.forEach((item) => revealObserver.observe(item));

function revealVisibleItems() {
  revealItems.forEach((item) => {
    const rect = item.getBoundingClientRect();
    const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
    if (isVisible) {
      item.classList.add("is-visible");
    }
  });
}

window.addEventListener("load", revealVisibleItems);
window.addEventListener("hashchange", () => {
  window.requestAnimationFrame(revealVisibleItems);
});
window.requestAnimationFrame(revealVisibleItems);

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      navLinks.forEach((link) => {
        link.classList.toggle("is-active", link.getAttribute("href") === `#${entry.target.id}`);
      });
    });
  },
  { rootMargin: "-35% 0px -55% 0px", threshold: 0.02 },
);

["problem", "solution", "process", "hardware", "market", "founders"].forEach((id) => {
  const section = document.getElementById(id);
  if (section) {
    sectionObserver.observe(section);
  }
});

const preorderForm = document.querySelector(".preorder-form");

if (preorderForm) {
  const status = preorderForm.querySelector(".form-status");

  preorderForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(preorderForm);
    const preorder = Object.fromEntries(formData.entries());
    preorder.createdAt = new Date().toISOString();
    preorder.reference = `STA-${Date.now().toString().slice(-6)}`;

    try {
      const saved = JSON.parse(localStorage.getItem("stabilyPreorders") || "[]");
      saved.push(preorder);
      localStorage.setItem("stabilyPreorders", JSON.stringify(saved));
    } catch (error) {
      console.warn("Could not persist preorder locally", error);
    }

    status.textContent = `Đã ghi nhận đăng ký ${preorder.reference}. Đội ngũ Stabily sẽ liên hệ lại qua email hoặc số điện thoại của bạn.`;
    preorderForm.reset();
  });
}

window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();
