'use client';

import { Page, Document, Font, PDFViewer, View, Image, Text } from '@react-pdf/renderer';
import { useTranslations } from 'next-intl';

import styles from '../../styles';
import PdfColumn from '../../../../../../templates/pdf/components/pdfColumn';
import { documentFontOptions } from '../../../fonts';
import { categoriesArray } from '@/utils/categories';
import 'chartjs-plugin-datalabels';
import { getCategoryColorByKey } from '@/utils/colors';
import { CategoriesCountsPupils, OptionsCountsPupils, UnvetDcdeResult } from '@/utils/reports/unvet/dcde/dcde.model';

export default function DetailClassDiagnosticExtract({ result }: { result: UnvetDcdeResult }) {
  Font.register(documentFontOptions);

  const t = useTranslations('documents.questionnaires.unvet.detail_class_diagnostic');
  const tGeneral = useTranslations('documents.questionnaires.unvet.general');
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
            <Text style={styles.heading}>{t('heading_extract')}</Text>
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

          {/* -------------------------------------------- VÝSTUPY Z JEDNOTLIVÝCH KATEGORIÍ --------------------------------------------*/}
          {/* --------------------------------------------------------------------------------------------------------------------------*/}
          <View style={styles.section}>
            {Object.entries(categoriesArray).map(([letter, subcategories], letterIndex) => (
              <View key={letterIndex} wrap={false}>
                <Text style={styles.subheading}>
                  {`${letter}:`} {tFindings(`${letter}.name`)}
                </Text>

                <View style={{ marginBottom: 20 }}>
                  <View
                    style={{
                      width: '100%',
                      paddingVertical: 3,
                      paddingHorizontal: 3,
                      borderWidth: 4,
                      borderColor: getCategoryColorByKey(letter)
                    }}
                  >
                    <Text style={{ fontSize: 12, paddingHorizontal: 3 }}>
                      <Text style={{ ...styles.bold }}>
                        {`${letter}:`} {tFindings(`${letter}.name`)}:{' '}
                      </Text>
                      {result.results.pupilsCategories[letter as keyof CategoriesCountsPupils]
                        .slice(0, 4)
                        .map(
                          (op, i, arr) =>
                            (op.pupil.name || op.pupil.number) + ' (' + op.value + `x)${i < arr.length - 1 ? ', ' : ''}`
                        )}
                    </Text>
                  </View>
                  {subcategories.map((subcategory, index) => (
                    <View
                      key={index}
                      style={{
                        width: '100%',
                        paddingVertical: 3,
                        paddingHorizontal: 3,
                        borderLeftWidth: 2,
                        borderRightWidth: 2,
                        borderBottomWidth: 2,
                        borderLeftColor: '#dddddd',
                        borderRightColor: '#dddddd',
                        borderBottomColor: '#dddddd'
                      }}
                    >
                      <Text style={{ fontSize: 10, paddingHorizontal: 3 }}>
                        <Text style={{ ...styles.bold }}>
                          {tFindings(`${letter}.${subcategory}.code`)} {tFindings(`${letter}.${subcategory}.name`)}:{' '}
                        </Text>
                        {result.results.pupilsOptions[subcategory as keyof OptionsCountsPupils].map(
                          (op, i, arr) =>
                            (op.pupil.name || op.pupil.number) + ' (' + op.value + `x)${i < arr.length - 1 ? ', ' : ''}`
                        )}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </View>

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
