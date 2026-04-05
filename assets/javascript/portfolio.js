document.addEventListener('DOMContentLoaded', function () {
  const contentByCategory = {
    shortform: {
      type: "video",
      files: []
    },
    shortform2: {
      type: "video",
      files: []
    },
    mograph: {
      type: "video",
      files: []
    },
    mograph2: {
      type: "video",
      files: []
    },
    longform: {
      type: "video",
      files: []
    },
    longform2: {
      type: "video",
      files: []
    },
    // testi: {
    //   type: "video",
    //   files: ["feedback.mp4"]
    // },
    graphicsdesign: {
      type: "image",
      files: []
    }
  };

  // Load media dynamically
  for (let category in contentByCategory) {
    const gridId = 'videoGrid' + capitalizeFirstLetter(category);
    const mediaGrid = document.getElementById(gridId);
    const { type, files } = contentByCategory[category];

    if (mediaGrid) {
      files.forEach(fileName => {
        const card = document.createElement('div');
        card.className = 'video-card lazy-card';

        if (type === "video") {
          const video = document.createElement('video');
          video.setAttribute('controls', '');
          video.setAttribute('preload', 'metadata');
          video.setAttribute('muted', '');
          video.setAttribute('playsinline', '');
          video.setAttribute('data-src', `assets/videos/${fileName}`);
          card.appendChild(video);
        } else if (type === "image") {
          const img = document.createElement('img');
          img.setAttribute('data-src', `assets/images/${fileName}`);
          img.alt = "Graphic Design Work";
          img.classList.add('lazy-image');
          img.addEventListener('click', openLightbox); // Click to open popup
          card.appendChild(img);
        }
        mediaGrid.appendChild(card);
      });
    }
  }

  lazyLoadVideos();
  lazyLoadImages();
});

// Helper
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// Lazy loading
function lazyLoadVideos() {
  const lazyVideos = document.querySelectorAll('video[data-src]');
  const config = { rootMargin: '300px 0px', threshold: 0.01 };
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const video = entry.target;
        video.src = video.getAttribute('data-src');
        video.load();
        video.removeAttribute('data-src');
        generateThumbnail(video);
        obs.unobserve(video);
      }
    });
  }, config);

  lazyVideos.forEach(video => observer.observe(video));
}

function lazyLoadImages() {
  const lazyImages = document.querySelectorAll('img.lazy-image');
  const config = { rootMargin: '300px 0px', threshold: 0.01 };
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.getAttribute('data-src');
        img.removeAttribute('data-src');
        obs.unobserve(img);
      }
    });
  }, config);

  lazyImages.forEach(img => observer.observe(img));
}

// Generate thumbnail for video
function generateThumbnail(video) {
  video.addEventListener('loadeddata', function () {
    if (video.readyState >= 2) {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      video.currentTime = 1;
      video.addEventListener('seeked', function handler() {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        video.setAttribute('poster', canvas.toDataURL('image/jpeg'));
        video.pause();
        video.removeEventListener('seeked', handler);
      }, { once: true });
    }
  }, { once: true });
}

// Lightbox Functions
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const closeBtn = document.querySelector('.close');

function openLightbox(event) {
  lightbox.style.display = "block";
  lightboxImg.src = event.target.src;
}

closeBtn.addEventListener('click', function() {
  lightbox.style.display = "none";
});

window.addEventListener('click', function(e) {
  if (e.target == lightbox) {
    lightbox.style.display = "none";
  }
});

// Fade-in Animation
function fadeInOnScroll() {
  const cards = document.querySelectorAll('.video-card');
  const trigger = window.innerHeight * 0.9;
  cards.forEach(card => {
    const top = card.getBoundingClientRect().top;
    if (top < trigger) {
      card.classList.add('show');
    }
  });
}
window.addEventListener('scroll', fadeInOnScroll);
window.addEventListener('load', fadeInOnScroll);

document.addEventListener('DOMContentLoaded', function () {
  const buttons = document.querySelectorAll('.btn-category');
  const sections = document.querySelectorAll('.section-category');

  buttons.forEach(button => {
    button.addEventListener('click', function () {
      buttons.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');

      const filter = this.getAttribute('data-filter');

      sections.forEach(section => {
        if (filter === 'all' || section.id === filter) {
          section.style.display = 'block';
          section.classList.add('fade-in');
        } else {
          section.style.display = 'none';
          section.classList.remove('fade-in');
        }
      });
    });
  });
});

const card = document.createElement('div');
card.className = 'video-card lazy-card';

// Add Skeleton Loader
const skeleton = document.createElement('div');
skeleton.className = 'skeleton';
card.appendChild(skeleton);

// Add Video
if (type === "video") {
  const video = document.createElement('video');
  video.setAttribute('controls', '');
  video.setAttribute('preload', 'metadata');
  video.setAttribute('muted', '');
  video.setAttribute('playsinline', '');
  video.setAttribute('data-src', `assets/videos/${fileName}`);
  card.appendChild(video);
} else if (type === "image") {
  const img = document.createElement('img');
  img.setAttribute('data-src', `assets/images/${fileName}`);
  img.alt = "Graphic Design Work";
  img.classList.add('lazy-image');
  img.addEventListener('click', openLightbox);
  card.appendChild(img);
}
function lazyLoadVideos() {
  const lazyVideos = document.querySelectorAll('video[data-src]');
  const config = { rootMargin: '300px 0px', threshold: 0.01 };
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const video = entry.target;
        const card = video.closest('.video-card');

        // Step 1: Load video source
        video.src = video.getAttribute('data-src');
        video.load();
        video.removeAttribute('data-src');

        // Step 2: Wait for video metadata
        video.addEventListener('loadedmetadata', () => {
          generateThumbnail(video, card);
        });

        obs.unobserve(video);
      }
    });
  }, config);

  lazyVideos.forEach(video => observer.observe(video));
}

// New generateThumbnail function
function generateThumbnail(video, card) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  video.currentTime = Math.min(0, video.duration / 2); // Jump to middle for good thumbnail

  video.addEventListener('seeked', function capture() {
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataURL = canvas.toDataURL('image/jpeg', 0.7);
    video.setAttribute('poster', dataURL);

    // Smoothly reveal the video
    video.classList.add('loaded');

    // Remove skeleton placeholder
    const skeleton = card.querySelector('.skeleton');
    if (skeleton) skeleton.remove();

    video.removeEventListener('seeked', capture);
  }, { once: true });
}
