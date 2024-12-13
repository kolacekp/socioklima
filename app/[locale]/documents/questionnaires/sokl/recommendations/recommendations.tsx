'use client';

import { Page, Document, Font, PDFViewer, View, Image, Text } from '@react-pdf/renderer';
import { useTranslations } from 'next-intl';

import styles from '../../styles';
import PdfColumn from '../../../../../../templates/pdf/components/pdfColumn';
import { documentFontOptions } from '../../../fonts';
import { SoklRecommendationsResult } from '@/utils/reports/sokl/recommendations/recommendations.model';

export default function Recommendations({ result }: { result: SoklRecommendationsResult }) {
  Font.register(documentFontOptions);

  const t = useTranslations('documents.questionnaires.sokl.recommendations');
  const tGeneral = useTranslations('documents.questionnaires.sokl.general');
  const tCommon = useTranslations('documents.questionnaires.common');
  const tFindings = useTranslations('documents.questionnaires.findings');

  return (
    <PDFViewer style={{ height: '100vh', width: '100vw' }}>
      <Document pageLayout="oneColumn">
        <Page size="A4" style={styles.page}>
          {/* -------------------------------------------------- HLAVIČKA --------------------------------------------------*/}
          {/* --------------------------------------------------------------------------------------------------------------*/}

          <View style={styles.header} fixed>
            {/* eslint-disable-next-line jsx-a11y/alt-text */}
            <Image src={'/images/documents/' + tCommon('header_image')}></Image>
          </View>

          <View style={styles.section}>
            <Text style={styles.heading}>{t('heading')}</Text>
          </View>

          <View style={styles.section}>
            <View style={styles.line}></View>

            <View style={{ flexDirection: 'row', marginBottom: 3 }}>
              <PdfColumn width="20%">
                <Text style={styles.bold}>{tCommon('school')}:</Text>
              </PdfColumn>
              <PdfColumn width="65%">
                <Text>{result.info.schoolName}</Text>
              </PdfColumn>
              <PdfColumn width="15%">
                <Text
                  style={{
                    textTransform: 'uppercase',
                    color: 'red',
                    fontWeight: 500
                  }}
                >
                  {tCommon('confidential')}
                </Text>
              </PdfColumn>
            </View>
            <View style={{ flexDirection: 'row', marginBottom: 3 }}>
              <PdfColumn width="20%">
                <Text style={styles.bold}>{tCommon('questionnaire')}:</Text>
              </PdfColumn>
              <PdfColumn width="80%">
                <Text>{tGeneral('name')}</Text>
              </PdfColumn>
            </View>
            <View style={{ flexDirection: 'row', marginBottom: 3 }}>
              <PdfColumn width="20%">
                <Text style={styles.bold}>{tCommon('class')}:</Text>
              </PdfColumn>
              <PdfColumn width="30%">
                <Text>{result.info.className}</Text>
              </PdfColumn>
              <PdfColumn width="25%">
                <Text style={styles.bold}>{tCommon('school_year')}:</Text>
              </PdfColumn>
              <PdfColumn width="25%">
                <Text>{result.info.schoolYear}</Text>
              </PdfColumn>
            </View>
            <View style={{ flexDirection: 'row', marginBottom: 3 }}>
              <PdfColumn width="20%">
                <Text style={styles.bold}>{tCommon('class_pupil_count')}:</Text>
              </PdfColumn>
              <PdfColumn width="30%">
                <Text>{result.info.pupilsTotal}</Text>
              </PdfColumn>
              <PdfColumn width="25%">
                <Text style={styles.bold}>{tCommon('enrolled_pupil_count')}:</Text>
              </PdfColumn>
              <PdfColumn width="25%">
                <Text>{result.info.pupilsCompleted}</Text>
              </PdfColumn>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <PdfColumn width="20%">
                <Text style={styles.bold}>{tCommon('date_from')}:</Text>
              </PdfColumn>
              <PdfColumn width="30%">
                <Text>{result.info.dateCreated.toLocaleDateString('cs-CZ')}</Text>
              </PdfColumn>
              <PdfColumn width="25%">
                <Text style={styles.bold}>{tCommon('date_to')}:</Text>
              </PdfColumn>
              <PdfColumn width="25%">
                <Text>{result.info.dateClosed?.toLocaleDateString('cs-CZ')}</Text>
              </PdfColumn>
            </View>

            <View style={styles.line}></View>
          </View>

          {/* ----------------------------------------------- ZÁKLADNÍ POPIS --------------------------------------------------*/}
          {/* -----------------------------------------------------------------------------------------------------------------*/}

          <View style={styles.section}>
            <Text style={styles.paragraph}>
              {t.rich('desc', {
                strong: (chunks) => <Text style={styles.bold}>{chunks}</Text>
              })}
            </Text>
          </View>

          {result.results.pupilsFactors.map((pf, index) => (
            <View key={index} style={styles.section}>
              <Text style={styles.subheadingtleft}>{pf.pupil.name || pf.pupil.number}</Text>

              <Text style={styles.subsubheadingleft}>
                {t('strenghts')} - {t('how_to_use')}
              </Text>

              {pf.factors.strengths.map((option, index) => (
                <View key={index} style={{ flexDirection: 'row', marginBottom: 4 }}>
                  <Text>
                    <Text style={{ marginHorizontal: 8 }}>•</Text>{' '}
                    {tFindings(`${option[0]}.${option}.recommendation_teacher`)}
                  </Text>
                </View>
              ))}

              <Text style={{ marginTop: 10, ...styles.subsubheadingleft }}>
                {t('risk_factors')} - {t('how_to_solve')}
              </Text>

              {pf.factors.risks.map((option, index) => (
                <View key={index} style={{ flexDirection: 'row', marginBottom: 4 }}>
                  <Text>
                    <Text style={{ marginHorizontal: 8 }}>•</Text>{' '}
                    {tFindings(`${option[0]}.${option}.recommendation_teacher`)}
                  </Text>
                </View>
              ))}

              <Text style={{ marginTop: 10, ...styles.subsubheadingleft }}>
                {t('threatening_factors')} - {t('how_to_stop')}
              </Text>

              {pf.factors.threats.map((option, index) => (
                <View key={index} style={{ flexDirection: 'row', marginBottom: 4 }}>
                  <Text>
                    <Text style={{ marginHorizontal: 8 }}>•</Text>{' '}
                    {tFindings(`${option[0]}.${option}.recommendation_teacher`)}
                  </Text>
                </View>
              ))}
            </View>
          ))}

          <View style={{ marginTop: 30, ...styles.section }}>
            <Text style={styles.paragraph}>
              {tCommon.rich('generated', {
                strong: (chunks) => <Text style={styles.bold}>{chunks}</Text>
              })}
            </Text>
          </View>

          {/* -------------------------------------------------- PATIČKA --------------------------------------------------*/}
          {/* -------------------------------------------------------------------------------------------------------------*/}

          <View style={styles.footer} fixed>
            <Text style={styles.pageNumber} render={({ pageNumber }) => `${pageNumber}`} />
            {/* eslint-disable-next-line jsx-a11y/alt-text */}
            <Image src={'/images/documents/' + tCommon('footer_image')}></Image>
          </View>

          {/* -------------------------------------------------- DOŠEL JSI AŽ SEM? GOOD JOB! --------------------------------------------------*/}
          {/* ---------------------------------------------------------------------------------------------------------------------------------*/}
        </Page>
      </Document>
    </PDFViewer>
  );
}
