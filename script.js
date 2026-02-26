let deferredPrompt = null;

// Register Service Worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}

// Detect beforeinstallprompt
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
});

document.addEventListener('DOMContentLoaded', () => {
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;

  if (isStandalone) {
    document.getElementById('preview-mode').style.display = 'none';
    document.getElementById('app-mode').classList.remove('hidden');
    startBootSequence();
  } else {
    document.getElementById('app-mode').classList.add('hidden');
    document.getElementById('preview-mode').style.display = 'flex';
  }

  // Install button
  document.getElementById('install-btn').addEventListener('click', async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') deferredPrompt = null;
    } else {
      alert('Buka menu Chrome (⋮) → Install app / Tambahkan ke layar utama');
    }
  });

  document.getElementById('cancel-btn').addEventListener('click', () => {
    // tidak melakukan apa-apa, sesuai GitHub
  });
});

function startBootSequence() {
  // Force landscape + fullscreen
  if (screen.orientation && screen.orientation.lock) {
    screen.orientation.lock('landscape-primary').catch(() => {});
  }
  if (document.documentElement.requestFullscreen) {
    document.documentElement.requestFullscreen({ navigationUI: 'hide' }).catch(() => {});
  }

  const black1 = document.getElementById('black1');
  const splash = document.getElementById('splash');
  const black2 = document.getElementById('black2');
  const loadScreen = document.getElementById('load');
  const loader = document.getElementById('loader');
  const passScreen = document.getElementById('pass');
  const mainApp = document.getElementById('main-app');

  // 1. Black 3 detik
  black1.style.display = 'flex';
  setTimeout(() => {
    black1.style.display = 'none';

    // 2. Splashscreen 3 detik dengan fade in & fade out
    splash.style.display = 'flex';
    splash.style.opacity = '0';
    setTimeout(() => {
      splash.style.transition = 'opacity 0.8s';
      splash.style.opacity = '1';
    }, 50);

    setTimeout(() => {
      splash.style.opacity = '0';
      setTimeout(() => {
        splash.style.display = 'none';
        splash.style.transition = '';

        // 3. Black 4 detik
        black2.style.display = 'flex';
        setTimeout(() => {
          black2.style.display = 'none';

          // 4. Loadsplash (no fade)
          loadScreen.style.display = 'flex';

          // Munculkan loading setelah 5 detik
          setTimeout(() => {
            loader.style.display = 'flex';
          }, 5000);

          // Random loading time 8 / 10 / 12 detik
          const times = [8000, 10000, 12000];
          const loadTime = times[Math.floor(Math.random() * 3)];

          setTimeout(() => {
            loadScreen.style.display = 'none';
            loader.style.display = 'none';

            // 5. PASS screen
            passScreen.style.display = 'flex';

            setTimeout(() => {
              passScreen.style.display = 'none';
              mainApp.classList.remove('hidden');
              mainApp.style.display = 'flex';
              loadSavedProgress();
            }, 3000);
          }, loadTime);
        }, 4000);
      }, 1000); // fade out 1 detik
    }, 3000); // total splash 3 detik
  }, 3000);
}

// LocalStorage Progress
function loadSavedProgress() {
  let progress = localStorage.getItem('budu_progress') || 0;
  document.getElementById('progress-val').textContent = progress;
}

document.getElementById('advance-btn').addEventListener('click', () => {
  let progress = parseInt(localStorage.getItem('budu_progress') || 0) + 1;
  localStorage.setItem('budu_progress', progress);
  document.getElementById('progress-val').textContent = progress;
});