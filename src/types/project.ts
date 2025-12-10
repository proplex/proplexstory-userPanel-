export interface Project {
  id: string;
  title: string;
  description: string;
  location: string;
  returns: string;
  totalShares: string;
  lockIn: string;
  investors: number;
  progress: number;
  rating: number;
  imageUrl: string;
  category: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectResponse {
  data: Project[];
  meta?: {
    total: number;
    page: number;
    limit: number;
  };
}

export type ProjectCardProps = {
  project: Project;
};

export type ProjectsListingProps = {
  initialData?: ProjectResponse;
}; 


