export interface JobWithDistance {
  id: string;
  title: string;
  description: string;
  salaryMin: number | null;
  salaryMax: number | null;
  salaryCurrency: string;
  workType: string;
  lat: number | null;
  lng: number | null;
  locationLabel: string | null;
  isApproximate: boolean;
  requirements: string;
  status: string;
  imageUrl: string | null;
  createdAt: Date | string;
  employerId: string;
  distance?: number;
  employer?: {
    profile?: {
      fullName: string;
      companyName?: string | null;
      avatarUrl?: string | null;
      bio?: string | null;
    };
  };
}

export interface ApplicationWithDetails {
  id: string;
  status: string;
  coverNote: string | null;
  createdAt: Date | string;
  job: {
    id: string;
    title: string;
    locationLabel: string | null;
    workType: string;
  };
  candidate?: {
    id: string;
    email: string;
    profile?: {
      fullName: string;
      skills: string;
      experienceYears: number;
      resumeUrl: string | null;
      resumeLink: string | null;
      avatarUrl: string | null;
      locationLabel: string | null;
    } | null;
  };
}
