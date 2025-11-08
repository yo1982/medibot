import { type Part } from "@google/genai";

export interface ChartDataset {
  label: string;
  data: number[];
}

export interface ChartData {
  title: string;
  labels: string[];
  datasets: ChartDataset[];
}

export type Message = {
  role: 'user' | 'model';
  parts: Part[];
  visualizationData?: ChartData | null;
};