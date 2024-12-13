'use client';

import { Page, Document, Font, PDFViewer, View, Image, Text } from '@react-pdf/renderer';
import { useTranslations } from 'next-intl';

import styles from '../../styles';
import PdfColumn from '../../../../../../templates/pdf/components/pdfColumn';
import { documentFontOptions } from '../../../fonts';
import { categoriesArray } from '@/utils/categories';
import { getCategoryColorByKey } from '@/utils/colors';
import { Options, SoklChoicesSummaryResult } from '@/utils/reports/sokl/choices/choices.model';

export default function ChoicesSummary({ result }: { result: SoklChoicesSummaryResult }) {
  Font.register(documentFontOptions);

  const t = useTranslations('documents.questionnaires.sokl.choices_summary');
  const tFindings = useTranslations('documents.questionnaires.findings');
  const tCommon = useTranslations('documents.questionnaires.common');
  const tGeneral = useTranslations('documents.questionnaires.sokl.general');

  return (
    <PDFViewer style={{ height: '100vh', width: '100vw' }}>
      <Document pageLayout="oneColumn">
        <Page size="A4" style={styles.pageLandscape} orientation="landscape">
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
            <Text style={styles.paragraph}>
              {t.rich('desc_1', {
                strong: (chunks) => <Text style={styles.bold}>{chunks}</Text>
              })}
            </Text>
            <Text style={styles.paragraph}>
              {t.rich('desc_2', {
                strong: (chunks) => <Text style={styles.bold}>{chunks}</Text>
              })}
            </Text>
            <Text style={styles.paragraph}>
              {t.rich('desc_3', {
                strong: (chunks) => <Text style={styles.bold}>{chunks}</Text>
              })}
            </Text>
            <Text style={styles.paragraph}>
              {t.rich('desc_4', {
                strong: (chunks) => <Text style={styles.bold}>{chunks}</Text>
              })}
            </Text>
            <Text style={styles.paragraph}>
              {t.rich('desc_5', {
                strong: (chunks) => <Text style={styles.bold}>{chunks}</Text>
              })}
            </Text>
            <Text style={styles.paragraph}>
              {t.rich('desc_6', {
                strong: (chunks) => <Text style={styles.bold}>{chunks}</Text>
              })}
            </Text>
          </View>

          {/* -------------------------------------------------- TABULKA --------------------------------------------------*/}
          {/* --------------------------------------------------------------------------------------------------------------*/}

          <View style={styles.section} break>
            {/* --- HLAVIČKA TABULKY --- */}
            <View style={{ flexDirection: 'row', height: 180 }} fixed>
              <View
                style={{
                  width: '19%',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  padding: 3,
                  borderLeftWidth: 1,
                  borderTopWidth: 1,
                  borderRightWidth: 1,
                  borderBottomWidth: 2,
                  borderColor: '#dddddd'
                }}
              >
                <Text>{t('pupil_name')}</Text>
              </View>

              {Object.entries(categoriesArray).map(([letter, subcategories]) => (
                <>
                  {subcategories.map((subcategory, index) => (
                    <View
                      style={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '2%',
                        borderTopWidth: 1,
                        borderBottomWidth: 2,
                        borderRightWidth: 1,
                        borderTopColor: getCategoryColorByKey(letter),
                        borderBottomColor: getCategoryColorByKey(letter),
                        borderRightColor: getCategoryColorByKey(letter)
                      }}
                      key={index}
                    >
                      <Text
                        style={{
                          width: 170,
                          transform: 'rotate(-90deg)'
                        }}
                      >
                        {tFindings(`${letter}.${subcategory}.code`)} {tFindings(`${letter}.${subcategory}.name`)}
                      </Text>
                    </View>
                  ))}
                  <View
                    style={{
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '3%',
                      paddingVertical: 3,
                      paddingHorizontal: 3,
                      borderTopWidth: 1,
                      borderBottomWidth: 2,
                      borderRightWidth: 1,
                      borderTopColor: getCategoryColorByKey(letter),
                      borderBottomColor: getCategoryColorByKey(letter),
                      borderRightColor: getCategoryColorByKey(letter)
                    }}
                  >
                    <Text
                      style={{
                        width: 170,
                        transform: 'rotate(-90deg)',
                        fontWeight: 'bold'
                      }}
                    >
                      {letter} {tFindings(`${letter}.name`)}
                    </Text>
                  </View>
                </>
              ))}
            </View>

            {/* --- ŘÁDKY SE ŽÁKY --- */}
            {result.results.table.pupilOptions.map((p, i, arr) => (
              <View style={{ flexDirection: 'row' }} key={i} wrap={false}>
                <View
                  style={{
                    width: '19%',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 3,
                    borderLeftWidth: 1,
                    borderBottomWidth: arr.length - 1 === i ? 2 : 1,
                    borderRightWidth: 1,
                    borderLeftColor: '#dddddd',
                    borderBottomColor: '#dddddd',
                    borderRightColor: '#dddddd'
                  }}
                >
                  <Text>{p.name || p.number}</Text>
                </View>

                {Object.entries(categoriesArray).map(([letter, subcategories]) => (
                  <>
                    {subcategories.map((subcategory, j) => (
                      <View
                        style={{
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '2%',
                          borderBottomWidth: arr.length - 1 === i ? 2 : 1,
                          borderRightWidth: 1,
                          borderBottomColor: getCategoryColorByKey(letter),
                          borderRightColor: getCategoryColorByKey(letter)
                        }}
                        key={j}
                      >
                        <Text>{p.options[subcategory as keyof Options]}</Text>
                      </View>
                    ))}
                    <View
                      style={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '3%',
                        paddingVertical: 3,
                        paddingHorizontal: 3,
                        borderBottomWidth: arr.length - 1 === i ? 2 : 1,
                        borderRightWidth: 1,
                        borderBottomColor: getCategoryColorByKey(letter),
                        borderRightColor: getCategoryColorByKey(letter)
                      }}
                    >
                      <Text
                        style={{
                          fontWeight: 'bold'
                        }}
                      >
                        {p.options[subcategories[0] as keyof Options] +
                          p.options[subcategories[1] as keyof Options] +
                          p.options[subcategories[2] as keyof Options]}
                      </Text>
                    </View>
                  </>
                ))}
              </View>
            ))}

            <View style={{ flexDirection: 'row' }} wrap={false}>
              <View
                style={{
                  width: '19%',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 3,
                  borderLeftWidth: 1,
                  borderBottomWidth: 1,
                  borderRightWidth: 1,
                  borderLeftColor: '#dddddd',
                  borderBottomColor: '#dddddd',
                  borderRightColor: '#dddddd'
                }}
              >
                <Text style={{ fontWeight: 'bold' }}>{t('total')}</Text>
              </View>

              {Object.entries(categoriesArray).map(([letter, subcategories]) => (
                <>
                  {subcategories.map((subcategory, index) => (
                    <View
                      style={{
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '2%',
                        borderBottomWidth: 1,
                        borderRightWidth: 1,
                        borderBottomColor: getCategoryColorByKey(letter),
                        borderRightColor: getCategoryColorByKey(letter)
                      }}
                      key={index}
                    >
                      <Text>{result.results.table.optionsSummary[subcategory as keyof Options]}</Text>
                    </View>
                  ))}
                  <View
                    style={{
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '3%',
                      paddingVertical: 3,
                      paddingHorizontal: 3,
                      borderBottomWidth: 1,
                      borderRightWidth: 1,
                      borderBottomColor: getCategoryColorByKey(letter),
                      borderRightColor: getCategoryColorByKey(letter)
                    }}
                  >
                    <Text
                      style={{
                        fontWeight: 'bold'
                      }}
                    >
                      {result.results.table.optionsSummary[subcategories[0] as keyof Options] +
                        result.results.table.optionsSummary[subcategories[1] as keyof Options] +
                        result.results.table.optionsSummary[subcategories[2] as keyof Options]}
                    </Text>
                  </View>
                </>
              ))}
            </View>
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
