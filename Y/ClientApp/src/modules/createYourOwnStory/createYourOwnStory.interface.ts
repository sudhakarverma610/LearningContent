export interface PollingAnswer {
  poll_id: number;
  name: string;
  image_path: string;
  product_id1: string;
  product_id2: string;
  product_id3: string;
  no_of_votes: number;
  display_order: number;
  pollanswer_id: number;
  poll_voting_records: any[];
}

export interface Language {
  LazyLoader: any;
  Name: string;
  LanguageCulture: string;
  UniqueSeoCode: string;
  FlagImageFileName: string;
  Rtl: boolean;
  LimitedToStores: boolean;
  DefaultCurrencyId: number;
  Published: boolean;
  DisplayOrder: number;
  Id: number;
}

export interface Poll {
  language_id: number;
  name: string;
  system_keyword: string;
  published: boolean;
  show_on_home: boolean;
  allow_guests_to_vote: boolean;
  display_order: number;
  limited_to_stores: boolean;
  start_date: string;
  end_date: string;
  language: Language;
  poll_answers: PollingAnswer[];
}
