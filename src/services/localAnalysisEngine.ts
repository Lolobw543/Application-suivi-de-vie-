import type { MoodType } from '../types';


export interface AnalysisResult {
  summary: string;
  activities: string[];
  learnings?: string;
  detectedMood: MoodType;
  tags: string[];
  directionAlignment: string;
  isMock: boolean;
  confidenceScore: number;
}

interface KeywordRule {
  keywords: string[];
  tag: string;
  activityName: string;
  theme: 'creation' | 'learning' | 'health' | 'home' | 'work' | 'rest';
}

const RULES: KeywordRule[] = [
  {
    keywords: ['davinci', 'resolve', 'montage', 'video', 'vidéo', 'dessin', 'design', 'dessiner', 'peindre', 'écrire', 'écriture', 'musique', 'créer', 'création', 'portfolio', 'figma'],
    tag: 'Créativité',
    activityName: 'Pratique créative & audiovisuelle',
    theme: 'creation',
  },
  {
    keywords: ['appris', 'apprendre', 'cours', 'tuto', 'tutoriel', 'formation', 'livre', 'lire', 'lecture', 'étudier', 'compris', 'découvert', 'podcast'],
    tag: 'Apprentissage',
    activityName: 'Acquisition de compétences',
    theme: 'learning',
  },
  {
    keywords: ['tondu', 'pelouse', 'jardin', 'ménage', 'ranger', 'rangé', 'nettoyé', 'bricoler', 'bricolage', 'cuisine', 'cuisiné', 'maison', 'courses'],
    tag: 'Maison',
    activityName: 'Entretien du foyer & environnement',
    theme: 'home',
  },
  {
    keywords: ['sport', 'course', 'courir', 'marcher', 'marche', 'vélo', 'musculation', 'fitness', 'yoga', 'natation', 'cardio', 'étirements'],
    tag: 'Sport & Santé',
    activityName: 'Activité physique & oxygénation',
    theme: 'health',
  },
  {
    keywords: ['travail', 'bureau', 'réunion', 'client', 'projet', 'équipe', 'code', 'dev', 'programmation', 'bug', 'chantier', 'dossier', 'urgent', 'collègues'],
    tag: 'Travail',
    activityName: 'Avancement professionnel & projets',
    theme: 'work',
  },
  {
    keywords: ['repos', 'sieste', 'dormir', 'détente', 'film', 'série', 'promenade', 'calme', 'méditation', 'famille', 'amis', 'apéro', 'resto'],
    tag: 'Repos & Bien-être',
    activityName: 'Ressourcement & équilibre',
    theme: 'rest',
  },
];

