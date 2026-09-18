const header = document.querySelector("[data-header]");
const menuButton = document.querySelector("[data-menu-button]");
const navigation = document.querySelector("[data-nav]");
const lightbox = document.querySelector("[data-lightbox]");
const lightboxImage = document.querySelector("[data-lightbox-image]");
const lightboxCaption = document.querySelector("[data-lightbox-caption]");
const galleryCarousel = document.querySelector("[data-gallery-carousel]");

const updateHeader = () => header?.classList.toggle("scrolled", window.scrollY > 10);
updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

menuButton?.addEventListener("click", () => {
  const isOpen = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!isOpen));
  navigation?.classList.toggle("open", !isOpen);
  document.body.classList.toggle("menu-open", !isOpen);
});

navigation?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    menuButton?.setAttribute("aria-expanded", "false");
    navigation.classList.remove("open");
    document.body.classList.remove("menu-open");
  });
});

document.querySelectorAll("[data-gallery-open]").forEach((button) => {
  button.addEventListener("click", () => {
    if (!lightbox || !lightboxImage || !lightboxCaption) return;
    lightboxImage.src = button.dataset.image ?? "";
    lightboxImage.alt = button.querySelector("img")?.alt ?? "Research figure";
    lightboxCaption.textContent = button.dataset.caption ?? "";
    lightbox.showModal();
  });
});

document.querySelector("[data-lightbox-close]")?.addEventListener("click", () => lightbox?.close());
lightbox?.addEventListener("click", (event) => {
  if (event.target === lightbox) lightbox.close();
});

if (galleryCarousel) {
  const galleryItems = Array.from(galleryCarousel.querySelectorAll("[data-gallery-item]"));
  const previousButton = galleryCarousel.querySelector("[data-gallery-prev]");
  const nextButton = galleryCarousel.querySelector("[data-gallery-next]");
  const status = galleryCarousel.querySelector("[data-gallery-status]");
  const pageSize = 2;
  const pageCount = Math.ceil(galleryItems.length / pageSize);
  let currentPage = 0;

  const showGalleryPage = (page) => {
    currentPage = Math.min(Math.max(page, 0), pageCount - 1);
    const start = currentPage * pageSize;
    const end = Math.min(start + pageSize, galleryItems.length);

    galleryItems.forEach((item, index) => {
      item.hidden = index < start || index >= end;
    });

    if (previousButton) previousButton.disabled = currentPage === 0;
    if (nextButton) nextButton.disabled = currentPage === pageCount - 1;
    if (status) status.textContent = `${start + 1}–${end} of ${galleryItems.length}`;
  };

  previousButton?.addEventListener("click", () => showGalleryPage(currentPage - 1));
  nextButton?.addEventListener("click", () => showGalleryPage(currentPage + 1));
  galleryCarousel.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") showGalleryPage(currentPage - 1);
    if (event.key === "ArrowRight") showGalleryPage(currentPage + 1);
  });

  showGalleryPage(0);
}
