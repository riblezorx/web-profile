document.addEventListener("DOMContentLoaded", () => {
  // 1. LOGIKA LOADING SCREEN
  const loader = document.getElementById("loading-screen");
  if (loader) {
    document.body.style.overflowY = "hidden";
    setTimeout(() => {
      loader.classList.add("hide-loader");
      document.body.style.overflowY = "auto";
    }, 2200);
  }

  // 2. LOGIKA ANIMASI SCROLL (Reveal Content)
  const revealElements = document.querySelectorAll(".reveal, .reveal-item");
  const revealOnScroll = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add("active");
          }, index * 100);
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
  );
  revealElements.forEach((el) => revealOnScroll.observe(el));

  // 3. LOGIKA ACTIVE NAVBAR SAAT SCROLL
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-links a");

  const activateNavLink = (id) => {
    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${id}`) {
        link.classList.add("active");
      }
    });
  };

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          activateNavLink(entry.target.id);
        }
      });
    },
    { threshold: 0, rootMargin: "-40% 0px -55% 0px" }
  );
  sections.forEach((section) => sectionObserver.observe(section));

  // 4. LOGIKA TAB UTAMA (Projects, Certificates, Tech Stack)
  const tabBtns = document.querySelectorAll(".tab-btn");
  const tabContents = document.querySelectorAll(".tab-content");

  tabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      tabBtns.forEach((b) => b.classList.remove("active"));
      tabContents.forEach((c) => c.classList.remove("active"));
      btn.classList.add("active");
      const targetId = btn.getAttribute("data-target");
      if (targetId) document.getElementById(targetId).classList.add("active");
    });
  });

  // 5. LOGIKA FILTER SUB-TAB
  // (Sekarang dihandle oleh filterProjects() di index.html karena cards dibuat dinamis)

  // 6. FORM KOMENTAR — sekarang dikirim ke Supabase (lihat index.html)
  // Logika submit ada di index.html agar bisa akses fungsi Supabase
});

// -------------------------------------------------------
// CATATAN: fungsi openCertModal() didefinisikan di index.html
// -------------------------------------------------------

// FUNGSI VALIDASI FILE
function validateFileSize(input) {
  const maxFileSize = 3 * 1024 * 1024;
  if (input.files && input.files[0]) {
    if (input.files[0].size > maxFileSize) {
      alert("Ukuran file terlalu besar! Maksimal ukuran foto adalah 3 MB.");
      input.value = "";
    } else {
      const fileName = input.files[0].name;
      const preview = document.getElementById("foto-preview");
      if (preview) {
        const reader = new FileReader();
        reader.onload = (e) => {
          preview.src = e.target.result;
          preview.style.display = "block";
        };
        reader.readAsDataURL(input.files[0]);
      }
    }
  }
}