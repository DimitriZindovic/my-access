import { Center, Review, User, Appointment, Notification } from '../types';

export const mockCenters: Center[] = [
  {
    id: '1',
    name: 'Centre Médical Accessibilité Plus Paris 15',
    address: '12 Rue de Vaugirard',
    city: 'Paris',
    postalCode: '75015',
    latitude: 48.8426,
    longitude: 2.3159,
    phone: '01 45 67 89 01',
    email: 'contact@accessibilite-plus.fr',
    website: 'https://accessibilite-plus.fr',
    hours: 'Lun-Ven: 8h-19h, Sam: 9h-17h',
    type: 'both',
    accessibilityScore: {
      physique: 5,
      numerique: 4,
      accueil: 5
    },
    globalScore: 4.7,
    services: ['Parking PMR', 'Rampe d\'accès', 'Ascenseur', 'Personnel LSF', 'Site accessible'],
    reviews: []
  },
  {
    id: '2',
    name: 'Centre de Dépistage République',
    address: '45 Boulevard Voltaire',
    city: 'Paris',
    postalCode: '75011',
    latitude: 48.8634,
    longitude: 2.3774,
    phone: '01 43 55 67 89',
    email: 'info@depistage-republique.fr',
    hours: 'Lun-Sam: 9h-18h',
    type: 'depistage',
    accessibilityScore: {
      physique: 4,
      numerique: 5,
      accueil: 4
    },
    globalScore: 4.3,
    services: ['Rampe d\'accès', 'Toilettes PMR', 'Site accessible', 'Prise RDV en ligne'],
    reviews: []
  },
  {
    id: '3',
    name: 'Centre de Vaccination Bastille',
    address: '78 Rue du Faubourg Saint-Antoine',
    city: 'Paris',
    postalCode: '75012',
    latitude: 48.8531,
    longitude: 2.3741,
    phone: '01 44 73 22 11',
    email: 'vaccination@bastille-sante.fr',
    hours: 'Lun-Dim: 8h-20h',
    type: 'vaccination',
    accessibilityScore: {
      physique: 3,
      numerique: 3,
      accueil: 4
    },
    globalScore: 3.3,
    services: ['Parking à proximité', 'Personnel formé'],
    reviews: []
  },
  {
    id: '4',
    name: 'Hôpital Saint-Louis - Centre COVID',
    address: '1 Avenue Claude Vellefaux',
    city: 'Paris',
    postalCode: '75010',
    latitude: 48.8720,
    longitude: 2.3698,
    phone: '01 42 49 49 49',
    email: 'covid@hopital-stlouis.fr',
    hours: '24h/24, 7j/7',
    type: 'both',
    accessibilityScore: {
      physique: 5,
      numerique: 4,
      accueil: 5
    },
    globalScore: 4.7,
    services: ['Parking PMR', 'Ascenseur', 'Toilettes PMR', 'Personnel LSF', 'Accueil adapté'],
    reviews: []
  },
  {
    id: '5',
    name: 'Centre Médical Nation',
    address: '234 Rue de Charenton',
    city: 'Paris',
    postalCode: '75012',
    latitude: 48.8443,
    longitude: 2.3964,
    phone: '01 43 07 15 20',
    email: 'contact@centre-nation.fr',
    hours: 'Lun-Ven: 8h30-18h30',
    type: 'vaccination',
    accessibilityScore: {
      physique: 4,
      numerique: 5,
      accueil: 4
    },
    globalScore: 4.3,
    services: ['Rampe d\'accès', 'Prise RDV en ligne', 'Site accessible'],
    reviews: []
  },
  {
    id: '6',
    name: 'Centre de Santé Montparnasse',
    address: '56 Boulevard du Montparnasse',
    city: 'Paris',
    postalCode: '75014',
    latitude: 48.8430,
    longitude: 2.3267,
    phone: '01 43 20 14 20',
    email: 'accueil@montparnasse-sante.fr',
    hours: 'Lun-Sam: 9h-19h',
    type: 'both',
    accessibilityScore: {
      physique: 5,
      numerique: 5,
      accueil: 5
    },
    globalScore: 5.0,
    services: ['Parking PMR', 'Rampe', 'Ascenseur', 'Toilettes PMR', 'Personnel LSF', 'Site accessible', 'Audio-description'],
    reviews: []
  }
];

export const mockReviews: Review[] = [
  {
    id: 'r1',
    userId: 'u1',
    userName: 'Marie D.',
    centerId: '1',
    date: '2024-10-15',
    scores: {
      physique: 5,
      numerique: 4,
      accueil: 5
    },
    comment: 'Excellent accueil, personnel très attentif. Rampe d\'accès bien conçue et parking PMR disponible.',
    handicapTypes: ['moteur'],
    helpfulCount: 12
  },
  {
    id: 'r2',
    userId: 'u2',
    userName: 'Jean-Paul M.',
    centerId: '1',
    date: '2024-10-20',
    scores: {
      physique: 5,
      numerique: 4,
      accueil: 5
    },
    comment: 'Personnel formé à la LSF, vraiment apprécié. Signalétique claire.',
    handicapTypes: ['sensoriel'],
    helpfulCount: 8
  }
];

