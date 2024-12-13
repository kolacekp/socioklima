export interface SchoolAres {
  ico: string;
  obchodniJmeno: string;
  sidlo: Sidlo;
  pravniForma: string;
  financniUrad: string;
  datumVzniku: string;
  datumAktualizace: string;
  dic: string;
  icoId: string;
  adresaDorucovaci: AdresaDorucovaci;
  seznamRegistraci: SeznamRegistraci;
  primarniZdroj: string;
  dalsiUdaje: DalsiUdaje[];
  czNace: string[];
}

export interface Sidlo {
  kodStatu: string;
  nazevStatu: string;
  kodKraje: number;
  nazevKraje: string;
  kodOkresu: number;
  nazevOkresu: string;
  kodObce: number;
  nazevObce: string;
  kodUlice: number;
  nazevUlice: string;
  cisloDomovni: number;
  kodCastiObce: number;
  nazevCastiObce: string;
  kodAdresnihoMista: number;
  psc: number;
  textovaAdresa: string;
  standardizaceAdresy: boolean;
  typCisloDomovni: number;
}

export interface AdresaDorucovaci {
  radekAdresy1: string;
  radekAdresy2: string;
}

export interface SeznamRegistraci {
  stavZdrojeVr: string;
  stavZdrojeRes: string;
  stavZdrojeRzp: string;
  stavZdrojeNrpzs: string;
  stavZdrojeRpsh: string;
  stavZdrojeRcns: string;
  stavZdrojeSzr: string;
  stavZdrojeDph: string;
  stavZdrojeSd: string;
  stavZdrojeIr: string;
  stavZdrojeCeu: string;
  stavZdrojeRs: string;
  stavZdrojeRed: string;
  stavZdrojeMonitor: string;
}

export interface DalsiUdaje {
  obchodniJmeno: ObchodniJmeno[];
  sidlo: Sidlo2[];
  pravniForma: string;
  datovyZdroj: string;
}

export interface ObchodniJmeno {
  obchodniJmeno: string;
  primarniZaznam: boolean;
}

export interface Sidlo2 {
  sidlo: Sidlo3;
  primarniZaznam: boolean;
}

export interface Sidlo3 {
  kodStatu: string;
  nazevStatu: string;
  kodKraje: number;
  nazevKraje: string;
  kodOkresu: number;
  nazevOkresu: string;
  kodObce: number;
  nazevObce: string;
  kodUlice: number;
  nazevUlice: string;
  cisloDomovni: number;
  kodCastiObce: number;
  nazevCastiObce: string;
  kodAdresnihoMista: number;
  psc: number;
  textovaAdresa: string;
  standardizaceAdresy: boolean;
  typCisloDomovni: number;
}
