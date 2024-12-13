'use client';

import { Page, Document, Font, PDFViewer, View, Image, Text } from '@react-pdf/renderer';
import { useTranslations } from 'next-intl';

import styles from '../../styles';
import PdfColumn from '../../../../../../templates/pdf/components/pdfColumn';
import { documentFontOptions } from '../../../fonts';
import { Count, PkuOpinionProfileResult } from '@/utils/reports/pku/profile/profile.model';
import { getTeacherCategoryColorByKey } from '@/utils/colors';

export default function ClassOpinionProfileTeacher({
  chart1,
  chart2,
  chart3,
  chart4,
  result
}: {
  chart1: string;
  chart2: string;
  chart3: string;
  chart4: string;
  result: PkuOpinionProfileResult;
}) {
  const genderRequired = result.info.genderRequired;
  Font.register(documentFontOptions);

  const t = useTranslations('documents.questionnaires.pku.class_opinion_profile_teacher');
  const tTeacherCategories = useTranslations('documents.questionnaires.teacher_categories');
  const tGeneral = useTranslations('documents.questionnaires.pku.general');
  const tCommon = useTranslations('documents.questionnaires.common');

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
            <View>
              {t.rich('desc_7', {
                item: (chunks) => <Text style={styles.itemParagraph}>{chunks}</Text>,
                strong: (chunks) => <Text style={styles.bold}>{chunks}</Text>
              })}
              <Text style={styles.paragraph}>
                {t.rich('desc_8', {
                  strong: (chunks) => <Text style={styles.bold}>{chunks}</Text>
                })}
              </Text>
            </View>
            <Text style={styles.paragraph}>
              {t.rich('desc_9', {
                strong: (chunks) => <Text style={styles.bold}>{chunks}</Text>
              })}
            </Text>
          </View>

          <View style={styles.section} break>
            <Text style={styles.subsubheading}>{t('uses')}</Text>
            <Text style={styles.itemParagraph}>
              {t.rich('u_1', {
                strong: (chunks) => <Text style={styles.bold}>{chunks}</Text>
              })}
            </Text>
            <Text style={styles.itemParagraph}>
              {t.rich('u_2', {
                strong: (chunks) => <Text style={styles.bold}>{chunks}</Text>
              })}
            </Text>
            <Text style={styles.itemParagraph}>
              {t.rich('u_3', {
                strong: (chunks) => <Text style={styles.bold}>{chunks}</Text>
              })}
            </Text>
            <Text style={styles.itemParagraph}>
              {t.rich('u_4', {
                strong: (chunks) => <Text style={styles.bold}>{chunks}</Text>
              })}
            </Text>
            <Text style={styles.itemParagraph}>
              {t.rich('u_5', {
                strong: (chunks) => <Text style={styles.bold}>{chunks}</Text>
              })}
            </Text>
            <Text style={styles.itemParagraph}>
              {t.rich('u_6', {
                strong: (chunks) => <Text style={styles.bold}>{chunks}</Text>
              })}
            </Text>
            <Text style={styles.itemParagraph}>
              {t.rich('u_7', {
                strong: (chunks) => <Text style={styles.bold}>{chunks}</Text>
              })}
            </Text>
          </View>

          {/* ---------------------------------------------- KATEGORIE 1 --------------------------------------------------*/}
          {/* -------------------------------------------------------------------------------------------------------------*/}

          <View style={styles.section} break>
            <Text style={styles.subheading}>{t('cat_1_h')}</Text>
            <Text style={styles.paragraph}>
              {t.rich('cat_1_desc_1', {
                strong: (chunks) => <Text style={styles.bold}>{chunks}</Text>
              })}
            </Text>
            <Text style={styles.paragraph}>
              {t.rich('cat_1_desc_2', {
                strong: (chunks) => <Text style={styles.bold}>{chunks}</Text>
              })}
            </Text>

            <Text style={{ marginTop: 10, ...styles.subsubheading }}>{t('cat_1_graph')}</Text>

            <Text style={styles.paragraph}>
              {t.rich('cat_1_graph_desc_1', {
                strong: (chunks) => <Text style={styles.bold}>{chunks}</Text>
              })}
            </Text>

            <Text style={styles.paragraph}>
              {t.rich('cat_1_graph_desc_2', {
                strong: (chunks) => <Text style={styles.bold}>{chunks}</Text>
              })}
            </Text>

            <View style={{ marginBottom: 30 }}>
              {/* eslint-disable-next-line jsx-a11y/alt-text */}
              <Image src={`${chart1}`} />
            </View>

            {/* ---- KRÁSNÁ TABULKA ----*/}
            {/* ------------------------*/}

            <View style={styles.section} break>
              <Text style={styles.subsubheading}>{t('cat_1_tab')}</Text>

              <View style={styles.tableFirstRow}>
                <Text style={styles.cellCategoryHeader}>{t('category_subcategory')}</Text>
                <Text style={styles.cellChoiceCountHeader}>{t('choices_count')}</Text>
              </View>

              {Object.entries(result.results.questions[1].categories).map(
                ([category, value]: [string, Count], index, entries) => (
                  <View key={index}>
                    <View
                      style={{
                        borderColor: getTeacherCategoryColorByKey(category),
                        ...styles.tableRowCategory
                      }}
                    >
                      <Text style={styles.cellCategoryName}>
                        {category}: {tTeacherCategories(`${category}.name`)}
                      </Text>
                      {genderRequired && (
                        <>
                          <Text style={styles.cellCategoryNamePercentGR}>
                            {((value.total / result.results.questions[1].optionsTotal) * 100 || 0).toFixed(0)} %
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
                            {((value.total / result.results.questions[1].optionsTotal) * 100 || 0).toFixed(0)} %
                          </Text>
                          <Text style={styles.cellCategoryNameCountGNR}>{value.total}</Text>
                        </>
                      )}
                    </View>

                    {Object.entries(result.results.questions[1].options)
                      .filter(([option]) => option.includes(category))
                      .map(([option, optionValue]: [string, Count], optionIndex) => (
                        <View
                          key={optionIndex}
                          style={
                            index !== entries.length - 1 && optionIndex === 3 ? styles.tableRowLast : styles.tableRow
                          }
                        >
                          <Text style={styles.cellCategoryPart}>
                            {tTeacherCategories(`${category}.${option}.code`)}{' '}
                            {tTeacherCategories(`${category}.${option}.desc`)}
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

            <View break>
              <Text style={{ marginTop: 10, ...styles.subsubheading }}>{t('questions')}</Text>

              <View style={styles.section}>
                {t.rich('cat_1_questions', {
                  item: (chunks) => <Text style={styles.itemParagraph}>{chunks}</Text>,
                  strong: (chunks) => <Text style={styles.bold}>{chunks}</Text>
                })}
              </View>

              <Text style={styles.subsubheading}>{t('findings_r')}</Text>

              <View style={styles.section}>
                {t.rich('cat_1_f', {
                  item: (chunks) => <Text style={styles.itemParagraph}>{chunks}</Text>,
                  strong: (chunks) => <Text style={styles.bold}>{chunks}</Text>
                })}
              </View>
            </View>
          </View>

          {/* ---------------------------------------------- KATEGORIE 2 --------------------------------------------------*/}
          {/* -------------------------------------------------------------------------------------------------------------*/}

          <View style={styles.section} break>
            <Text style={styles.subheading}>{t('cat_2_h')}</Text>
            <Text style={styles.paragraph}>
              {t.rich('cat_2_desc_1', {
                strong: (chunks) => <Text style={styles.bold}>{chunks}</Text>
              })}
            </Text>

            <Text style={{ marginTop: 10, ...styles.subsubheading }}>{t('cat_2_graph')}</Text>

            <Text style={styles.paragraph}>
              {t.rich('cat_2_graph_desc_1', {
                strong: (chunks) => <Text style={styles.bold}>{chunks}</Text>
              })}
            </Text>

            <View style={{ marginBottom: 30 }}>
              {/* eslint-disable-next-line jsx-a11y/alt-text */}
              <Image src={`${chart2}`} />
            </View>

            {/* ---- KRÁSNÁ TABULKA ----*/}
            {/* ------------------------*/}

            <View style={styles.section} break>
              <Text style={styles.subsubheading}>{t('cat_2_tab')}</Text>

              <View style={styles.tableFirstRow}>
                <Text style={styles.cellCategoryHeader}>{t('category_subcategory')}</Text>
                <Text style={styles.cellChoiceCountHeader}>{t('choices_count')}</Text>
              </View>

              {Object.entries(result.results.questions[2].categories).map(
                ([category, value]: [string, Count], index, entries) => (
                  <View key={index}>
                    <View
                      style={{
                        borderColor: getTeacherCategoryColorByKey(category),
                        ...styles.tableRowCategory
                      }}
                    >
                      <Text style={styles.cellCategoryName}>
                        {category}: {tTeacherCategories(`${category}.name`)}
                      </Text>
                      {genderRequired && (
                        <>
                          <Text style={styles.cellCategoryNamePercentGR}>
                            {((value.total / result.results.questions[2].optionsTotal) * 100 || 0).toFixed(0)} %
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
                            {((value.total / result.results.questions[2].optionsTotal) * 100 || 0).toFixed(0)} %
                          </Text>
                          <Text style={styles.cellCategoryNameCountGNR}>{value.total}</Text>
                        </>
                      )}
                    </View>

                    {Object.entries(result.results.questions[2].options)
                      .filter(([option]) => option.includes(category))
                      .map(([option, optionValue]: [string, Count], optionIndex) => (
                        <View
                          key={optionIndex}
                          style={
                            index !== entries.length - 1 && optionIndex === 3 ? styles.tableRowLast : styles.tableRow
                          }
                        >
                          <Text style={styles.cellCategoryPart}>
                            {tTeacherCategories(`${category}.${option}.code`)}{' '}
                            {tTeacherCategories(`${category}.${option}.desc`)}
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

            <View break>
              <Text style={styles.subsubheading}>{t('questions')}</Text>

              <View style={styles.section}>
                {t.rich('cat_2_questions', {
                  item: (chunks) => <Text style={styles.itemParagraph}>{chunks}</Text>,
                  strong: (chunks) => <Text style={styles.bold}>{chunks}</Text>
                })}
              </View>

              <Text style={styles.subsubheading}>{t('findings_r')}</Text>

              <View style={styles.section}>
                {t.rich('cat_2_f', {
                  item: (chunks) => <Text style={styles.itemParagraph}>{chunks}</Text>,
                  strong: (chunks) => <Text style={styles.bold}>{chunks}</Text>
                })}
              </View>

              <Text style={styles.subsubheading}>{t('recommendations')}</Text>

              <View style={styles.section}>
                {t.rich('cat_2_r', {
                  item: (chunks) => <Text style={styles.itemParagraph}>{chunks}</Text>,
                  strong: (chunks) => <Text style={styles.bold}>{chunks}</Text>
                })}
              </View>
            </View>
          </View>

          {/* ---------------------------------------------- KATEGORIE 3 --------------------------------------------------*/}
          {/* -------------------------------------------------------------------------------------------------------------*/}

          <View style={styles.section} break>
            <Text style={styles.subheading}>{t('cat_3_h')}</Text>
            <Text style={styles.paragraph}>
              {t.rich('cat_3_desc_1', {
                strong: (chunks) => <Text style={styles.bold}>{chunks}</Text>
              })}
            </Text>

            <Text style={styles.paragraph}>
              {t.rich('cat_3_desc_2', {
                strong: (chunks) => <Text style={styles.bold}>{chunks}</Text>
              })}
            </Text>

            <Text style={styles.paragraph}>
              {t.rich('cat_3_desc_3', {
                strong: (chunks) => <Text style={styles.bold}>{chunks}</Text>
              })}
            </Text>

            <Text style={styles.paragraph}>
              {t.rich('cat_3_desc_4', {
                strong: (chunks) => <Text style={styles.bold}>{chunks}</Text>
              })}
            </Text>

            <Text style={styles.paragraph}>
              {t.rich('cat_3_desc_5', {
                strong: (chunks) => <Text style={styles.bold}>{chunks}</Text>
              })}
            </Text>

            <Text style={styles.paragraph}>
              {t.rich('cat_3_desc_6', {
                strong: (chunks) => <Text style={styles.bold}>{chunks}</Text>
              })}
            </Text>

            <Text style={{ marginTop: 10, ...styles.subsubheading }}>{t('cat_3_graph')}</Text>

            <Text style={styles.paragraph}>
              {t.rich('cat_3_graph_desc_1', {
                strong: (chunks) => <Text style={styles.bold}>{chunks}</Text>
              })}
            </Text>

            <View style={{ marginBottom: 30 }}>
              {/* eslint-disable-next-line jsx-a11y/alt-text */}
              <Image src={`${chart3}`} />
            </View>

            {/* ---- KRÁSNÁ TABULKA ----*/}
            {/* ------------------------*/}

            <View style={styles.section} break>
              <Text style={styles.subsubheading}>{t('cat_3_tab')}</Text>

              <View style={styles.tableFirstRow}>
                <Text style={styles.cellCategoryHeader}>{t('category_subcategory')}</Text>
                <Text style={styles.cellChoiceCountHeader}>{t('choices_count')}</Text>
              </View>

              {Object.entries(result.results.questions[3].categories).map(
                ([category, value]: [string, Count], index, entries) => (
                  <View key={index}>
                    <View
                      style={{
                        borderColor: getTeacherCategoryColorByKey(category),
                        ...styles.tableRowCategory
                      }}
                    >
                      <Text style={styles.cellCategoryName}>
                        {category}: {tTeacherCategories(`${category}.name`)}
                      </Text>
                      {genderRequired && (
                        <>
                          <Text style={styles.cellCategoryNamePercentGR}>
                            {((value.total / result.results.questions[3].optionsTotal) * 100 || 0).toFixed(0)} %
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
                            {((value.total / result.results.questions[3].optionsTotal) * 100 || 0).toFixed(0)} %
                          </Text>
                          <Text style={styles.cellCategoryNameCountGNR}>{value.total}</Text>
                        </>
                      )}
                    </View>

                    {Object.entries(result.results.questions[3].options)
                      .filter(([option]) => option.includes(category))
                      .map(([option, optionValue]: [string, Count], optionIndex) => (
                        <View
                          key={optionIndex}
                          style={
                            index !== entries.length - 1 && optionIndex === 3 ? styles.tableRowLast : styles.tableRow
                          }
                        >
                          <Text style={styles.cellCategoryPart}>
                            {tTeacherCategories(`${category}.${option}.code`)}{' '}
                            {tTeacherCategories(`${category}.${option}.desc`)}
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

            <View break>
              <Text style={styles.subsubheading}>{t('questions')}</Text>

              <View style={styles.section}>
                {t.rich('cat_3_questions', {
                  item: (chunks) => <Text style={styles.itemParagraph}>{chunks}</Text>,
                  strong: (chunks) => <Text style={styles.bold}>{chunks}</Text>
                })}
              </View>

              <Text style={styles.subsubheading}>{t('findings_r')}</Text>

              <View style={styles.section}>
                {t.rich('cat_3_f', {
                  item: (chunks) => <Text style={styles.itemParagraph}>{chunks}</Text>,
                  strong: (chunks) => <Text style={styles.bold}>{chunks}</Text>
                })}
              </View>

              <Text style={styles.subsubheading}>{t('recommendations')}</Text>

              <View style={styles.section}>
                {t.rich('cat_3_r', {
                  item: (chunks) => <Text style={styles.itemParagraph}>{chunks}</Text>,
                  strong: (chunks) => <Text style={styles.bold}>{chunks}</Text>
                })}
              </View>
            </View>
          </View>

          {/* ---------------------------------------------- KATEGORIE 4 --------------------------------------------------*/}
          {/* -------------------------------------------------------------------------------------------------------------*/}

          <View style={styles.section} break>
            <Text style={styles.subheading}>{t('cat_4_h')}</Text>
            <Text style={styles.paragraph}>
              {t.rich('cat_4_desc_1', {
                strong: (chunks) => <Text style={styles.bold}>{chunks}</Text>
              })}
            </Text>

            <Text style={styles.paragraph}>
              {t.rich('cat_4_desc_2', {
                strong: (chunks) => <Text style={styles.bold}>{chunks}</Text>
              })}
            </Text>

            <Text style={{ marginTop: 10, ...styles.subsubheading }}>{t('cat_4_graph')}</Text>

            <View style={{ marginBottom: 30 }}>
              {/* eslint-disable-next-line jsx-a11y/alt-text */}
              <Image src={`${chart4}`} />
            </View>

            {/* ---- KRÁSNÁ TABULKA ----*/}
            {/* ------------------------*/}

            <View style={styles.section} break>
              <Text style={styles.subsubheading}>{t('cat_4_tab')}</Text>

              <View style={styles.tableFirstRow}>
                <Text style={styles.cellCategoryHeader}>{t('category_subcategory')}</Text>
                <Text style={styles.cellChoiceCountHeader}>{t('choices_count')}</Text>
              </View>

              {Object.entries(result.results.questions[4].categories).map(
                ([category, value]: [string, Count], index, entries) => (
                  <View key={index}>
                    <View
                      style={{
                        borderColor: getTeacherCategoryColorByKey(category),
                        ...styles.tableRowCategory
                      }}
                    >
                      <Text style={styles.cellCategoryName}>
                        {category}: {tTeacherCategories(`${category}.name`)}
                      </Text>
                      {genderRequired && (
                        <>
                          <Text style={styles.cellCategoryNamePercentGR}>
                            {((value.total / result.results.questions[4].optionsTotal) * 100 || 0).toFixed(0)} %
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
                            {((value.total / result.results.questions[4].optionsTotal) * 100 || 0).toFixed(0)} %
                          </Text>
                          <Text style={styles.cellCategoryNameCountGNR}>{value.total}</Text>
                        </>
                      )}
                    </View>

                    {Object.entries(result.results.questions[4].options)
                      .filter(([option]) => option.includes(category))
                      .map(([option, optionValue]: [string, Count], optionIndex) => (
                        <View
                          key={optionIndex}
                          style={
                            index !== entries.length - 1 && optionIndex === 3 ? styles.tableRowLast : styles.tableRow
                          }
                        >
                          <Text style={styles.cellCategoryPart}>
                            {tTeacherCategories(`${category}.${option}.code`)}{' '}
                            {tTeacherCategories(`${category}.${option}.desc`)}
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

            <View break>
              <Text style={styles.subsubheading}>{t('findings')}</Text>

              <Text style={styles.paragraph}>
                {t.rich('cat_4_finding', {
                  strong: (chunks) => <Text style={styles.bold}>{chunks}</Text>
                })}
              </Text>

              <Text style={styles.subsubheading}>{t('questions')}</Text>

              <View style={styles.section}>
                {t.rich('cat_4_questions', {
                  item: (chunks) => <Text style={styles.itemParagraph}>{chunks}</Text>,
                  strong: (chunks) => <Text style={styles.bold}>{chunks}</Text>
                })}
              </View>
            </View>
          </View>

          {/* ------------------------------------------ RAMCOVA DOPORUCENI -----------------------------------------------*/}
          {/* -------------------------------------------------------------------------------------------------------------*/}

          <View style={styles.section} break>
            {/* <Text style={styles.subheading}>{t('frame_rec_heading')}</Text>

            <Text style={styles.paragraph}>
              {t.rich('frame_rec_desc', {
                strong: (chunks) => <Text style={styles.bold}>{chunks}</Text>
              })}
            </Text>

            <View style={styles.section}>
              {t.rich('frame_rec_items', {
                item: (chunks) => (
                  <Text style={styles.itemParagraph}>{chunks}</Text>
                ),
                strong: (chunks) => <Text style={styles.bold}>{chunks}</Text>
              })}
            </View>

            <Text style={styles.subsubheading}>{t('risks_heading')}</Text>

            <Text style={styles.paragraph}>
              {t.rich('risks_desc_1', {
                strong: (chunks) => <Text style={styles.bold}>{chunks}</Text>
              })}
            </Text>

            <Text style={styles.paragraph}>
              {t.rich('risks_desc_2', {
                strong: (chunks) => <Text style={styles.bold}>{chunks}</Text>
              })}
            </Text>

            <Text style={styles.paragraph}>
              {t.rich('risks_desc_3', {
                strong: (chunks) => <Text style={styles.bold}>{chunks}</Text>
              })}
            </Text>

            <Text style={styles.paragraph}>
              {t.rich('risks_desc_4', {
                strong: (chunks) => <Text style={styles.bold}>{chunks}</Text>
              })}
            </Text> */}

            <Text style={{ marginTop: 10, ...styles.subsubheading }}>{t('lit_heading')}</Text>

            <Text style={styles.paragraph}>
              {t.rich('lit_1', {
                strong: (chunks) => <Text style={styles.bold}>{chunks}</Text>
              })}
            </Text>

            <Text style={styles.paragraph}>
              {t.rich('lit_2', {
                strong: (chunks) => <Text style={styles.bold}>{chunks}</Text>
              })}
            </Text>

            <Text style={styles.paragraph}>
              {t.rich('lit_3', {
                strong: (chunks) => <Text style={styles.bold}>{chunks}</Text>
              })}
            </Text>

            <Text style={styles.paragraph}>
              {t.rich('lit_4', {
                strong: (chunks) => <Text style={styles.bold}>{chunks}</Text>
              })}
            </Text>

            <Text style={styles.paragraph}>
              {t.rich('lit_5', {
                strong: (chunks) => <Text style={styles.bold}>{chunks}</Text>
              })}
            </Text>
          </View>

          <View style={{ marginTop: 10, ...styles.section }}>
            <Text style={styles.paragraph}>
              {t.rich('perex', {
                strong: (chunks) => <Text style={styles.bold}>{chunks}</Text>
              })}
            </Text>

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
