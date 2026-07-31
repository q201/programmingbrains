export interface TutorialTopic {
  id: string;
  title: string;
  duration: string;
  summary: string;
  content: string;
}

export interface TutorialTrack {
  slug: string;
  title: string;
  description: string;
  level: string;
  totalDuration: string;
  topics: TutorialTopic[];
}
