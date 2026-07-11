export interface Contents {
  contentTitle: string;
  sequance: number;
  contentUrl: string;
}

export interface ChapterRequestDTO {
  courseId: string;
  title: string;
  description: string;
  videoUrl: string;
  serialNumber: number;
  contents: Contents[];
}
