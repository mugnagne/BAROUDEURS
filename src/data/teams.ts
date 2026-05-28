export interface Team {
  id: string;
  name: string;
  countryCode: string;
  rating: number; // 1 to 5
  offense: number; // 1 to 5
  defense: number; // 1 to 5
  summary: string;
}

export const teams: Team[] = [
  // Groupe A
  { id: 'mexico', name: 'Mexique', countryCode: 'mx', rating: 3.5, offense: 3.5, defense: 3, summary: "À domicile pour cette Coupe du Monde, le Mexique espère enfin briser la malédiction de ce fameux \"cinquième match\" (quarts de finale) qu'ils n'atteignent plus depuis 1986. Poussés par leur bouillant public, les Aztèques trouveront-ils la formule magique ?" },
  { id: 'south-africa', name: 'Afrique du Sud', countryCode: 'za', rating: 2, offense: 2, defense: 2, summary: "Les Bafana Bafana retrouvent la plus prestigieuse des compétitions avec l'envie de bousculer la hiérarchie. Leur fougue et leur enthousiasme suffiront-ils à compenser leurs lacunes tactiques face aux nations plus expérimentées ?" },
  { id: 'south-korea', name: 'Corée du Sud', countryCode: 'kr', rating: 3, offense: 3.5, defense: 3, summary: "Portée par une génération alliant vitesse et discipline, la Corée du Sud s'est imposée comme une véritable place forte du football asiatique. Les Guerriers Taeguk parviendront-ils à rééditer l'exploit de 2002 en s'invitant dans le dernier carré ?" },
  { id: 'czechia', name: 'Tchéquie', countryCode: 'cz', rating: 3, offense: 2.5, defense: 3, summary: "Orpheline de ses légendes passées, la Tchéquie s'appuie désormais sur un collectif rigoureux et un gros impact physique. Cette approche pragmatique et rugueuse leur permettra-t-elle de sortir des poules ?" },

  // Groupe B
  { id: 'canada', name: 'Canada', countryCode: 'ca', rating: 3, offense: 3.5, defense: 2.5, summary: "Co-hôte du tournoi, le Canada compte sur sa jeune génération dorée pour marquer l'histoire devant ses supporters. L'explosivité d'Alphonso Davies et de ses coéquipiers peut-elle créer la sensation dans leur propre pays ?" },
  { id: 'bosnia', name: 'Bosnie-et-Herzégovine', countryCode: 'ba', rating: 2.5, offense: 2.5, defense: 2.5, summary: "De retour sur la scène internationale, les Dragons veulent prouver qu'ils ont la hargne nécessaire pour rivaliser avec les meilleurs. Leur solidité dans les duels sera-t-elle la clé pour arracher une qualification inespérée ?" },
  { id: 'qatar', name: 'Qatar', countryCode: 'qa', rating: 2, offense: 2, defense: 2, summary: "Après un mondial 2022 décevant à domicile, le Qatar a soif de revanche et d'affirmation sur le continent américain. Les doubles champions d'Asie en titre parviendront-ils enfin à exister face au gratin mondial ?" },
  { id: 'switzerland', name: 'Suisse', countryCode: 'ch', rating: 3.5, offense: 3, defense: 4, summary: "Toujours très difficile à manœuvrer, la Nati a fait de la régularité sa marque de fabrique lors des grands tournois. Les Suisses franchiront-ils enfin ce cap des huitièmes de finale qui leur fait si souvent défaut ?" },

  // Groupe C
  { id: 'brazil', name: 'Brésil', countryCode: 'br', rating: 4.5, offense: 5, defense: 4, summary: "Toujours en quête d'une sixième étoile depuis 2002, la Seleção débarque avec une équipe spectaculaire et un vivier offensif inégalé. Le fameux \"Joga Bonito\" sera-t-il enfin de retour sur le toit du monde ?" },
  { id: 'morocco', name: 'Maroc', countryCode: 'ma', rating: 4, offense: 3.5, defense: 4.5, summary: "Demi-finalistes historiques en 2022, les Lions de l'Atlas ne sont plus une surprise mais une véritable puissance confirmée. Leur bloc défensif de fer et leur technique soyeuse les mèneront-ils encore plus loin ?" },
  { id: 'haiti', name: 'Haïti', countryCode: 'ht', rating: 1, offense: 1.5, defense: 1, summary: "Invité surprise de la région CONCACAF, Haïti vit un rêve éveillé en participant à la reine des compétitions. Les Grenadiers réussiront-ils l'exploit d'accrocher un point historique dans un groupe aussi relevé ?" },
  { id: 'scotland', name: 'Écosse', countryCode: 'gb-sct', rating: 2.5, offense: 2, defense: 3, summary: "Avec sa légendaire \"Tartan Army\" dans les tribunes, l'Écosse promet de mettre du cœur et un engagement total à chaque match. Ce fameux fighting spirit britannique sera-t-il récompensé par une qualification au tour suivant ?" },

  // Groupe D
  { id: 'usa', name: 'États-Unis', countryCode: 'us', rating: 3.5, offense: 3.5, defense: 3.5, summary: "En tant que pays hôte principal, les États-Unis n'ont jamais eu une équipe aussi prometteuse sur le papier. L'Oncle Sam est-il enfin prêt à s'asseoir à la table des véritables géants du football ?" },
  { id: 'paraguay', name: 'Paraguay', countryCode: 'py', rating: 2.5, offense: 2, defense: 3.5, summary: "Connue pour son agressivité et son jeu de tête, l'Albirroja veut renouer avec son glorieux passé. Les Sud-Américains parviendront-ils à frustrer les attaques adverses pour s'extirper de ce groupe homogène ?" },
  { id: 'australia', name: 'Australie', countryCode: 'au', rating: 2.5, offense: 2, defense: 3, summary: "Les Socceroos sont des habitués de la Coupe du Monde, toujours prêts à livrer un combat athlétique de tous les instants. Leur résilience et leur puissance physique feront-elles plier leurs adversaires ?" },
  { id: 'turkey', name: 'Turquie', countryCode: 'tr', rating: 3, offense: 3.5, defense: 3, summary: "Soutenue par une immense ferveur et dotée de joueurs très créatifs, la Turquie reste une équipe formidablement imprévisible. Les Turcs sauront-ils canaliser leur fougue pour enflammer le tournoi nord-américain ?" },

  // Groupe E
  { id: 'germany', name: 'Allemagne', countryCode: 'de', rating: 4.5, offense: 4.5, defense: 4, summary: "Après une décennie compliquée, la Mannschaft semble avoir retrouvé son efficacité et sa domination tactique légendaires. La machine allemande est-elle relancée pour aller chercher un cinquième sacre mondial ?" },
  { id: 'curacao', name: 'Curaçao', countryCode: 'cw', rating: 1, offense: 1, defense: 1, summary: "C'est le plus petit pays de l'histoire à disputer un Mondial, une prouesse sportive proprement hallucinante ! Les insulaires caribéens pourront-ils éviter la correction face aux cadors de leur groupe ?" },
  { id: 'ivory-coast', name: 'Côte d\'Ivoire', countryCode: 'ci', rating: 3, offense: 3.5, defense: 3, summary: "Les Éléphants reviennent sur le devant de la scène avec une génération rajeunie et beaucoup d'ambition. La vitesse de percussion et la technique des Ivoiriens feront-elles exploser les défenses adverses ?" },
  { id: 'ecuador', name: 'Équateur', countryCode: 'ec', rating: 3.5, offense: 3, defense: 3.5, summary: "Équipe redoutable en altitude et solide en déplacement, La Tri combine vivacité sud-américaine et rigueur tactique. Les Équatoriens parviendront-ils à concrétiser leur énorme potentiel face aux écuries européennes ?" },

  // Groupe F
  { id: 'netherlands', name: 'Pays-Bas', countryCode: 'nl', rating: 4, offense: 4, defense: 4.5, summary: "Les Oranje débarquent avec une charnière centrale de classe mondiale et un jeu de possession toujours aussi séduisant. Les finalistes malheureux de 2010 trouveront-ils enfin la clé pour soulever le trophée ultime ?" },
  { id: 'japan', name: 'Japon', countryCode: 'jp', rating: 3.5, offense: 3.5, defense: 3, summary: "Redoutables tacticiens et capables d'exploits face aux immenses favoris, les Samouraïs Bleus visent plus haut que jamais. Le Japon peut-il enfin briser son plafond de verre et s'inviter en quarts de finale ?" },
  { id: 'sweden', name: 'Suède', countryCode: 'se', rating: 3, offense: 3, defense: 3.5, summary: "De retour au Mondial, la Suède s'appuie sur son traditionnel bloc monolithique et une efficacité clinique sur coups de pied arrêtés. Les Scandinaves sauront-ils imposer leur robustesse pour sortir indemnes de cette poule ?" },
  { id: 'tunisia', name: 'Tunisie', countryCode: 'tn', rating: 2.5, offense: 2, defense: 3, summary: "Les Aigles de Carthage participent très régulièrement à la compétition sans jamais réussir à franchir le premier tour. Leur défense regroupée et leur cœur à l'ouvrage suffiront-ils à créer un exploit historique cette fois-ci ?" },

  // Groupe G
  { id: 'belgium', name: 'Belgique', countryCode: 'be', rating: 4, offense: 4, defense: 3.5, summary: "La fin de la génération dorée a laissé place à une nouvelle vague de talents tout aussi prometteurs pour les Diables Rouges. Déchargée de la pression de grande favorite, la Belgique sera-t-elle l'équipe frisson du tournoi ?" },
  { id: 'egypt', name: 'Égypte', countryCode: 'eg', rating: 2.5, offense: 2.5, defense: 3, summary: "Orphelins de certains de leurs cadres historiques, les Pharaons veulent prouver que l'Égypte reste un géant d'Afrique. Leur immense résilience défensive leur permettra-t-elle de piéger leurs adversaires en contre ?" },
  { id: 'iran', name: 'Iran', countryCode: 'ir', rating: 2.5, offense: 2.5, defense: 3, summary: "La Team Melli a dominé les qualifications asiatiques avec une brio et une régularité impressionnantes. Les Iraniens pourront-ils enfin traduire cette hégémonie continentale en une qualification pour les phases à élimination directe ?" },
  { id: 'new-zealand', name: 'Nouvelle-Zélande', countryCode: 'nz', rating: 1.5, offense: 1.5, defense: 2, summary: "Seuls représentants du continent océanien, les All Whites savent pertinemment que chaque match sera un combat pour leur survie. Leur courage suffira-t-il pour décrocher la toute première victoire de leur histoire au Mondial ?" },

  // Groupe H
  { id: 'spain', name: 'Espagne', countryCode: 'es', rating: 4.5, offense: 4.5, defense: 4, summary: "La Roja impressionne toujours par sa maîtrise technique insolente et sa capacité à confisquer le ballon. Ce \"tiki-taka\" modernisé et ultra-rapide propulsera-t-il les Espagnols vers une nouvelle finale mondiale ?" },
  { id: 'cape-verde', name: 'Cap-Vert', countryCode: 'cv', rating: 1.5, offense: 2, defense: 1.5, summary: "Première participation absolument historique pour les Requins Bleus qui ont émerveillé l'Afrique durant les éliminatoires. Cette petite nation insulaire a-t-elle les moyens techniques de bousculer ce groupe très dense ?" },
  { id: 'saudi-arabia', name: 'Arabie Saoudite', countryCode: 'sa', rating: 2.5, offense: 2.5, defense: 2.5, summary: "Après leur victoire retentissante contre l'Argentine en 2022, les Faucons Verts savent parfaitement comment choquer la planète. Les investissements colossaux dans leur championnat local se traduiront-ils par une vraie solidité internationale ?" },
  { id: 'uruguay', name: 'Uruguay', countryCode: 'uy', rating: 4, offense: 4, defense: 4, summary: "La Celeste mêle comme toujours la fameuse \"garra charrúa\" (la grinta) à des attaquants de classe mondiale. Les redoutables et rugueux doubles champions du monde parviendront-ils à renverser les géants européens ?" },

  // Groupe I
  { id: 'france', name: 'France', countryCode: 'fr', rating: 5, offense: 5, defense: 4, summary: "Après une élimination en finale de la dernière coupe du monde, la France revient avec de grandes ambitions ! La sélection ultra-offensive de Deschamps suffira-t-elle à remporter le mondial ?" },
  { id: 'senegal', name: 'Sénégal', countryCode: 'sn', rating: 3.5, offense: 3.5, defense: 3.5, summary: "Les Lions de la Teranga restent l'équipe africaine la plus dense et la plus constante de ces dernières années. Leur colonne vertébrale qui brille en Europe les propulsera-t-elle vers un exploit que tout un continent attend ?" },
  { id: 'iraq', name: 'Irak', countryCode: 'iq', rating: 1.5, offense: 1.5, defense: 2, summary: "Les Lions de Mésopotamie font un retour extrêmement attendu et teinté d'émotion sur la plus belle des scènes. Leur patriotisme farouche et leur ferveur combleront-ils leur cruel manque de rythme au plus haut niveau ?" },
  { id: 'norway', name: 'Norvège', countryCode: 'no', rating: 3.5, offense: 4.5, defense: 2.5, summary: "Emmenée par un duo de stars planétaires aux avant-postes, la Norvège retrouve enfin le doux parfum d'un Mondial. Cette puissance de feu hallucinante suffira-t-elle à masquer leurs inquiétantes lacunes défensives ?" },

  // Groupe J
  { id: 'argentina', name: 'Argentine', countryCode: 'ar', rating: 5, offense: 5, defense: 4.5, summary: "Les champions du monde en titre viennent défendre leur couronne avec la confiance inébranlable de ceux qui ont déjà conquis les sommets. L'Albiceleste, portée par l'amour de son maillot, réalisera-t-elle un doublé historique ?" },
  { id: 'algeria', name: 'Algérie', countryCode: 'dz', rating: 3, offense: 3.5, defense: 3, summary: "Après le immense traumatisme de leur non-qualification en 2022, les Fennecs sont de retour, infiniment revanchards. La magie technique et l'orgueil algérien suffiront-ils pour briller de nouveau à l'international ?" },
  { id: 'austria', name: 'Autriche', countryCode: 'at', rating: 3.5, offense: 3.5, defense: 3.5, summary: "Solides, structurés et intenses, les Autrichiens pratiquent un pressing étouffant inspiré de la pure philosophie germanique. Cette grosse débauche d'énergie tactique leur permettra-t-elle de piéger les grands favoris ?" },
  { id: 'jordan', name: 'Jordanie', countryCode: 'jo', rating: 1.5, offense: 1.5, defense: 1.5, summary: "Les Nashama découvrent la compétition reine pour la toute première fois de leur modeste histoire. L'insouciance et l'enthousiasme de la découverte suffiront-ils à faire douter des adversaires bien plus aguerris ?" },

  // Groupe K
  { id: 'portugal', name: 'Portugal', countryCode: 'pt', rating: 4.5, offense: 4.5, defense: 4, summary: "Toujours dotée d'un vivier de talents créatifs exceptionnel, la Seleção das Quinas reste un candidat excessivement dangereux. Le génie individuel de ses innombrables stars suffira-t-il pour enfin ramener le trophée à Lisbonne ?" },
  { id: 'dr-congo', name: 'RD Congo', countryCode: 'cd', rating: 2.5, offense: 3, defense: 2, summary: "Les Léopards font leur grand retour sur la scène mondiale et comptent bien montrer les crocs. Leur vitesse en transition et leur impact athlétique feront-ils des ravages inattendus au sein de ce groupe très ouvert ?" },
  { id: 'uzbekistan', name: 'Ouzbékistan', countryCode: 'uz', rating: 2, offense: 2, defense: 2, summary: "Récompense ultime pour le football ouzbek qui participe à son tout premier Mondial après des années d'efforts. La rigueur tactique asiatique des Loups Blancs leur offrira-t-elle l'immense joie d'une victoire historique ?" },
  { id: 'colombia', name: 'Colombie', countryCode: 'co', rating: 3.5, offense: 3.5, defense: 3.5, summary: "Absents douloureusement au Qatar, les Cafeteros reviennent animés par la passion incandescente de tout un peuple. L'élégance de leur jeu de passes et la folie de leurs ailiers seront-elles la clé d'un parcours mémorable ?" },

  // Groupe L
  { id: 'england', name: 'Angleterre', countryCode: 'gb-eng', rating: 4.5, offense: 4.5, defense: 4, summary: "Les Three Lions courent désespérément après un titre majeur depuis 1966 avec un effectif digne d'un All-Star Game. La terrible pression médiatique du résultat finira-t-elle par transcender ou écraser cette génération dorée ?" },
  { id: 'croatia', name: 'Croatie', countryCode: 'hr', rating: 3.5, offense: 3.5, defense: 3.5, summary: "Toujours merveilleuse dans les grands rendez-vous, l'équipe au damier a fait de l'entrejeu son royaume absolu. Les inépuisables Croates trouveront-ils un énième second souffle pour réitérer leurs exploits de 2018 et 2022 ?" },
  { id: 'ghana', name: 'Ghana', countryCode: 'gh', rating: 2.5, offense: 3, defense: 2.5, summary: "Les Black Stars ont l'habitude de porter les espoirs de l'Afrique avec un football rythmé, direct et très physique. Leur fougue légendaire et leur sens du sacrifice feront-ils vaciller les cadors du groupe L ?" },
  { id: 'panama', name: 'Panama', countryCode: 'pa', rating: 1.5, offense: 1.5, defense: 1.5, summary: "Pour sa deuxième participation à un Mondial, la \"Marée Rouge\" espère bien ouvrir son compteur de victoires. Les Canaleros, avec leurs moyens limités, sauront-ils résister à la puissance de feu de leurs redoutables adversaires européens ?" },
];
