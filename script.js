// ========== FIREBASE ==========
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDmkebSeIVkeGIVQZ94jQ2TMK55bxpqP4Q",
  authDomain: "crisma-zimpeto.firebaseapp.com",
  projectId: "crisma-zimpeto",
  storageBucket: "crisma-zimpeto.firebasestorage.app",
  messagingSenderId: "550733895647",
  appId: "1:550733895647:web:a80524898241405d27166a",
  measurementId: "G-RYFQY33TL1"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Apenas a colecção de presenças (mensagens removidas)
const attendeesCol = collection(db, "attendees");

// ========== CONFIRMAÇÃO DE PRESENÇA ==========
const btnConfirmar   = document.getElementById('btnConfirmar');
const attendeeName   = document.getElementById('attendeeName');
const attendeeCount  = document.getElementById('attendeeCount');
const rsvpFeedback   = document.getElementById('rsvpFeedback');

// Contador em tempo real
onSnapshot(attendeesCol, (snapshot) => {
  if (attendeeCount) attendeeCount.textContent = snapshot.size;
}, (error) => {
  console.error('Erro ao contar presenças:', error);
});

// Guardar confirmação
if (btnConfirmar) {
  btnConfirmar.addEventListener('click', async () => {
    const name = attendeeName.value.trim();
    if (!name) {
      alert('Por favor, escreva o seu nome antes de confirmar.');
      attendeeName.focus();
      return;
    }

    btnConfirmar.disabled = true;
    const original = btnConfirmar.innerHTML;
    btnConfirmar.innerHTML = 'A confirmar...';

    try {
      await addDoc(attendeesCol, {
        name: name,
        timestamp: serverTimestamp()
      });
      attendeeName.value = '';
      if (rsvpFeedback) {
        rsvpFeedback.textContent = '✅ Presença confirmada! Obrigado.';
        rsvpFeedback.style.color = '#C9A227';
      }
    } catch (e) {
      console.error('Erro ao confirmar:', e);
      alert('Não foi possível confirmar. Tente novamente.');
    } finally {
      btnConfirmar.disabled = false;
      btnConfirmar.innerHTML = original;
    }
  });
}

// ========== VÍDEO: garantir play (opcional) ==========
const video = document.querySelector('.video-frame video');
if (video) {
  video.addEventListener('play', () => console.log('Vídeo a tocar'));
}