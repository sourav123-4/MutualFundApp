export type Scheme = {
  schemeCode: number;
  schemeName: string;
  isinGrowth?: string | null;
  isinDivReinvestment?: string | null;
};

export type NavEntry = {
  date: string;
  nav: string;
};

export type SchemeMeta = {
  fund_house?: string;
  scheme_type?: string;
  scheme_category?: string;
  scheme_code?: number;
  scheme_name?: string;
};

export type SchemeDetailResponse = {
  meta: SchemeMeta;
  data: NavEntry[];
  status?: string;
};

export type RootStackParamList = {
  Login: undefined;
  SchemeList: undefined;
  SchemeDetail: {
    schemeCode: number;
    schemeName: string;
  };
};
