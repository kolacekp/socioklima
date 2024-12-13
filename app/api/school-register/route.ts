import { SchoolAres } from 'models/schoolRegister/ares';
import { SchoolRuz, Units } from 'models/schoolRegister/ruz';
import { NextRequest, NextResponse } from 'next/server';

export interface ApiSchoolInfo {
  schoolName: string;
  address: string;
  city: string;
  zipCode: string;
  businessId: string;
  taxNumber: string;
}

export async function GET(request: NextRequest) {
  const businessId = request.nextUrl.searchParams.get('businessid');
  const country = request.nextUrl.searchParams.get('country');

  if (!businessId) {
    return NextResponse.json({ error: 'Missing BusinessID Parameter' }, { status: 400 });
  }

  if (!country) {
    return NextResponse.json({ error: 'Missing Country Parameter' }, { status: 400 });
  }

  const fetchRegisterCz = async () => {
    try {
      const url = 'https://ares.gov.cz/ekonomicke-subjekty-v-be/rest/ekonomicke-subjekty/';

      const response = await fetch(url + businessId);

      const data = await response.json();
      const schoolData = mapAres(data);

      return NextResponse.json(schoolData, { status: 200 });
    } catch (error) {
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  };

  const fetchRegisterSk = async () => {
    try {
      const url = 'https://www.registeruz.sk/cruz-public/api/';

      let response = await fetch(url + `uctovne-jednotky?zmenene-od=2000-01-01&ico=${businessId}`);

      const units: Units = await response.json();

      response = await fetch(url + `uctovna-jednotka?id=${units.id[0]}`);

      const jsonData: SchoolRuz = await response.json();
      const data = mapRuz(jsonData);

      return NextResponse.json(data, { status: 200 });
    } catch (error) {
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  };

  switch (country) {
    // CZ
    case '0':
      return await fetchRegisterCz();

    // SK
    case '1':
      return await fetchRegisterSk();

    default:
      return NextResponse.json({ error: 'Invalid Country Parameter Value' }, { status: 400 });
  }
}

function mapAres(data: SchoolAres): ApiSchoolInfo {
  const schoolInfo: ApiSchoolInfo = {
    schoolName: data.obchodniJmeno,
    address: data.sidlo.nazevUlice + ' ' + data.sidlo.cisloDomovni,
    city: data.sidlo.nazevObce,
    zipCode: data.sidlo.psc.toString(),
    businessId: data.ico,
    taxNumber: data.dic
  };

  return schoolInfo;
}

function mapRuz(data: SchoolRuz): ApiSchoolInfo {
  const schoolInfo: ApiSchoolInfo = {
    schoolName: data.nazovUJ,
    address: data.ulica,
    city: data.mesto,
    zipCode: data.psc,
    businessId: data.ico,
    taxNumber: data.dic
  };

  return schoolInfo;
}