export async function analyzeJournalVoiceText(
  rawTranscript: string,
  userDirection: string = 'Construire une vie plus créative'
): Promise<AnalysisResult> {
  // Simulate natural cognitive processing delay (1.2 to 1.8 seconds)
  await new Promise((resolve) => setTimeout(resolve, 1400));

  const text = (rawTranscript || '').trim();
  const lowerText = text.toLowerCase();

  // If text is empty or very brief
  if (!text || text.length < 5) {
    return {
      summary: "Tu as pris un moment pour faire une pause et te recentrer sur l'essentiel ce soir.",
      activities: ['Moment pour soi', 'Bilan de soirée'],
      learnings: 'Prendre le temps d’observer sa journée sans pression.',
      detectedMood: 'serene',
      tags: ['Repos', 'Équilibre'],
      directionAlignment: "Chaque pause consciente t'aide à garder un esprit clair pour tes projets.",
      isMock: true,
      confidenceScore: 0.9,
    };
  }

  // Detect matches
  const matchedTags = new Set<string>();
  const matchedActivities = new Set<string>();
  const matchedThemes = new Set<string>();

  for (const rule of RULES) {
    const hasMatch = rule.keywords.some((kw) => lowerText.includes(kw));
    if (hasMatch) {
      matchedTags.add(rule.tag);
      matchedActivities.add(rule.activityName);
      matchedThemes.add(rule.theme);
    }
  }

  // Specific rule for DaVinci Resolve or specific tools mentioned by user prompt example
  if (lowerText.includes('davinci') || lowerText.includes('resolve')) {
    matchedTags.add('Apprentissage');
    matchedTags.add('Créativité');
    matchedActivities.add('Formation DaVinci Resolve');
  }

  if (lowerText.includes('pelouse') || lowerText.includes('tondu')) {
    matchedTags.add('Maison');
    matchedActivities.add('Entretien extérieur & jardin');
  }

  // Defaults if no specific tags caught
  if (matchedTags.size === 0) {
    matchedTags.add('Quotidien');
    matchedTags.add('Équilibre');
    matchedActivities.add('Activités de la journée');
  }

  const tagsList = Array.from(matchedTags).slice(0, 4);
  const activitiesList = Array.from(matchedActivities).slice(0, 3);

  // Determine mood based on sentiment signals
  let detectedMood: MoodType = 'serene';
  if (lowerText.includes('super') || lowerText.includes('génial') || lowerText.includes('fier') || lowerText.includes('content') || lowerText.includes('top')) {
    detectedMood = 'radiant';
  } else if (lowerText.includes('fatigué') || lowerText.includes('épuisé') || lowerText.includes('dur') || lowerText.includes('long')) {
    detectedMood = 'tired';
  } else if (lowerText.includes('avancé') || lowerText.includes('terminé') || lowerText.includes('efficace') || lowerText.includes('production') || lowerText.includes('fini')) {
    detectedMood = 'productive';
  } else if (lowerText.includes('réfléchi') || lowerText.includes('doute') || lowerText.includes('question') || lowerText.includes('idée')) {
    detectedMood = 'thoughtful';
  } else if (matchedThemes.has('creation') || matchedThemes.has('learning')) {
    detectedMood = 'productive';
  }

  // Build high quality French synthesis summary
  let summary = '';

  // Check specific example matches from prompt: "J'ai tondu la pelouse, regardé une vidéo et appris DaVinci Resolve"
  if (lowerText.includes('tondu') && (lowerText.includes('davinci') || lowerText.includes('resolve') || lowerText.includes('vidéo') || lowerText.includes('video'))) {
    summary = "Tu as pris soin de ton environnement et consacré du temps de qualité à l'apprentissage de DaVinci Resolve. Une belle alliance entre action pratique et développement de tes compétences créatives.";
  } else {
    // Generative cohesive phrasing
    const parts: string[] = [];

    if (matchedThemes.has('home')) {
      parts.push("pris soin de ton environnement quotidien");
    }
    if (matchedThemes.has('work')) {
      parts.push("fait progresser tes engagements et projets professionnels");
    }
    if (matchedThemes.has('learning') || lowerText.includes('appris')) {
      parts.push("consacré du temps à l'acquisition de nouvelles connaissances");
    }
    if (matchedThemes.has('creation')) {
      parts.push("nourri ta curiosité créative");
    }
    if (matchedThemes.has('health')) {
      parts.push("maintenu ton corps en mouvement avec une saine dépense physique");
    }
    if (matchedThemes.has('rest')) {
      parts.push("accordé de précieux instants de repos");
    }

    if (parts.length >= 2) {
      summary = `Aujourd'hui, tu as ${parts[0]} et ${parts[1]}. Tu as su équilibrer tes efforts pour ancrer une journée riche et constructive.`;
    } else if (parts.length === 1) {
      summary = `Tu as ${parts[0]}. Ce travail régulier consolide ta dynamique et te rapproche de tes aspirations.`;
    } else {
      summary = `Une journée rythmée par tes initiatives personnelles. Tu as su être présent aux événements tout en préservant ton élan.`;
    }
  }

  // Build learning note
  let learnings: string | undefined = undefined;
  if (lowerText.includes('davinci') || lowerText.includes('resolve')) {
    learnings = "Découverte des bases et des outils de montage sur DaVinci Resolve.";
  } else if (matchedThemes.has('learning')) {
    learnings = "Intégration d'un nouveau savoir-faire applicable dans tes prochains projets.";
  } else if (matchedThemes.has('creation')) {
    learnings = "Précision du geste et renforcement de ton intuition créative.";
  }

  // Build alignment sentence with user goal
  let directionAlignment = '';
  if (matchedThemes.has('creation') || lowerText.includes('davinci') || lowerText.includes('resolve')) {
    directionAlignment = "Ton apprentissage créatif avance dans la bonne direction. Chaque minute investie consolide ton cap.";
  } else if (matchedThemes.has('health') || matchedThemes.has('rest')) {
    directionAlignment = "Prendre soin de ton énergie est la clé pour maintenir un élan créatif durable.";
  } else if (matchedThemes.has('home') || matchedThemes.has('work')) {
    directionAlignment = "Clarifier ton cadre et tes projets te libère de l'espace mental pour ton cap de vie.";
  } else {
    directionAlignment = `Cette régularité dans ton récit quotidien construit concrètement ton cap : « ${userDirection} ».`;
  }

  return {
    summary,
    activities: activitiesList,
    learnings,
    detectedMood,
    tags: tagsList,
    directionAlignment,
    isMock: true,
    confidenceScore: 0.96,
  };
}
