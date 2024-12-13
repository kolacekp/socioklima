'use client';

import { Page, Document, Font, PDFViewer, View, Image, Text } from '@react-pdf/renderer';
import { useTranslations } from 'next-intl';

import styles from '../../styles';
import PdfColumn from '../../../../../../templates/pdf/components/pdfColumn';
import { documentFontOptions } from '../../../fonts';
import { categoriesArray } from '@/utils/categories';
import { getCategoryColorByKey } from '@/utils/colors';
import { DoughnutCharts } from './[id]/page';
import { CategoriesCountsPupils, Count, OptionsCountsPupils, SoklDcdResult } from '@/utils/reports/sokl/dcd/dcd.model';

export default function DetailClassDiagnostic({
  doughnutCharts,
  result
}: {
  doughnutCharts: DoughnutCharts;
  result: SoklDcdResult;
}) {
  const genderRequired = result.info.genderRequired;

  Font.register(documentFontOptions);

  const t = useTranslations('documents.questionnaires.sokl.detail_class_diagnostic');
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

          {/* -------------------------------------------------- ZÁKLADNÍ POPIS --------------------------------------------------*/}
          {/* --------------------------------------------------------------------------------------------------------------------*/}

          <View style={styles.section}>
            <Text style={styles.paragraph}>
              {t.rich('detail_1', {
                strong: (chunks) => <Text style={styles.bold}>{chunks}</Text>
              })}
            </Text>
            <Text style={styles.paragraph_indented}>
              {t.rich('detail_1_desc', {
                strong: (chunks) => <Text style={styles.bold}>{chunks}</Text>
              })}
            </Text>
            <Text style={styles.paragraph}>
              {t.rich('detail_2', {
                strong: (chunks) => <Text style={styles.bold}>{chunks}</Text>
              })}
            </Text>
            <Text style={styles.paragraph}>
              {t.rich('detail_3', {
                strong: (chunks) => <Text style={styles.bold}>{chunks}</Text>
              })}
            </Text>
            <Text style={styles.paragraph}>
              {t.rich('detail_4', {
                strong: (chunks) => <Text style={styles.bold}>{chunks}</Text>
              })}
            </Text>
            <Text style={styles.paragraph}>
              {t.rich('detail_5', {
                strong: (chunks) => <Text style={styles.bold}>{chunks}</Text>
              })}
            </Text>
            <Text style={styles.paragraph}>
              {t.rich('detail_6', {
                strong: (chunks) => <Text style={styles.bold}>{chunks}</Text>
              })}
            </Text>
            <Text style={styles.paragraph}>
              {t.rich('detail_7', {
                strong: (chunks) => <Text style={styles.bold}>{chunks}</Text>
              })}
            </Text>
          </View>

          {/* --------------------------------------------- ZÁKLADNÍ STRUKTURA --------------------------------------------*/}
          {/* -------------------------------------------------------------------------------------------------------------*/}

          <View style={styles.section} break>
            <Text style={styles.subheading}>{t('basic_structure_heading')}</Text>

            <Text style={styles.subsubheading}>{t('graph', { number: 1 })}</Text>

            <View style={{ marginTop: 10, marginBottom: 30 }}>
              {/* eslint-disable-next-line jsx-a11y/alt-text */}
              {doughnutCharts.main && <Image src={`${doughnutCharts.main}`} />}
            </View>

            <Text style={styles.subheading}>{t('findings')}</Text>

            <Text style={styles.subsubheadingleft}>{t('strenghts')}</Text>

            {result.results.factors.strengths.map((strength, index) => {
              return (
                <View key={index} style={{ flexDirection: 'row', marginBottom: 4 }}>
                  <Text>
                    <Text style={{ marginHorizontal: 8 }}>•</Text> {tFindings(`${strength[0]}.${strength}.finding`)}{' '}
                    <Text style={styles.bold}>
                      (
                      {(
                        (result.results.table.options[strength].total / result.results.table.optionsTotal) *
                        100
                      ).toFixed(0)}
                      {'% '}
                      {tFindings(`${strength[0]}.${strength}.code`)} - {tFindings(`${strength[0]}.${strength}.name`)})
                    </Text>
                  </Text>
                </View>
              );
            })}

            <Text style={{ marginTop: 10, ...styles.subsubheadingleft }}>{t('risk_factors')}</Text>

            {result.results.factors.risks.map((risk, index) => {
              return (
                <View key={index} style={{ flexDirection: 'row', marginBottom: 4 }}>
                  <Text>
                    <Text style={{ marginHorizontal: 8 }}>•</Text> {tFindings(`${risk[0]}.${risk}.finding`)}{' '}
                    <Text style={styles.bold}>
                      (
                      {((result.results.table.options[risk].total / result.results.table.optionsTotal) * 100).toFixed(
                        0
                      )}
                      {'% '}
                      {tFindings(`${risk[0]}.${risk}.code`)} - {tFindings(`${risk[0]}.${risk}.name`)})
                    </Text>
                  </Text>
                </View>
              );
            })}

            <Text style={{ marginTop: 10, ...styles.subsubheadingleft }}>{t('threatening_factors')}</Text>

            {result.results.factors.threats.map((threat, index) => {
              return (
                <View key={index} style={{ flexDirection: 'row', marginBottom: 4 }}>
                  <Text>
                    <Text style={{ marginHorizontal: 8 }}>•</Text> {tFindings(`${threat[0]}.${threat}.finding`)}{' '}
                    <Text style={styles.bold}>
                      (
                      {((result.results.table.options[threat].total / result.results.table.optionsTotal) * 100).toFixed(
                        0
                      )}
                      {'% '}
                      {tFindings(`${threat[0]}.${threat}.code`)} - {tFindings(`${threat[0]}.${threat}.name`)})
                    </Text>
                  </Text>
                </View>
              );
            })}

            <Text style={styles.subheading} break>
              {t('recommendations')}
            </Text>

            <Text style={styles.subsubheadingleft}>
              {t('strenghts')} - {t('how_to_use')}
            </Text>

            {result.results.factors.strengths.map((option, index) => {
              return (
                <View key={index} style={{ flexDirection: 'row', marginBottom: 4 }}>
                  <Text>
                    <Text style={{ marginHorizontal: 8 }}>•</Text> {tFindings(`${option[0]}.${option}.recommendation`)}
                  </Text>
                </View>
              );
            })}

            <Text style={{ marginTop: 10, ...styles.subsubheadingleft }}>
              {t('risk_factors')} - {t('how_to_solve')}
            </Text>

            {result.results.factors.risks.map((option, index) => {
              return (
                <View key={index} style={{ flexDirection: 'row', marginBottom: 4 }}>
                  <Text>
                    <Text style={{ marginHorizontal: 8 }}>•</Text> {tFindings(`${option[0]}.${option}.recommendation`)}
                  </Text>
                </View>
              );
            })}

            <Text style={{ marginTop: 10, ...styles.subsubheadingleft }}>
              {t('threatening_factors')} - {t('how_to_stop')}
            </Text>

            {result.results.factors.threats.map((option, index) => {
              return (
                <View key={index} style={{ flexDirection: 'row', marginBottom: 4 }}>
                  <Text>
                    <Text style={{ marginHorizontal: 8 }}>•</Text> {tFindings(`${option[0]}.${option}.recommendation`)}
                  </Text>
                </View>
              );
            })}

            <Text style={{ marginTop: 20, ...styles.subheading }}>{t('class_structure')}</Text>

            <Text style={styles.paragraph}>
              {t.rich('class_structure_text', {
                strong: (chunks) => <Text style={styles.bold}>{chunks}</Text>
              })}
            </Text>

            {/* -------------------------------------------------- KRÁSNÁ VELKÁ TABULKA --------------------------------------------------*/}
            {/* --------------------------------------------------------------------------------------------------------------------------*/}

            <View style={styles.section} break>
              <Text style={styles.subsubheading}>{t('table_heading')}</Text>

              <View style={styles.tableFirstRow}>
                <Text style={styles.cellCategoryHeader}>{t('category_subcategory')}</Text>
                <Text style={styles.cellChoiceCountHeader}>{t('choices_count')}</Text>
              </View>

              {Object.entries(result.results.table.categories).map(
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
                            {((value.total / result.results.table.optionsTotal) * 100 || 0).toFixed(0)} %
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
                            {((value.total / result.results.table.optionsTotal) * 100 || 0).toFixed(0)} %
                          </Text>
                          <Text style={styles.cellCategoryNameCountGNR}>{value.total}</Text>
                        </>
                      )}
                    </View>

                    {Object.entries(result.results.table.options)
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
          </View>

          {/* -------------------------------------------- VÝSTUPY Z JEDNOTLIVÝCH KATEGORIÍ --------------------------------------------*/}
          {/* --------------------------------------------------------------------------------------------------------------------------*/}
          <View style={styles.section}>
            {Object.entries(categoriesArray).map(([letter, subcategories], letterIndex) => (
              <View key={letterIndex} break={letterIndex > 0}>
                <Text style={styles.subheading}>
                  {`${letter}:`} {tFindings(`${letter}.name`)}
                </Text>

                <View style={styles.section}>
                  {tFindings.rich(`${letter}.descriptions`, {
                    item: (chunks) => <Text style={styles.paragraph}>{chunks}</Text>,
                    strong: (chunks) => <Text style={styles.bold}>{chunks}</Text>
                  })}
                </View>

                <Text style={{ marginTop: 10, ...styles.subsubheading }}>
                  {t('graph', { number: letterIndex + 2 })}
                </Text>

                <View style={{ marginTop: 10 }}>
                  {doughnutCharts[letter] && (
                    <>
                      {/* eslint-disable-next-line jsx-a11y/alt-text */}
                      <Image src={`${doughnutCharts[letter]}`} />
                    </>
                  )}
                </View>

                <Text style={{ marginTop: 10, ...styles.subsubheading }} break>
                  {t('table', { number: letterIndex + 2 })} {`${letter}:`} {tFindings(`${letter}.name`)}
                </Text>

                <View style={{ marginTop: 10, marginBottom: 20 }}>
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

                <Text style={styles.subsubheadingleft}>{t('manifests')}</Text>

                <View style={styles.section}>
                  {tFindings.rich(`${letter}.manifests`, {
                    item: (chunks) => <Text style={styles.item}>{chunks}</Text>,
                    strong: (chunks) => <Text style={styles.bold}>{chunks}</Text>
                  })}
                </View>

                <Text style={styles.subsubheadingleft}>{t('risks')}</Text>

                <View style={styles.section}>
                  {tFindings.rich(`${letter}.risks`, {
                    item: (chunks) => <Text style={styles.item}>{chunks}</Text>,
                    strong: (chunks) => <Text style={styles.bold}>{chunks}</Text>
                  })}
                </View>

                <View style={styles.section}>
                  <Text style={styles.subsubheadingleft}>{t('reccs')}</Text>
                  {tFindings.rich(`${letter}.recommendations`, {
                    item: (chunks) => <Text style={styles.item}>{chunks}</Text>,
                    strong: (chunks) => <Text style={styles.bold}>{chunks}</Text>
                  })}
                </View>

                <Text style={{ marginTop: 10, ...styles.subheading }}>
                  {t(`following_programme`)} -{' '}
                  <Text style={{ textTransform: 'uppercase' }}>{tFindings(`${letter}.a_p`)}</Text>
                </Text>

                <View style={styles.section}>
                  <Text style={{ ...styles.paragraph, ...styles.bold }}>
                    {t('topic')} {letter}: {tFindings(`${letter}.q`)}
                  </Text>
                  <Text style={styles.paragraph}>
                    <Text style={styles.bold}>{t('need')}</Text>: {tFindings(`${letter}.need`)}
                  </Text>
                  <Text style={styles.paragraph}>
                    <Text style={styles.bold}>{t('target')}</Text>: {tFindings(`${letter}.target`)}
                  </Text>
                  <Text style={styles.paragraph}>
                    <Text style={styles.bold}>{t('skills')}</Text>: {tFindings(`${letter}.skills`)}
                  </Text>
                </View>
              </View>
            ))}
          </View>

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
