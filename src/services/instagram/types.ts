
export interface InstagramComment {
  id: string;
  username: string;
  text: string;
  timestamp: string;
  likes?: number;
}

export interface InstagramApiResponse {
  comments: InstagramComment[];
  total: number;
  status: 'success' | 'error';
  message?: string;
}

export interface ApiConfig {
  name: string;
  host: string;
  endpoint: (postId: string) => string;
  key: string;
  active: boolean;
  price: string;
  features: string[];
}

export interface ApiStatus {
  totalApis: number;
  configuredApis: number;
  isConfigured: boolean;
  availableApis: Array<{
    name: string;
    price: string;
    features: string[];
    isConfigured: boolean;
  }>;
}
