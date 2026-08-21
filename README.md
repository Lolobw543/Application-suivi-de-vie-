# Fil — Application PWA de Suivi de Vie & Journal Vocal

**Fil** est une application web progressive (PWA) mobile conçue pour le suivi de vie quotidien et le bilan du soir à 21h. Elle permet à l'utilisateur de raconter oralement sa journée, visualise en temps réel le volume du micro, transcrit la parole et génère une analyse locale intelligente (démonstration sans clé API) pour ancrer ses réussites et rester aligné avec son cap personnel.

---

## ✨ Fonctionnalités Principales

- **📱 Design Mobile Premium & Épuré (Inspiré iOS)** :
  - Palette pastel douce : vert pastel, rose poudré et bleu ciel.
  - Cartes blanches aux angles ultra-arrondis (`rounded-[32px]`) et ombres diffuses.
  - Barre de navigation inférieure flottante en verre dépoli (capsule 3 onglets) avec bouton micro circulaire séparé.

- **🎙️ Parcours Vocal & Visualiseur Audio** :
  - Animation dynamique de barres verticales réagissant en temps réel au volume du microphone (Web Audio API).
  - Transcription vocale continue en direct en français (Web Speech API).
  - Exemples de dictée rapide et saisie manuelle de secours.

- **🧠 Analyse Locale de Démonstration** :
  - Moteur NLP déterministe (sans dépendance externe ni clé API).
  - Synthèse en 2-3 phrases, détection d'activités, d'apprentissages clés, de tags et de la résonance avec le cap de vie.
  - Carte de validation modale avec sélecteur de ressenti parmi 5 émotions et édition du récit.

- **📖 3 Vues Clés** :
  - **Accueil** : Date du jour, déclencheurs rapides micro et rappel, barre de progression segmentée de 24 pastilles et citation d'analyse.
  - **Journal** : Filtres par tags, historique complet avec humeur, tags, résumé et transcription brute dépliable.
  - **Direction** : Cap de vie modifiable, 3 piliers d'équilibre avec ajustement direct (+/-) et activation du rappel de 21h avec notifications natives du navigateur.

- **⚡ PWA & Mode Hors-Ligne** :
  - Installable sur iPhone (Safari > Partager > Sur l'écran d'accueil) et Android.
  - Service Worker de cache et gestion des notifications push.
  - Sauvegarde locale persistante dans `localStorage`.

---

## 🛠️ Stack Technique

- **Framework** : React 19 + TypeScript + Vite 8
- **Styles** : Tailwind CSS 4 + Glassmorphism & backdrop-blur
- **Icônes** : Lucide React
- **Audio & Voix** : Web Audio API (`AudioContext`, `AnalyserNode`) + Web Speech API
- **Animations & Effets** : Canvas-Confetti, CSS Keyframe Transitions

---

## 🚀 Installation & Lancement

```bash
# 1. Cloner le dépôt
git clone https://github.com/Lolobw543/Application-suivi-de-vie-.git
cd "Application-suivi-de-vie-"

# 2. Installer les dépendances
npm install

# 3. Lancer le serveur de développement
npm run dev

# 4. Compiler pour la production
npm run build
```

---

## 📱 Utilisation sur iPhone

1. Ouvrez l'application dans Safari.
2. Appuyez sur le bouton **Partager** (⎋).
3. Sélectionnez **« Sur l'écran d'accueil »**.
4. Lancez l'application en mode plein écran et autorisez les notifications pour le rappel de 21h00.
