
export interface UploadedImage {
  dataUrl: string;
  file: File;
}

export interface RecommendationItem {
  id: string;
  gender: string;
  masterCategory: string;
  subCategory: string;
  articleType: string;
  baseColour: string;
  season: string;
  year: number;
  usage: string;
  productDisplayName: string;
  embeddings?: number[];
  matchReason?: string;
}

export interface AnalysisResult {
  items: string[];
  category: string;
  gender: string;
  referenceImageUrl?: string;
}
