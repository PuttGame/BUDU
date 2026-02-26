let deferredPrompt = null;

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js', { scope: '/' })
    .then(reg => {
      console.log('[App] Service Worker registered, scope:', reg.scope);
    })
    .catch(err => console.error('[App] SW registration failed:', err));
}

window.addEventListener('beforeinstallprompt', (e) => {
  console.log('[App] beforeinstallprompt EVENT FIRED!');
  e.preventDefault();
  deferredPrompt = e;
  // Tampilkan info kalau perlu
  document.getElementById('install-info').textContent = 'Prompt siap! Klik Install sekarang';
});

window.addEventListener('appinstalled', () => {
  console.log('[App] App successfully installed!');
  alert('BUDU berhasil diinstall! Buka dari home screen ya bro.');
});

document.addEventListener('DOMContentLoaded', () => {
  const preview = document.getElementById('preview-mode');
  const appMode = document.getElementById('app-mode');
  const isStandalone = 
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone ||
    window.location.search.includes('standalone');

  if (isStandalone) {
    console.log('[App] Standalone mode detected');
    preview.style.display = 'none';
    appMode.classList.remove('hidden');
    startBootSequence();
  } else {
    console.log('[App] Browser mode');
    appMode.classList.add('hidden');
    preview.style.display = 'flex';
  }

  document.getElementById('install-btn').addEventListener('click', async () => {
    if (deferredPrompt) {
      console.log('[App] Triggering native install prompt');
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log('[App] Install outcome:', outcome);
      deferredPrompt = null;
    } else {
      console.log('[App] No deferredPrompt, showing manual fallback');
      alert('Prompt native tidak muncul otomatis.\n\nCara install manual:\n1. Ketuk ikon ⋮ di kanan atas Chrome\n2. Pilih "Install app" atau "Tambahkan ke layar utama"\n\nSudah coba clear cache & refresh?');
    }
  });

  document.getElementById('cancel-btn').addEventListener('click', () => {
    // do nothing
  });
});

// Fungsi boot sequence (sama seperti sebelumnya)
function startBootSequence() {
  if (screen.orientation?.lock) {
    screen.orientation.lock('landscape').catch(() => {});
  }
  document.documentElement.requestFullscreen?.({ navigationUI: 'hide' }).catch(() => {});

  const black1 = document.getElementById('black1');
  const splash = document.getElementById('splash');
  const black2 = document.getElementById('black2');
  const load = document.getElementById('load');
  const loader = document.getElementById('loader');
  const pass = document.getElementById('pass');
  const main = document.getElementById('main-app');

  black1.style.display = 'flex';
  setTimeout(() => {
    black1.style.display = 'none';
    splash.style.display = 'flex';
    splash.style.opacity = '0';
    setTimeout(() => { splash.style.transition = 'opacity 0.8s'; splash.style.opacity = '1'; }, 100);
    setTimeout(() => {
      splash.style.opacity = '0';
      setTimeout(() => {
        splash.style.display = 'none';
        black2.style.display = 'flex';
        setTimeout(() => {
          black2.style.display = 'none';
          load.style.display = 'flex';
          setTimeout(() => { loader.style.display = 'flex'; }, 5000);
          const randTime = [8000, 10000, 12000][Math.floor(Math.random() * 3)];
          setTimeout(() => {
            load.style.display = 'none';
            loader.style.display = 'none';
            pass.style.display = 'flex';
            setTimeout(() => {
              pass.style.display = 'none';
              main.classList.remove('hidden');
              main.style.display = 'flex';
              loadProgress();
            }, 3000);
          }, randTime);
        }, 4000);
      }, 800);
    }, 3000);
  }, 3000);
}

function loadProgress() {
  const val = localStorage.getItem('budu_progress') || '0';
  document.getElementById('progress-val').textContent = val;
}

document.getElementById('advance-btn')?.addEventListener('click', () => {
  let p = parseInt(localStorage.getItem('budu_progress') || '0') + 1;
  localStorage.setItem('budu_progress', p);
  document.getElementById('progress-val').textContent = p;
});