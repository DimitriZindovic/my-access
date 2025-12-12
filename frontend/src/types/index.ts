export type HandicapType = 
  | 'sensoriel' 
  | 'moteur' 
  | 'mental' 
  | 'psychique' 
  | 'cognitif';

export interface AccessibilityScore {
  physique: number; // 0-5
  numerique: number; // 0-5
  accueil: number; // 0-5
}

export interface Center {
  id: string;
  name: string;
  address: string;
  city: string;
  postalCode: string;
  latitude: number;
  longitude: number;
  phone: string;
  email: string;
  website?: string;
  hours: string;
  type: 'vaccination' | 'depistage' | 'both';
  accessibilityScore: AccessibilityScore;
  globalScore: number;
  reviews: Review[];
  services: string[];
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  centerId: string;
  date: string;
  scores: AccessibilityScore;
  comment: string;
  handicapTypes: HandicapType[];
  helpfulCount: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  handicapTypes: HandicapType[];
  createdAt: string;
}

export interface Appointment {
  id: string;
  userId: string;
  centerId: string;
  centerName: string;
  date: string;
  time: string;
  type: 'vaccination' | 'depistage';
  status: 'upcoming' | 'past' | 'cancelled';
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: 'appointment' | 'review' | 'system';
}
