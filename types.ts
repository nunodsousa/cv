/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

export interface Job {
  id: string;
  role: string;
  company: string;
  location?: string;
  period: string;
  description?: string;
  highlights: string[];
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  period: string;
  details: string[];
  link?: string;
}

export interface SkillCategory {
  category: string;
  skills: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
}

export interface Artist {
  name: string;
  image: string;
  day: string;
  genre: string;
}