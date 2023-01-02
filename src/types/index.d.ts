export interface Theme  {
  background: string;
  text: string;
  meta: string;
  grade4: string;
  grade3: string;
  grade2: string;
  grade1: string;
}

export interface DataStruct {
  years: DataStructYear[];
  contributions: DataStructContribution[]; 
}

export interface DataStructYear {
  year: string;
  total: number;
  range: {
    start: string;
    end: string;
  }
}

export interface DataStructContribution {
  date: string;
  count: number;
  color: string;
  intensity: number;
}

export interface Options {
  themeName?: keyof typeof themes;
  customTheme: Theme;  
  // skipHeader?: boolean;
  // skipAxisLabel?: boolean;
  username: string;
  data: DataStruct;
  fontFace?: string;
  footerText?: string;
}

export interface DrawYearOptions extends Options {
  year: DataStructYear;
  offsetX?: number;
  offsetY?: number;
}

export interface GraphEntry {
  date: string;
  info?: DataStructContribution;
}
