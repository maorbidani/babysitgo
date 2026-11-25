export type TabId = 'home' | 'search' | 'chat' | 'bookings' | 'profile';

export type SitterRank = 'Bronze' | 'Silver' | 'Gold' | 'Star';

export type PaymentMethod = 'credit' | 'bit' | 'paybox';

export type BookingStatus = 'pending_checkin' | 'in_progress' | 'completed' | 'cancelled';

export interface SitterReview {
  id: string;
  parentName: string;
  dateLabel: string;
  rating: number;
  tags: string[];
  comment: string;
}

export interface Sitter {
  id: string;
  firstName: string;
  lastInitial: string;
  age: number;
  verifiedAge: boolean;
  verifiedIdentity: boolean;
  verifiedSocial: boolean;
  photo: string;
  reliability: number;
  rank: SitterRank;
  medals: string[];
  hourlyRate: number;
  distanceKm: number;
  neighborhood: string;
  city: string;
  mapCoords: { x: number; y: number };
  availableTonight: boolean;
  availabilityLabel: string;
  rating: number;
  completedJobs: number;
  neighborhoodBookingsCount: number;
  responseMinutes: number;
  experienceYears: number;
  languages: string[];
  skills: string[];
  bio: string;
  videoDurationSec: number;
  videoTranscript: string;
  reviews: SitterReview[];
  smartScore: number;
}

export interface Booking {
  id: string;
  sitterId: string;
  date: string;
  dateLabel: string;
  startTime: string;
  endTime: string;
  hours: number;
  baseRate: number;
  eveningExtra: number;
  weekendExtra: number;
  shortNoticeExtra: number;
  serviceFee: number;
  tip: number;
  totalEstimated: number;
  paymentMethod: PaymentMethod;
  status: BookingStatus;
  generalAddress: string;
  fullAddress: string;
  notes?: string;
  checkInAt?: string;
  elapsedMinutes: number;
  extensionRequested?: boolean;
  reviewSubmitted?: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'parent' | 'sitter' | 'system';
  text: string;
  timestamp: string;
  type?: 'text' | 'voice' | 'video_invite';
  durationLabel?: string;
}

export interface ChatThread {
  sitterId: string;
  online: boolean;
  unreadCount: number;
  messages: ChatMessage[];
}

export interface ParentRequest {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  maxRate: number;
  childrenCount: number;
  childAges: string[];
  hasPets: boolean;
  skills: string[];
  notes: string;
  createdAt: string;
}

export interface ParentProfile {
  firstName: string;
  lastName: string;
  city: string;
  neighborhood: string;
  fullAddress: string;
  children: { id: string; name: string; ageLabel: string }[];
  pets: string;
  requirements: string[];
  shareLocationDuringJob: boolean;
  notificationsEnabled: boolean;
}

export type AppRole = 'parent' | 'sitter' | 'admin';

export type SitterTabId =
  | 'sitter_home'
  | 'sitter_jobs'
  | 'sitter_chat'
  | 'sitter_wallet'
  | 'sitter_ranks';

export type JobOfferStatus = 'pending' | 'accepted' | 'declined';

export interface JobOffer {
  id: string;
  parentName: string;
  city: string;
  neighborhood: string;
  fullAddress: string;
  distanceKm: number;
  dateLabel: string;
  startTime: string;
  endTime: string;
  hours: number;
  childrenCount: number;
  childAges: string[];
  hasPets: boolean;
  skillsRequired: string[];
  familyNotes: string;
  basePay: number;
  extrasPay: number;
  estimatedTotal: number;
  slaRemainingSec: number;
  status: JobOfferStatus;
  mapCoords: { x: number; y: number };
}

export interface SitterChatMessage {
  id: string;
  sender: 'parent' | 'sitter' | 'system';
  text: string;
  timestamp: string;
}

export interface SitterShift {
  offerId: string;
  parentName: string;
  city: string;
  neighborhood: string;
  fullAddress: string;
  dateLabel: string;
  startTime: string;
  endTime: string;
  hours: number;
  estimatedNet: number;
  basePay: number;
  extrasPay: number;
  shiftStatus: 'confirmed' | 'checked_in' | 'checked_out';
  checkInTimestamp?: string;
  checkOutTimestamp?: string;
  checkInLocation?: string;
  online: boolean;
  messages: SitterChatMessage[];
}

export interface WalletTransaction {
  id: string;
  dateLabel: string;
  parentName: string;
  hours: number;
  baseAmount: number;
  extrasAmount: number;
  tipAmount: number;
  platformFee: number;
  netAmount: number;
  status: 'paid_to_wallet' | 'withdrawn';
}

export interface SitterQuest {
  id: string;
  title: string;
  description: string;
  current: number;
  target: number;
  rewardLabel: string;
  completed: boolean;
}

export interface SitterReward {
  id: string;
  title: string;
  description: string;
  pointsCost: number;
  code: string;
  redeemed: boolean;
}

export type AppLanguage = 'he' | 'en';

export interface SitterProfileSettings {
  firstName: string;
  lastInitial: string;
  city: string;
  neighborhood: string;
  hourlyRate: number;
  bio: string;
  languages: string[];
  shareLocationDuringJob: boolean;
  notificationsEnabled: boolean;
}

export type KycQueueStatus = 'pending' | 'approved' | 'rejected';

export interface AdminKycItem {
  id: string;
  fullName: string;
  age: number;
  city: string;
  submittedAt: string;
  idAndSelfieVerified: boolean;
  socialPlatform: 'Instagram' | 'Facebook' | 'TikTok' | 'LinkedIn';
  socialUrl: string;
  videoDurationSec: number;
  cprCertificate: boolean;
  status: KycQueueStatus;
}

export interface AdminSafetyAlert {
  id: string;
  severity: 'high' | 'medium' | 'low';
  type: string;
  partyLabel: string;
  location: string;
  timestamp: string;
  slaLabel: string;
  status: 'open' | 'in_review' | 'resolved';
  details: string;
}


