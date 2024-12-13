export interface Units {
  id: number[];
  existujeDalsieId: boolean;
}

export interface SchoolRuz {
  id: number;
  idVyrocnychSprav: number[];
  idUctovnychZavierok: number[];
  skNace: string;
  konsolidovana: boolean;
  zdrojDat: string;
  okres: string;
  sidlo: string;
  druhVlastnictva: string;
  kraj: string;
  velkostOrganizacie: string;
  pravnaForma: string;
  datumPoslednejUpravy: string;
  datumZalozenia: string;
  ulica: string;
  psc: string;
  dic: string;
  ico: string;
  nazovUJ: string;
  mesto: string;
}
