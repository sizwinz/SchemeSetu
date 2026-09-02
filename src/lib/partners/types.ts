export type InstitutionType = "SCA" | "PSB" | "RRB" | "NBFC_MFI";

export type HealthTier = "SOLVENT" | "MODERATE" | "HIGH_RISK";

export interface GeoCoordinates {
  lat: number;
  lng: number;
}

export interface DistrictHub {
  id: string;
  name: string;
  state: string;
  coordinates: GeoCoordinates;
}

export interface ChannelPartner {
  id: string;
  name: string;
  institutionType: InstitutionType;
  branchName: string;
  state: string;
  district: string;
  address: string;
  coordinates: GeoCoordinates;
  contactPhone: string;
  nodalOfficer: string;
  npaPercentage: number;
  overdueRate: number;
  remainingQuotaLakhs: number;
  averageTurnaroundDays: number;
  supportedSchemes: string[];
  healthScore: number;
  healthTier: HealthTier;
}

export interface PartnerFilterOptions {
  districtId?: string;
  institutionType?: string;
  schemeCode?: string;
  includeHighRisk?: boolean;
  maxDistanceKm?: number;
}