// Add reviews to centers
mockCenters[0].reviews = mockReviews.filter(r => r.centerId === '1');

const isClient = typeof window !== 'undefined';

export const getCurrentUser = (): User | null => {
  if (!isClient) return null;
  const userStr = localStorage.getItem('currentUser');
  return userStr ? JSON.parse(userStr) : null;
};

export const setCurrentUser = (user: User | null) => {
  if (!isClient) return;
  if (user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
  } else {
    localStorage.removeItem('currentUser');
  }
};

export const getAppointments = (userId: string): Appointment[] => {
  if (!isClient) return [];
  const appointmentsStr = localStorage.getItem('appointments');
  const allAppointments: Appointment[] = appointmentsStr ? JSON.parse(appointmentsStr) : [];
  return allAppointments.filter(apt => apt.userId === userId);
};

export const addAppointment = (appointment: Appointment) => {
  if (!isClient) return;
  const appointmentsStr = localStorage.getItem('appointments');
  const allAppointments: Appointment[] = appointmentsStr ? JSON.parse(appointmentsStr) : [];
  allAppointments.push(appointment);
  localStorage.setItem('appointments', JSON.stringify(allAppointments));
};

export const getNotifications = (userId: string): Notification[] => {
  if (!isClient) return [];
  const notificationsStr = localStorage.getItem('notifications');
  const allNotifications: Notification[] = notificationsStr ? JSON.parse(notificationsStr) : [];
  return allNotifications.filter(notif => notif.userId === userId);
};

export const addNotification = (notification: Notification) => {
  if (!isClient) return;
  const notificationsStr = localStorage.getItem('notifications');
  const allNotifications: Notification[] = notificationsStr ? JSON.parse(notificationsStr) : [];
  allNotifications.push(notification);
  localStorage.setItem('notifications', JSON.stringify(allNotifications));
};

export const markNotificationAsRead = (notificationId: string) => {
  if (!isClient) return;
  const notificationsStr = localStorage.getItem('notifications');
  const allNotifications: Notification[] = notificationsStr ? JSON.parse(notificationsStr) : [];
  const updated = allNotifications.map(n => 
    n.id === notificationId ? { ...n, read: true } : n
  );
  localStorage.setItem('notifications', JSON.stringify(updated));
};

export const getUserReviews = (userId: string): Review[] => {
  if (!isClient) return [];
  const reviewsStr = localStorage.getItem('reviews');
  const allReviews: Review[] = reviewsStr ? JSON.parse(reviewsStr) : mockReviews;
  return allReviews.filter(r => r.userId === userId);
};

export const addReview = (review: Review) => {
  if (!isClient) return;
  const reviewsStr = localStorage.getItem('reviews');
  const allReviews: Review[] = reviewsStr ? JSON.parse(reviewsStr) : [...mockReviews];
  allReviews.push(review);
  localStorage.setItem('reviews', JSON.stringify(allReviews));
};

export const getCenters = (): Center[] => {
  if (!isClient) return mockCenters;
  const centersStr = localStorage.getItem('centers');
  if (centersStr) {
    return JSON.parse(centersStr);
  }
  localStorage.setItem('centers', JSON.stringify(mockCenters));
  return mockCenters;
};

export const getCenter = (id: string): Center | undefined => {
  const centers = getCenters();
  return centers.find(c => c.id === id);
};

export const updateCenterWithReview = (centerId: string, review: Review) => {
  if (!isClient) return;
  const centers = getCenters();
  const centerIndex = centers.findIndex(c => c.id === centerId);
  
  if (centerIndex !== -1) {
    centers[centerIndex].reviews.push(review);
    
    const allReviews = centers[centerIndex].reviews;
    if (allReviews.length > 0) {
      const avgPhysique = allReviews.reduce((sum, r) => sum + r.scores.physique, 0) / allReviews.length;
      const avgNumerique = allReviews.reduce((sum, r) => sum + r.scores.numerique, 0) / allReviews.length;
      const avgAccueil = allReviews.reduce((sum, r) => sum + r.scores.accueil, 0) / allReviews.length;
      
      centers[centerIndex].accessibilityScore = {
        physique: Math.round(avgPhysique * 10) / 10,
        numerique: Math.round(avgNumerique * 10) / 10,
        accueil: Math.round(avgAccueil * 10) / 10
      };
      
      centers[centerIndex].globalScore = Math.round(((avgPhysique + avgNumerique + avgAccueil) / 3) * 10) / 10;
    }
    
    localStorage.setItem('centers', JSON.stringify(centers));
  }
};
