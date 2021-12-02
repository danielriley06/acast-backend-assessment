export interface Channel {
  name: string;
  feedUrl: string;
  episodes: Episode[];
}

export interface Episode {
  title: string;
  checksum?: string;
  url: string;
}
