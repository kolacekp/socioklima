'use client';

import { Page, Document, Font, PDFViewer, View, Image, Text } from '@react-pdf/renderer';
import { useTranslations } from 'next-intl';

import styles from '../../styles';
import PdfColumn from '../../../../../../templates/pdf/components/pdfColumn';
import { socialIndexTiers } from '@/utils/categories';
import { documentFontOptions } from '../../../fonts';
import { Count, UnvetSocialIndexResult } from '@/utils/reports/unvet/index/index.model';

export default function SocialInvolvementIndex({ result }: { result: UnvetSocialIndexResult }) {
  const genderRequired = result.info.genderRequired;

  Font.register(documentFontOptions);

  const t = useTranslations('documents.questionnaires.unvet.social_involvement_index');
  const tCommon = useTranslations('documents.questionnaires.common');
  const tIndexes = useTranslations('documents.questionnaires.indexes');
  const tGeneral = useTranslations('documents.questionnaires.unvet.general');

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

          {/* -------------------------------------------------- ZÁKLADNÍ POPIS --------------------------------------------------*/}
          {/* --------------------------------------------------------------------------------------------------------------------*/}

          <View style={styles.section}>
            <Text style={styles.paragraph}>
              {t.rich('isz_1', {
                strong: (chunks) => <Text style={styles.bold}>{chunks}</Text>
              })}
            </Text>
            <Text style={styles.paragraph}>
              {t.rich('isz_2', {
                strong: (chunks) => <Text style={styles.bold}>{chunks}</Text>
              })}
            </Text>
            <Text style={styles.paragraph}>
              {t.rich('isz_3', {
                strong: (chunks) => <Text style={styles.bold}>{chunks}</Text>
              })}
            </Text>
            <Text style={styles.paragraph}>
              {t.rich('isz_4', {
                strong: (chunks) => <Text style={styles.bold}>{chunks}</Text>
              })}
            </Text>
          </View>

          {/* --------------------------------------------- INDEX --------------------------------------------------*/}
          {/* ------------------------------------------------------------------------------------------------------*/}

          <View style={styles.section} break>
            <Text style={styles.subsubheading}>{t('table_1')}</Text>
            <View
              style={{
                flexDirection: 'row',
                fontWeight: 700,
                paddingVertical: 5
              }}
            >
              <View style={{ paddingHorizontal: 5, width: '10%' }}>
                <Text>{tIndexes('grade')}</Text>
              </View>
              <View style={{ paddingHorizontal: 5, width: '20%' }}>
                <Text>{tIndexes('social_involvement')}</Text>
              </View>
              <View style={{ paddingHorizontal: 5, width: '10%' }}>
                <Text>{tIndexes('social_involvement_range')}</Text>
              </View>
              <View style={{ paddingHorizontal: 5, width: '40%' }}>
                <Text>{tIndexes('characteristics')}</Text>
              </View>
              {genderRequired && (
                <View
                  style={{
                    flexDirection: 'column',
                    paddingHorizontal: 5,
                    width: '20%'
                  }}
                >
                  <View>
                    <Text style={{ textAlign: 'center' }}>{tIndexes('pupil_count')}</Text>
                  </View>
                  <View style={{ flexDirection: 'row' }}>
                    <Text style={{ width: '33.3%', textAlign: 'center' }}>Σ</Text>
                    <Text style={{ width: '33.3%', textAlign: 'center' }}>CH</Text>
                    <Text style={{ width: '33.3%', textAlign: 'center' }}>D</Text>
                  </View>
                </View>
              )}
              {!genderRequired && (
                <View style={{ paddingHorizontal: 5, width: '20%' }}>
                  <Text style={{ textAlign: 'center' }}>{tIndexes('pupil_count')}</Text>
                </View>
              )}
            </View>

            {Object.entries(result.results.index.tiers).map(([_k, value]: [string, Count]) => {
              const key = Number(_k);
              return (
                <View
                  key={socialIndexTiers[key].code}
                  style={{
                    flexDirection: 'row',
                    fontSize: 8,
                    paddingVertical: 3,
                    backgroundColor: socialIndexTiers[key].color
                  }}
                >
                  <View style={{ width: '10%', ...styles.cellVerticalMiddle }}>
                    <Text>{socialIndexTiers[key].code}</Text>
                  </View>
                  <View style={{ width: '20%', ...styles.cellVerticalMiddle, ...styles.bold }}>
                    <Text style={{ textTransform: 'uppercase' }}>{tIndexes(`${socialIndexTiers[key].code}.name`)}</Text>
                  </View>
                  <View style={{ width: '10%', ...styles.cellVerticalMiddle }}>
                    <Text>
                      {socialIndexTiers[key].range[0].toFixed(2)} - {socialIndexTiers[key].range[1].toFixed(2)}
                    </Text>
                  </View>
                  <View style={{ width: '40%', ...styles.cellVerticalMiddle }}>
                    <Text>
                      {tIndexes.rich(`${socialIndexTiers[key].code}.description`, {
                        strong: (chunks) => <Text style={styles.bold}>{chunks}</Text>
                      })}
                    </Text>
                  </View>

                  <View style={{ width: '20%', ...styles.cellVerticalMiddle }}>
                    {genderRequired && (
                      <View style={{ flexDirection: 'column' }}>
                        <View style={{ flexDirection: 'row' }}>
                          <Text style={{ width: '33.3%', textAlign: 'center' }}>{value.total}</Text>
                          <Text style={{ width: '33.3%', textAlign: 'center' }}>{value.gender[1]}</Text>
                          <Text style={{ width: '33.3%', textAlign: 'center' }}>{value.gender[2]}</Text>
                        </View>
                      </View>
                    )}
                    {!genderRequired && <Text style={{ textAlign: 'center', width: '100%' }}>{value.total}</Text>}
                  </View>
                </View>
              );
            })}
          </View>

          <View style={styles.section} break>
            <Text style={styles.subsubheading}>{t('table_2')}</Text>

            <View
              style={{
                flexDirection: 'row',
                fontWeight: 700,
                borderWidth: 1,
                borderColor: '#dddddd',
                paddingVertical: 5,
                backgroundColor: '#D3D3D3'
              }}
            >
              <View
                style={{
                  width: '25%',
                  borderRightWidth: 1,
                  borderRightColor: '#dddddd',
                  ...styles.cellVerticalMiddle
                }}
              >
                <Text>{t('name')}</Text>
              </View>
              <View
                style={{
                  width: '12.5%',
                  borderRightWidth: 1,
                  borderRightColor: '#dddddd',
                  ...styles.cellVerticalMiddle
                }}
              >
                <Text>{t('acceptance')}</Text>
              </View>
              <View
                style={{
                  width: '12.5%',
                  borderRightWidth: 1,
                  borderRightColor: '#dddddd',
                  ...styles.cellVerticalMiddle
                }}
              >
                <Text>{t('involvement')}</Text>
              </View>
              <View
                style={{
                  width: '12.5%',
                  borderRightWidth: 1,
                  borderRightColor: '#dddddd',
                  ...styles.cellVerticalMiddle
                }}
              >
                <Text>{t('safety')}</Text>
              </View>
              <View
                style={{
                  width: '12.5%',
                  borderRightWidth: 1,
                  borderRightColor: '#dddddd',
                  ...styles.cellVerticalMiddle
                }}
              >
                <Text>{t('index')}</Text>
              </View>
              <View
                style={{
                  width: '25%',
                  ...styles.cellVerticalMiddle
                }}
              >
                <Text>{t('grade')}</Text>
              </View>
            </View>

            {result.results.index.pupilIndexes.map((pupilIndex, i) => (
              <View
                key={i}
                style={{
                  flexDirection: 'row',
                  borderLeftWidth: 1,
                  borderRightWidth: 1,
                  borderBottomWidth: 1,
                  borderColor: '#dddddd'
                }}
              >
                <View
                  style={{
                    width: '25%',
                    borderRightWidth: 1,
                    borderRightColor: '#dddddd',
                    ...styles.cellVerticalMiddle,
                    ...styles.bold
                  }}
                >
                  <Text>{pupilIndex.name || pupilIndex.number}</Text>
                </View>
                <View
                  style={{
                    width: '12.5%',
                    borderRightWidth: 1,
                    borderRightColor: '#dddddd',
                    ...styles.cellVerticalMiddle
                  }}
                >
                  <Text>{pupilIndex.index.acceptance.toFixed(2)}</Text>
                </View>
                <View
                  style={{
                    width: '12.5%',
                    borderRightWidth: 1,
                    borderRightColor: '#dddddd',
                    ...styles.cellVerticalMiddle
                  }}
                >
                  <Text>{pupilIndex.index.involvement.toFixed(2)}</Text>
                </View>
                <View
                  style={{
                    width: '12.5%',
                    borderRightWidth: 1,
                    borderRightColor: '#dddddd',
                    ...styles.cellVerticalMiddle
                  }}
                >
                  <Text>{pupilIndex.index.safety.toFixed(2)}</Text>
                </View>
                <View
                  style={[
                    {
                      width: '12.5%',
                      borderRightWidth: 1,
                      borderRightColor: '#dddddd'
                    },
                    styles.cellVerticalMiddle,
                    styles.bold
                  ]}
                >
                  <Text>{pupilIndex.distance.toFixed(2)}</Text>
                  {pupilIndex.threatOrThreatened.threatCount > 2 && (
                    <View style={{ color: 'red' }}>
                      <Text>&nbsp;&nbsp;&nbsp;■</Text>
                    </View>
                  )}
                  {pupilIndex.threatOrThreatened.threatenedCount > 2 && (
                    <View style={{ color: 'green' }}>
                      <Text>&nbsp;&nbsp;&nbsp;■</Text>
                    </View>
                  )}
                </View>
                <View
                  style={{
                    width: '25%',
                    paddingVertical: 5,
                    backgroundColor: socialIndexTiers[pupilIndex.tier].color,
                    ...styles.cellVerticalMiddle,
                    ...styles.bold
                  }}
                >
                  <Text style={{ textTransform: 'uppercase' }}>
                    {tIndexes(`${socialIndexTiers[pupilIndex.tier].code}.name`)}
                  </Text>
                </View>
              </View>
            ))}
          </View>
          <View style={styles.section}>
            <Text style={[styles.paragraph, { marginBottom: 2 }]}>{t('isz_5')}</Text>
            <Text>
              • {t('threat')}&nbsp;&nbsp;&nbsp;
              <View style={{ color: 'red' }}>
                <Text>■</Text>
              </View>
            </Text>
            <Text style={styles.paragraph}>
              • {t('threatened')}&nbsp;&nbsp;&nbsp;
              <View style={{ color: 'green' }}>
                <Text>■</Text>
              </View>
            </Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.paragraph}>{t('isz_6')}</Text>
          </View>
          <View style={styles.section}>
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
