export interface Message {
  role: 'user' | 'model';
  content: string;
}

export interface File {
  content: string;
  language: string;
}

export type Files = Record<string, File>;

export type ViewMode = 'explorer' | 'settings' | 'source-control' | 'extensions' | 'accounts';