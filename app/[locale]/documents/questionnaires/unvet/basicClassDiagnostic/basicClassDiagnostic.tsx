'use client';

import { Page, Document, Font, PDFViewer, View, Image, Text } from '@react-pdf/renderer';
import { useTranslations } from 'next-intl';

import styles from '../../styles';
import PdfColumn from '../../../../../../templates/pdf/components/pdfColumn';
import { getCategoryColorByKey } from '@/utils/colors';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { categoriesArray } from '@/utils/categories';
import { documentFontOptions } from '../../../fonts';
import 'chartjs-plugin-datalabels';
import { Categories, Count, Options } from '@/utils/reports/unvet/bcd/bcd.model';

export default function BasicClassDiagnostic({
  barChart,
  reviewGivenChart,
  reviewObtainedChart,
  reviewMeToMyselfChart,
  reviewOthersToMyselfChart,
  idealMeChart,
  rejectedMeChart,
  reviewMeToMyselfGNRChart,
  reviewOthersToMyselfGNRChart,
  idealMeGNRChart,
  rejectedMeGNRChart,
  info,
  tableResults
}: {
  barChart: string;
  reviewGivenChart: string;
  reviewObtainedChart: string;
  reviewMeToMyselfChart: string;
  reviewOthersToMyselfChart: string;
  idealMeChart: string;
  rejectedMeChart: string;
  reviewMeToMyselfGNRChart: string;
  reviewOthersToMyselfGNRChart: string;
  idealMeGNRChart: string;
  rejectedMeGNRChart: string;
  info: {
    schoolName: string;
    questionnaireName: string;
    questionnaireShortName: string;
    className: string;
    schoolYear: string;
    pupilsTotal: number;
    pupilsCompleted: number;
    dateCreated: Date;
    dateClosed: Date | null;
    genderRequired: boolean;
    nationalityRequired: boolean;
  };
  tableResults: {
    optionsTotal: number;
    categories: Categories;
    options: Options;
  };
}) {
  const genderRequired = info.genderRequired;
  //const nationalityRequired = true;

  Font.register(documentFontOptions);

  const t = useTranslations('documents.questionnaires.unvet.basic_class_diagnostic');
  const tGeneral = useTranslations('documents.questionnaires.unvet.general');
  const tCommon = useTranslations('documents.questionnaires.common');
  const tFindings = useTranslations('documents.questionnaires.findings');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const tIndexes = useTranslations('documents.questionnaires.indexes');

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
                <Text>{info.schoolName}</Text>
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
                <Text>{info.className}</Text>
              </PdfColumn>
              <PdfColumn width="25%">
                <Text style={styles.bold}>{tCommon('school_year')}:</Text>
              </PdfColumn>
              <PdfColumn width="25%">
                <Text>{info.schoolYear}</Text>
              </PdfColumn>
            </View>
            <View style={{ flexDirection: 'row', marginBottom: 3 }}>
              <PdfColumn width="20%">
                <Text style={styles.bold}>{tCommon('class_pupil_count')}:</Text>
              </PdfColumn>
              <PdfColumn width="30%">
                <Text>{info.pupilsTotal}</Text>
              </PdfColumn>
              <PdfColumn width="25%">
                <Text style={styles.bold}>{tCommon('enrolled_pupil_count')}:</Text>
              </PdfColumn>
              <PdfColumn width="25%">
                <Text>{info.pupilsCompleted}</Text>
              </PdfColumn>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <PdfColumn width="20%">
                <Text style={styles.bold}>{tCommon('date_from')}:</Text>
              </PdfColumn>
              <PdfColumn width="30%">
                <Text>{info.dateCreated.toLocaleDateString('cs-CZ')}</Text>
              </PdfColumn>
              <PdfColumn width="25%">
                <Text style={styles.bold}>{tCommon('date_to')}:</Text>
              </PdfColumn>
              <PdfColumn width="25%">
                <Text>{info.dateClosed?.toLocaleDateString('cs-CZ')}</Text>
              </PdfColumn>
            </View>

            <View style={styles.line}></View>
          </View>

          {/* -------------------------------------------------- ZÁKLADNÍ POPIS --------------------------------------------------*/}
          {/* --------------------------------------------------------------------------------------------------------------------*/}

          <View style={styles.section}>
            <Text style={styles.paragraph}>
              {t.rich('unvet_1', {
                strong: (chunks) => <Text style={styles.bold}>{chunks}</Text>
              })}
            </Text>
            <Text style={styles.paragraph}>
              {t.rich('unvet_2', {
                strong: (chunks) => <Text style={styles.bold}>{chunks}</Text>
              })}
            </Text>
            <Text style={styles.paragraph}>
              {t.rich('unvet_3', {
                strong: (chunks) => <Text style={styles.bold}>{chunks}</Text>
              })}
            </Text>
            <Text style={styles.paragraph}>
              {t.rich('unvet_4', {
                strong: (chunks) => <Text style={styles.bold}>{chunks}</Text>
              })}
            </Text>
          </View>

          {/* -------------------------------------------------- ZJIŠTĚNÍ --------------------------------------------------*/}
          {/* --------------------------------------------------------------------------------------------------------------*/}

          <View style={styles.section} break>
            <Text style={styles.subsubheading}>{t('graph_basic_structure')}</Text>

            <View>
              {/* eslint-disable-next-line jsx-a11y/alt-text */}
              <Image src={`${barChart}`} />
            </View>

            <View style={{ marginBottom: 20 }}>
              <Text style={styles.bold}>{tCommon('legend')}</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 5 }}>
                {Object.entries(categoriesArray).map(([letter], index, letters) => (
                  <Text key={index}>
                    {letter} - {tFindings(`${letter}.name`)}
                    {index < letters.length - 1 && ', '}
                  </Text>
                ))}
              </View>
            </View>

            <Text style={styles.subheading}>{t('findings')}</Text>

            <Text style={styles.subsubheading}>{t('most_used_categories')}</Text>

            {Object.entries(tableResults.categories)
              .sort((a, b) => b[1].total - a[1].total)
              .slice(0, 3)
              .map(([category, value], index) => (
                <View key={index}>
                  <Text style={styles.bold}>
                    {category}: {tFindings(category + '.name')} -{' '}
                    {((value.total / tableResults.optionsTotal) * 100 || 0).toFixed(0)} %
                  </Text>
                  {Object.entries(tableResults.options)
                    .filter(([option]) => option[0] === category)
                    .sort((a, b) => b[1].total - a[1].total)
                    .slice(0, 1)
                    .map(([option]) => (
                      <>
                        <Text style={{ marginVertical: 5 }}>
                          {t('most_involved_subcategory')}{' '}
                          <Text style={styles.bold}>
                            {option}: {tFindings(`${category}.${option}.name`)}
                          </Text>
                        </Text>
                        <Text style={styles.paragraph}>
                          <Text style={styles.bold}>{t('recommendations')}</Text>
                          {'\n'}
                          <Text>{tFindings(`${category}.${option}.finding`)}</Text>
                          {'\n'}
                          <Text>{tFindings(`${category}.${option}.recommendation`)}</Text>
                        </Text>
                      </>
                    ))}
                </View>
              ))}
          </View>

          {/* -------------------------------------------------- KRÁSNÁ VELKÁ TABULKA --------------------------------------------------*/}
          {/* --------------------------------------------------------------------------------------------------------------------------*/}

          <View style={styles.section} break>
            <Text style={styles.subsubheading}>{t('table_heading')}</Text>

            <View style={styles.tableFirstRow}>
              <Text style={styles.cellCategoryHeader}>{t('category_subcategory')}</Text>
              <Text style={styles.cellChoiceCountHeader}>{t('choices_count')}</Text>
            </View>

            {Object.entries(tableResults.categories).map(([category, value]: [string, Count], index, entries) => (
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
                        {((value.total / tableResults.optionsTotal) * 100 || 0).toFixed(0)} %
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
                        {((value.total / tableResults.optionsTotal) * 100 || 0).toFixed(0)} %
                      </Text>
                      <Text style={styles.cellCategoryNameCountGNR}>{value.total}</Text>
                    </>
                  )}
                </View>

                {Object.entries(tableResults.options)
                  .filter(([option]) => option.includes(category))
                  .map(([option, optionValue]: [string, Count], optionIndex) => (
                    <View
                      key={optionIndex}
                      style={index !== entries.length - 1 && optionIndex === 2 ? styles.tableRowLast : styles.tableRow}
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
            ))}
          </View>

          {/* -------------------------------------------------- GRAFY VOLEB --------------------------------------------------*/}
          {/* -----------------------------------------------------------------------------------------------------------------*/}

          {genderRequired && (
            <View style={styles.section} break>
              <Text style={styles.subsubheading}>{t('rating_obtained')}</Text>
              <View style={{ marginBottom: 20 }}>
                {/* eslint-disable-next-line jsx-a11y/alt-text */}
                <Image src={`${reviewObtainedChart}`} />
              </View>

              <View style={{ marginBottom: 20 }}>
                <Text style={styles.bold}>{tCommon('legend')}</Text>
                <View
                  style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    marginTop: 5
                  }}
                >
                  {Object.entries(categoriesArray).map(([letter], index, letters) => (
                    <Text key={index}>
                      {letter} - {tFindings(`${letter}.name`)}
                      {index < letters.length - 1 && ', '}
                    </Text>
                  ))}
                </View>
              </View>

              <Text style={styles.subsubheading}>{t('rating_given')}</Text>
              <View>
                {/* eslint-disable-next-line jsx-a11y/alt-text */}
                <Image src={`${reviewGivenChart}`} />
              </View>
            </View>
          )}

          {/* -------------------------------------------------- DOPORUČENÍ --------------------------------------------------*/}
          {/* ----------------------------------------------------------------------------------------------------------------*/}

          {/* <View style={styles.section} break>
            <Text style={styles.subheading}>{t('social_index_heading')}</Text>

            <Text style={styles.paragraph}>
              {t.rich('social_index_description', {
                strong: (chunks) => <Text style={styles.bold}>{chunks}</Text>
              })}
            </Text>

            <Text style={{ marginTop: 10, ...styles.subsubheading }}>
              {t('class_structure_table_heading')}
            </Text>

            <View
              style={{
                flexDirection: 'row',
                fontWeight: 700,
                fontSize: 11,
                paddingVertical: 5
              }}
            >
              <View style={{ paddingHorizontal: 5, width: '10%' }}>
                <Text>{tIndexes('grade')}</Text>
              </View>
              <View style={{ paddingHorizontal: 5, width: '24%' }}>
                <Text>{tIndexes('social_involvement')}</Text>
              </View>
              <View style={{ paddingHorizontal: 5, width: '46%' }}>
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
                    <Text style={{ textAlign: 'center' }}>
                      {tIndexes('pupil_count')}
                    </Text>
                  </View>
                  <View style={{ flexDirection: 'row' }}>
                    <Text style={{ width: '34%', textAlign: 'center' }}>Σ</Text>
                    <Text style={{ width: '33%', textAlign: 'center' }}>
                      CH
                    </Text>
                    <Text style={{ width: '33%', textAlign: 'center' }}>D</Text>
                  </View>
                </View>
              )}
              {!genderRequired && (
                <View style={{ paddingHorizontal: 5, width: '20%' }}>
                  <Text style={{ textAlign: 'center' }}>
                    {tIndexes('pupil_count')}
                  </Text>
                </View>
              )}
            </View>

            {Object.entries(index.tiers).map(
              ([key, value]: [
                string,
                {
                  gender: {
                    1: number;
                    2: number;
                  };
                }
              ]) => (
                <View
                  key={
                    indexesArray.find((props) => props.tier === Number(key))
                      ?.indexCode
                  }
                  style={{
                    flexDirection: 'row',
                    fontSize: 10,
                    paddingVertical: 3,
                    backgroundColor: indexesArray.find(
                      (props) => props.tier === Number(key)
                    )?.color
                  }}
                >
                  <View style={{ width: '10%', ...styles.cellVerticalMiddle }}>
                    <Text>
                      {
                        indexesArray.find((props) => props.tier === Number(key))
                          ?.indexCode
                      }
                    </Text>
                  </View>
                  <View style={{ width: '24%', ...styles.cellVerticalMiddle }}>
                    <Text style={{ textTransform: 'uppercase' }}>
                      {tIndexes(
                        `${indexesArray.find(
                          (props) => props.tier === Number(key)
                        )?.indexCode}.name`
                      )}
                    </Text>
                  </View>
                  <View
                    style={{
                      width: '46%',
                      lineHeight: 1.5,
                      ...styles.cellVerticalMiddle
                    }}
                  >
                    <Text>
                      {tIndexes.rich(
                        `${indexesArray.find(
                          (props) => props.tier === Number(key)
                        )?.indexCode}.description`,
                        {
                          strong: (chunks) => (
                            <Text style={styles.bold}>{chunks}</Text>
                          )
                        }
                      )}
                    </Text>
                  </View>

                  <View style={{ width: '20%', ...styles.cellVerticalMiddle }}>
                    {genderRequired && (
                      <View style={{ flexDirection: 'column' }}>
                        <View style={{ flexDirection: 'row' }}>
                          <Text style={{ width: '34%', textAlign: 'center' }}>
                            {value.gender[1] + value.gender[2]}
                          </Text>
                          <Text style={{ width: '33%', textAlign: 'center' }}>
                            {value.gender[1]}
                          </Text>
                          <Text style={{ width: '33%', textAlign: 'center' }}>
                            {value.gender[2]}
                          </Text>
                        </View>
                      </View>
                    )}
                    {!genderRequired && (
                      <Text style={{ textAlign: 'center', width: '100%' }}>
                        {value.gender[1] + value.gender[2]}
                      </Text>
                    )}
                  </View>
                </View>
              )
            )}

            <Text style={{ marginTop: 30, ...styles.subsubheading }}>
              {t('class_index_table_heading')}
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
                <Text>{index.index.tier.acceptance}</Text>
              </View>
              <View
                style={{
                  paddingHorizontal: 3,
                  width: '16%',
                  textAlign: 'center'
                }}
              >
                <Text>{index.index.tier.involvement}</Text>
              </View>
              <View
                style={{
                  paddingHorizontal: 3,
                  width: '16%',
                  textAlign: 'center'
                }}
              >
                <Text>{index.index.tier.safety}</Text>
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
                      (props) => props.tier === index.index.tier.value
                    )?.color,
                    paddingVertical: 1,
                    paddingHorizontal: 2
                  }}
                >
                  {index.index.value.toFixed(3)} -{' '}
                  {tIndexes(
                    `${
                      indexesArray.find(
                        (props) => props.tier === index.index.tier.value
                      )?.indexCode || 0
                    }.name`
                  )}
                </Text>
              </View>
            </View>
          </View> */}

          {/* -------------------------------------------------- GRAFY "JÁ", "OSTATNÍ" --------------------------------------------------*/}
          {/* ---------------------------------------------------------------------------------------------------------------------------*/}

          {genderRequired && (
            <>
              <View style={styles.section} break>
                <Text style={styles.subheading}>{t('reviews_heading')}</Text>
                <Text style={styles.subsubheading}>{t('review_me_to_myself')}</Text>
                <View style={{ marginBottom: 10 }}>
                  {/* eslint-disable-next-line jsx-a11y/alt-text */}
                  <Image src={`${reviewMeToMyselfChart}`} />
                </View>
                <Text style={{ marginBottom: 20 }}>{t('review_me_to_myself_desc')}</Text>

                <View style={{ marginBottom: 20 }}>
                  <Text style={styles.bold}>{tCommon('legend')}</Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      flexWrap: 'wrap',
                      marginTop: 5
                    }}
                  >
                    {Object.entries(categoriesArray).map(([letter], index, letters) => (
                      <Text key={index}>
                        {letter} - {tFindings(`${letter}.name`)}
                        {index < letters.length - 1 && ', '}
                      </Text>
                    ))}
                  </View>
                </View>

                <Text style={styles.subsubheading}>{t('review_others_to_myself')}</Text>
                <View style={{ marginBottom: 10 }}>
                  {/* eslint-disable-next-line jsx-a11y/alt-text */}
                  <Image src={`${reviewOthersToMyselfChart}`} />
                </View>
                <Text>{t('review_others_to_myself_desc')}</Text>
              </View>

              <View style={styles.section} break>
                <Text style={styles.subsubheading}>{t('ideal_me')}</Text>
                <View style={{ marginBottom: 10 }}>
                  {/* eslint-disable-next-line jsx-a11y/alt-text */}
                  <Image src={`${idealMeChart}`} />
                </View>
                <Text style={{ marginBottom: 20 }}>{t('ideal_me_desc')}</Text>

                <View style={{ marginBottom: 20 }}>
                  <Text style={styles.bold}>{tCommon('legend')}</Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      flexWrap: 'wrap',
                      marginTop: 5
                    }}
                  >
                    {Object.entries(categoriesArray).map(([letter], index, letters) => (
                      <Text key={index}>
                        {letter} - {tFindings(`${letter}.name`)}
                        {index < letters.length - 1 && ', '}
                      </Text>
                    ))}
                  </View>
                </View>

                <Text style={styles.subsubheading}>{t('rejected_me')}</Text>
                <View style={{ marginBottom: 10 }}>
                  {/* eslint-disable-next-line jsx-a11y/alt-text */}
                  <Image src={`${rejectedMeChart}`} />
                </View>
                <Text>{t('rejected_me_desc')}</Text>
              </View>
            </>
          )}

          {!genderRequired && (
            <>
              <View style={styles.section} break>
                <Text style={styles.subheading}>{t('reviews_heading')}</Text>
                <Text style={styles.subsubheading}>{t('review_me_to_myself_gnr')}</Text>
                <View style={{ marginBottom: 10 }}>
                  {/* eslint-disable-next-line jsx-a11y/alt-text */}
                  <Image src={`${reviewMeToMyselfGNRChart}`} />
                </View>
                <Text style={{ marginBottom: 30 }}>{t('review_me_to_myself_desc')}</Text>

                <View style={{ marginBottom: 20 }}>
                  <Text style={styles.bold}>{tCommon('legend')}</Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      flexWrap: 'wrap',
                      marginTop: 5
                    }}
                  >
                    {Object.entries(categoriesArray).map(([letter], index, letters) => (
                      <Text key={index}>
                        {letter} - {tFindings(`${letter}.name`)}
                        {index < letters.length - 1 && ', '}
                      </Text>
                    ))}
                  </View>
                </View>

                <Text style={styles.subsubheading}>{t('review_others_to_myself_gnr')}</Text>
                <View style={{ marginBottom: 10 }}>
                  {/* eslint-disable-next-line jsx-a11y/alt-text */}
                  <Image src={`${reviewOthersToMyselfGNRChart}`} />
                </View>
                <Text>{t('review_others_to_myself_desc')}</Text>
              </View>

              <View style={styles.section} break>
                <Text style={styles.subsubheading}>{t('ideal_me_gnr')}</Text>
                <View style={{ marginBottom: 10 }}>
                  {/* eslint-disable-next-line jsx-a11y/alt-text */}
                  <Image src={`${idealMeGNRChart}`} />
                </View>
                <Text style={{ marginBottom: 30 }}>{t('ideal_me_desc')}</Text>

                <View style={{ marginBottom: 20 }}>
                  <Text style={styles.bold}>{tCommon('legend')}</Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      flexWrap: 'wrap',
                      marginTop: 5
                    }}
                  >
                    {Object.entries(categoriesArray).map(([letter], index, letters) => (
                      <Text key={index}>
                        {letter} - {tFindings(`${letter}.name`)}
                        {index < letters.length - 1 && ', '}
                      </Text>
                    ))}
                  </View>
                </View>

                <Text style={styles.subsubheading}>{t('rejected_me_gnr')}</Text>
                <View style={{ marginBottom: 10 }}>
                  {/* eslint-disable-next-line jsx-a11y/alt-text */}
                  <Image src={`${rejectedMeGNRChart}`} />
                </View>
                <Text>{t('rejected_me_desc')}</Text>
              </View>
            </>
          )}

          {/* ----------------------------------------------- NAVAZUJÍCÍ PRÁCE SE TŘÍDOU -----------------------------------------------*/}
          {/* --------------------------------------------------------------------------------------------------------------------------*/}

          <View style={styles.section} break>
            <Text style={styles.subheading}>{t('work')}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.paragraph}>
              {t.rich('citation', {
                strong: (chunks) => <Text style={styles.bold}>{chunks}</Text>
              })}
            </Text>
            <Text style={styles.paragraph}>
              {t.rich('work_1', {
                strong: (chunks) => <Text style={styles.bold}>{chunks}</Text>
              })}
            </Text>
            <Text style={styles.paragraph}>
              {t.rich('work_2', {
                strong: (chunks) => <Text style={styles.bold}>{chunks}</Text>
              })}
            </Text>
          </View>

          <View style={styles.section}>
            {Object.entries(categoriesArray).map(([letter]) => (
              <View style={{ marginTop: 5, marginBottom: 5 }} key={letter}>
                <Text style={styles.paragraph}>
                  {letter}: {tFindings(`${letter}.q`)} ({letter}: {tFindings(`${letter}.name`)})
                  {'\u00A0\u00A0\u00A0\u00A0'}
                  <Text style={styles.bold}>{tFindings(`${letter}.a`)}</Text>
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
