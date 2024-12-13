'use client';

import { Page, Document, Font, PDFViewer, View, Image, Text } from '@react-pdf/renderer';
import { useTranslations } from 'next-intl';

import styles from '../../styles';
import PdfColumn from '../../../../../../templates/pdf/components/pdfColumn';
import { documentFontOptions } from '../../../fonts';
import { getCategoryColorByKey } from '@/utils/colors';
import { Count, UnvetPupilCardResult } from '@/utils/reports/unvet/card/card.model';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { indexesArray } from '@/utils/categories';

export default function PupilCard({
  genderRequired,
  doughnutChartTotal,
  doughnutChartBoys,
  doughnutChartGirls,
  result
}: {
  genderRequired: boolean;
  doughnutChartTotal: string;
  doughnutChartBoys: string;
  doughnutChartGirls: string;
  result: UnvetPupilCardResult;
}) {
  Font.register(documentFontOptions);

  const t = useTranslations('documents.questionnaires.unvet.pupil_card');
  const tGeneral = useTranslations('documents.questionnaires.unvet.general');
  const tCommon = useTranslations('documents.questionnaires.common');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const tIndexes = useTranslations('documents.questionnaires.indexes');
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
            <Text style={styles.heading}>
              {t('heading')} <Text style={styles.bold}>{result.info.pupil.name || result.info.pupil.number}</Text>
            </Text>
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
              {t.rich('kz_1', {
                strong: (chunks) => <Text style={styles.bold}>{chunks}</Text>
              })}
            </Text>

            <Text style={styles.paragraph}>
              {t.rich('kz_2', {
                strong: (chunks) => <Text style={styles.bold}>{chunks}</Text>
              })}
            </Text>

            <Text style={styles.paragraph}>
              {t.rich('kz_3', {
                strong: (chunks) => <Text style={styles.bold}>{chunks}</Text>
              })}
            </Text>

            <Text style={styles.paragraph}>
              {t.rich('kz_4', {
                strong: (chunks) => <Text style={styles.bold}>{chunks}</Text>
              })}
            </Text>

            <Text style={styles.paragraph}>
              {t.rich('kz_5', {
                strong: (chunks) => <Text style={styles.bold}>{chunks}</Text>
              })}
            </Text>

            <Text style={styles.paragraph}>
              {t.rich('kz_6', {
                strong: (chunks) => <Text style={styles.bold}>{chunks}</Text>
              })}
            </Text>

            <Text style={styles.paragraph}>
              {t.rich('kz_7', {
                strong: (chunks) => <Text style={styles.bold}>{chunks}</Text>
              })}
            </Text>

            <Text style={styles.paragraph}>
              {t.rich('kz_8', {
                strong: (chunks) => <Text style={styles.bold}>{chunks}</Text>
              })}
            </Text>
          </View>

          {/* --------------------------------------- SEBEHODNOCENÍ ŽÁKA ------------------------------------------*/}
          {/* -----------------------------------------------------------------------------------------------------*/}

          <View style={styles.section} break>
            <Text style={styles.subheading}>{t('self_review')}</Text>

            <View style={{ flexDirection: 'row', marginBottom: 10 }}>
              <View style={{ width: '50%' }}>
                <Text style={styles.subsubheading}>{t('1')}</Text>
                {result.results.options[1].map((option, index) => (
                  <Text key={index} style={{ textAlign: 'center' }}>
                    {tFindings(`${option[0]}.${option}.code`)}: {tFindings(`${option[0]}.${option}.name`)}
                  </Text>
                ))}
              </View>
              <View style={{ width: '50%' }}>
                <Text style={styles.subsubheading}>{t('2')}</Text>
                {result.results.options[2].map((option, index) => (
                  <Text key={index} style={{ textAlign: 'center' }}>
                    {tFindings(`${option[0]}.${option}.code`)}: {tFindings(`${option[0]}.${option}.name`)}
                  </Text>
                ))}
              </View>
            </View>

            <View style={{ flexDirection: 'row', marginBottom: 10 }}>
              <View style={{ width: '50%' }}>
                <Text style={styles.subsubheading}>{t('3')}</Text>
                {result.results.options[3].map((option, index) => (
                  <Text key={index} style={{ textAlign: 'center' }}>
                    {tFindings(`${option[0]}.${option}.code`)}: {tFindings(`${option[0]}.${option}.name`)}
                  </Text>
                ))}
              </View>
              <View style={{ width: '50%' }}>
                <Text style={styles.subsubheading}>{t('4')}</Text>
                {result.results.options[4].map((option, index) => (
                  <Text key={index} style={{ textAlign: 'center' }}>
                    {tFindings(`${option[0]}.${option}.code`)}: {tFindings(`${option[0]}.${option}.name`)}
                  </Text>
                ))}
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={{ marginTop: 20, ...styles.subsubheading }}>{t('rating_from_pupils')}</Text>

            <View>
              {/* eslint-disable-next-line jsx-a11y/alt-text */}
              <Image src={`${doughnutChartTotal}`} />
            </View>

            {genderRequired && (
              <View break>
                <Text style={styles.subsubheading}>{t('rating_from_boys')}</Text>

                <View>
                  {/* eslint-disable-next-line jsx-a11y/alt-text */}
                  <Image src={`${doughnutChartBoys}`} />
                </View>

                <Text style={{ marginTop: 30, ...styles.subsubheading }}>{t('rating_from_girls')}</Text>

                <View>
                  {/* eslint-disable-next-line jsx-a11y/alt-text */}
                  <Image src={`${doughnutChartGirls}`} />
                </View>
              </View>
            )}
          </View>

          {/* -------------------------------------------------------- KOMENTÁŘE -------------------------------------------------------*/}
          {/* --------------------------------------------------------------------------------------------------------------------------*/}

          {/* <View style={styles.section} break>
            <Text style={styles.subheading}>{t('comments')}</Text>

            <View style={{ marginTop: 20, ...styles.section }}>
              <View style={{ flexDirection: 'row', marginBottom: 4 }}>
                <Text>
                  {result.results.comments.map((comment, index) => (
                    <Text key={index} style={{ marginHorizontal: 8 }}>
                      • {comment}
                    </Text>
                  ))}
                </Text>
              </View>
            </View>
          </View> */}

          {/* -------------------------------------------------- KRÁSNÁ VELKÁ TABULKA --------------------------------------------------*/}
          {/* --------------------------------------------------------------------------------------------------------------------------*/}

          <View style={styles.section} break>
            <Text style={styles.subsubheading}>{t('table_heading')}</Text>

            <View style={styles.tableFirstRow}>
              <Text style={styles.cellCategoryHeader}>{t('category_subcategory')}</Text>
              <Text style={styles.cellChoiceCountHeader}>{t('choices_count')}</Text>
            </View>

            {Object.entries(result.results.categories.fromOthers).map(
              ([category, value]: [string, Count], index, entries) => (
                <View key={index}>
                  <View
                    style={{
                      borderColor: getCategoryColorByKey(category),
                      ...styles.tableRowCategory
                    }}
                  >
                    <Text style={styles.cellCategoryName}>
                      {category}: {tFindings(`${category}.name`)}
                    </Text>
                    {genderRequired && (
                      <>
                        <Text style={styles.cellCategoryNamePercentGR}>
                          {((value.total / result.results.options.fromOthersTotal) * 100 || 0).toFixed(0)} %
                        </Text>
                        <Text style={styles.cellCategoryNameCountGR}>{value.total}</Text>
                        <Text style={styles.cellCategoryNameCountMenGR}>{value.gender[1]}</Text>
                        <Text style={styles.cellCategoryNameCountWomenGR}>{value.gender[2]}</Text>
                        <Text style={styles.cellCategoryNameCountOtherGR}>{value.gender[3]}</Text>
                      </>
                    )}
                    {!genderRequired && (
                      <>
                        <Text style={styles.cellCategoryNamePercentGNR}>
                          {((value.total / result.results.options.fromOthersTotal) * 100 || 0).toFixed(0)} %
                        </Text>
                        <Text style={styles.cellCategoryNameCountGNR}>{value.total}</Text>
                      </>
                    )}
                  </View>

                  {Object.entries(result.results.options.fromOthers)
                    .filter(([option]) => option.includes(category))
                    .map(([option, optionValue]: [string, Count], optionIndex) => (
                      <View
                        key={optionIndex}
                        style={
                          index !== entries.length - 1 && optionIndex === 2 ? styles.tableRowLast : styles.tableRow
                        }
                      >
                        <Text style={styles.cellCategoryPart}>
                          {tFindings(`${category}.${option}.code`)} {tFindings(`${category}.${option}.name`)}
                        </Text>
                        {genderRequired && (
                          <>
                            <Text style={styles.cellCategoryPartPercentGR}>
                              {((optionValue.total / value.total) * 100 || 0).toFixed(0)} %
                            </Text>
                            <Text style={styles.cellCategoryPartCountGR}>{optionValue.total}</Text>
                            <Text style={styles.cellCategoryPartCountMenGR}>{optionValue.gender[1]}</Text>
                            <Text style={styles.cellCategoryPartCountWomenGR}>{optionValue.gender[2]}</Text>
                            <Text style={styles.cellCategoryPartCountOtherGR}>{optionValue.gender[3]}</Text>
                          </>
                        )}
                        {!genderRequired && (
                          <>
                            <Text style={styles.cellCategoryPartPercentGNR}>
                              {((optionValue.total / value.total) * 100 || 0).toFixed(0)} %
                            </Text>
                            <Text style={styles.cellCategoryPartCountGNR}>{optionValue.total}</Text>
                          </>
                        )}
                      </View>
                    ))}
                </View>
              )
            )}
          </View>

          {/* ---------------------------------------- INDEX SOC. Z., ZJIŠTENÍ --------------------------------------------------*/}
          {/* -------------------------------------------------------------------------------------------------------------------*/}

          {/* <View style={styles.section} break>
            <Text style={styles.subheading}>{t('social_index_heading')}</Text>

            <Text style={{ marginTop: 10, ...styles.subsubheading }}>
              {t('pupil_index_table_heading')}
            </Text>

            <View
              style={{
                flexDirection: 'row',
                fontWeight: 700,
                fontSize: 11,
                paddingVertical: 5
              }}
            >
              <View
                style={{
                  paddingHorizontal: 5,
                  width: '16%',
                  textAlign: 'center'
                }}
              >
                <Text>{tIndexes('acceptance')}</Text>
              </View>
              <View
                style={{
                  paddingHorizontal: 5,
                  width: '16%',
                  textAlign: 'center'
                }}
              >
                <Text>{tIndexes('involvement')}</Text>
              </View>
              <View
                style={{
                  paddingHorizontal: 5,
                  width: '16%',
                  textAlign: 'center'
                }}
              >
                <Text>{tIndexes('safety')}</Text>
              </View>
              <View
                style={{
                  paddingHorizontal: 5,
                  width: '52%',
                  textAlign: 'center'
                }}
              >
                <Text>{tIndexes('class_index')}</Text>
              </View>
            </View>

            <View style={{ flexDirection: 'row', paddingVertical: 5 }}>
              <View
                style={{
                  paddingHorizontal: 3,
                  width: '16%',
                  textAlign: 'center'
                }}
              >
                <Text>{result.results.index.tier.acceptance}</Text>
              </View>
              <View
                style={{
                  paddingHorizontal: 3,
                  width: '16%',
                  textAlign: 'center'
                }}
              >
                <Text>{result.results.index.tier.involvement}</Text>
              </View>
              <View
                style={{
                  paddingHorizontal: 3,
                  width: '16%',
                  textAlign: 'center'
                }}
              >
                <Text>{result.results.index.tier.safety}</Text>
              </View>
              <View
                style={{
                  paddingHorizontal: 3,
                  width: '52%',
                  textAlign: 'center'
                }}
              >
                <Text
                  style={{
                    fontWeight: 'bold',
                    backgroundColor: indexesArray.find(
                      (props) => props.tier === result.results.index.tier.value
                    )?.color,
                    paddingVertical: 1,
                    paddingHorizontal: 2
                  }}
                >
                  {result.results.index.value.toFixed(3)} -{' '}
                  {tIndexes(
                    `${
                      indexesArray.find(
                        (props) =>
                          props.tier === result.results.index.tier.value
                      )?.indexCode || 0
                    }.name`
                  )}
                </Text>
              </View>
            </View>
          </View> */}

          <View style={{ marginTop: 20, ...styles.section }}>
            <Text style={styles.subheading}>{t('findings')}</Text>

            <Text style={styles.subsubheadingleft}>{t('strenghts')}</Text>

            {result.results.factors.strengths.map((option, index) => (
              <View key={index} style={{ flexDirection: 'row', marginBottom: 4 }}>
                <Text>
                  <Text style={{ marginHorizontal: 8 }}>•</Text> {tFindings(`${option[0]}.${option}.description`)}{' '}
                  <Text style={styles.bold}>
                    (
                    {(
                      (result.results.options.fromOthers[option].total / result.results.options.fromOthersTotal) *
                      100
                    ).toFixed(0)}
                    {'% '}
                    {tFindings(`${option[0]}.${option}.code`)} - {tFindings(`${option[0]}.${option}.name`)})
                  </Text>
                </Text>
              </View>
            ))}

            <Text style={{ marginTop: 10, ...styles.subsubheadingleft }}>{t('risk_factors')}</Text>

            {result.results.factors.risks.map((option, index) => (
              <View key={index} style={{ flexDirection: 'row', marginBottom: 4 }}>
                <Text>
                  <Text style={{ marginHorizontal: 8 }}>•</Text> {tFindings(`${option[0]}.${option}.description`)}{' '}
                  <Text style={styles.bold}>
                    (
                    {(
                      (result.results.options.fromOthers[option].total / result.results.options.fromOthersTotal) *
                      100
                    ).toFixed(0)}
                    {'% '}
                    {tFindings(`${option[0]}.${option}.code`)} - {tFindings(`${option[0]}.${option}.name`)})
                  </Text>
                </Text>
              </View>
            ))}

            <Text style={{ marginTop: 10, ...styles.subsubheadingleft }}>{t('threatening_factors')}</Text>

            {result.results.factors.threats.map((option, index) => (
              <View key={index} style={{ flexDirection: 'row', marginBottom: 4 }}>
                <Text>
                  <Text style={{ marginHorizontal: 8 }}>•</Text> {tFindings(`${option[0]}.${option}.description`)}{' '}
                  <Text style={styles.bold}>
                    (
                    {(
                      (result.results.options.fromOthers[option].total / result.results.options.fromOthersTotal) *
                      100
                    ).toFixed(0)}
                    {'% '}
                    {tFindings(`${option[0]}.${option}.code`)} - {tFindings(`${option[0]}.${option}.name`)})
                  </Text>
                </Text>
              </View>
            ))}

            <Text style={{ marginTop: 20, ...styles.subheading }}>{t('recommendations_pupil')}</Text>

            <Text style={styles.subsubheadingleft}>
              {t('strenghts')} - {t('how_to_use')}
            </Text>

            {result.results.factors.strengths.map((option, index) => (
              <View key={index} style={{ flexDirection: 'row', marginBottom: 4 }}>
                <Text>
                  <Text style={{ marginHorizontal: 8 }}>•</Text>{' '}
                  {tFindings(`${option[0]}.${option}.recommendation_pupil`)}
                </Text>
              </View>
            ))}

            <Text style={{ marginTop: 10, ...styles.subsubheadingleft }}>
              {t('risk_factors')} - {t('how_to_solve')}
            </Text>

            {result.results.factors.risks.map((option, index) => (
              <View key={index} style={{ flexDirection: 'row', marginBottom: 4 }}>
                <Text>
                  <Text style={{ marginHorizontal: 8 }}>•</Text>{' '}
                  {tFindings(`${option[0]}.${option}.recommendation_pupil`)}
                </Text>
              </View>
            ))}

            <Text style={{ marginTop: 10, ...styles.subsubheadingleft }}>
              {t('threatening_factors')} - {t('how_to_stop')}
            </Text>

            {result.results.factors.threats.map((option, index) => (
              <View key={index} style={{ flexDirection: 'row', marginBottom: 4 }}>
                <Text>
                  <Text style={{ marginHorizontal: 8 }}>•</Text>{' '}
                  {tFindings(`${option[0]}.${option}.recommendation_pupil`)}
                </Text>
              </View>
            ))}

            <Text style={{ marginTop: 20, ...styles.subheading }}>{t('recommendations_teacher')}</Text>

            <Text style={styles.subsubheadingleft}>
              {t('strenghts')} - {t('how_to_use')}
            </Text>

            {result.results.factors.strengths.map((option, index) => (
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

            {result.results.factors.risks.map((option, index) => (
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

            {result.results.factors.threats.map((option, index) => (
              <View key={index} style={{ flexDirection: 'row', marginBottom: 4 }}>
                <Text>
                  <Text style={{ marginHorizontal: 8 }}>•</Text>{' '}
                  {tFindings(`${option[0]}.${option}.recommendation_teacher`)}
                </Text>
              </View>
            ))}

            <Text style={{ marginTop: 20, ...styles.subheading }}>{t('risks')}</Text>

            <Text style={styles.subsubheadingleft}>
              {t('strenghts')} - {t('how_to_use')}
            </Text>

            {result.results.factors.strengths.map((option, index) => (
              <View key={index} style={{ flexDirection: 'row', marginBottom: 4 }}>
                <Text>
                  <Text style={{ marginHorizontal: 8 }}>•</Text> {tFindings(`${option[0]}.${option}.risks`)}
                </Text>
              </View>
            ))}

            <Text style={{ marginTop: 10, ...styles.subsubheadingleft }}>
              {t('risk_factors')} - {t('how_to_solve')}
            </Text>

            {result.results.factors.risks.map((option, index) => (
              <View key={index} style={{ flexDirection: 'row', marginBottom: 4 }}>
                <Text>
                  <Text style={{ marginHorizontal: 8 }}>•</Text> {tFindings(`${option[0]}.${option}.risks`)}
                </Text>
              </View>
            ))}

            <Text style={{ marginTop: 10, ...styles.subsubheadingleft }}>
              {t('threatening_factors')} - {t('how_to_stop')}
            </Text>

            {result.results.factors.threats.map((option, index) => (
              <View key={index} style={{ flexDirection: 'row', marginBottom: 4 }}>
                <Text>
                  <Text style={{ marginHorizontal: 8 }}>•</Text> {tFindings(`${option[0]}.${option}.risks`)}
                </Text>
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
