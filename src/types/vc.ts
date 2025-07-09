export interface VC {
  id: string;
  name: string;
  industries: string[];
  website: string;
  email: string;
  emailValidated: boolean;
  lastValidated: string;
  country: string;
  description: string;
  founded: string;
  aum: string; // Assets Under Management
}

export interface SearchState {
  query: string;
  results: VC[];
  isLoading: boolean;
  suggestions: string[];
  showSuggestions: boolean;
}