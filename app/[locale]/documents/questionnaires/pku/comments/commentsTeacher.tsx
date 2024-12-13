'use client';

import { Page, Document, Font, PDFViewer, View, Image, Text } from '@react-pdf/renderer';
import { useTranslations } from 'next-intl';

import styles from '../../styles';
import PdfColumn from '../../../../../../templates/pdf/components/pdfColumn';
import { documentFontOptions } from '../../../fonts';
import { PkuCommentsResult } from '@/utils/reports/pku/comments/comments.model';

export default function CommentsTeacher({ result }: { result: PkuCommentsResult }) {
  Font.register(documentFontOptions);

  const t = useTranslations('documents.questionnaires.pku.comments');
  const tGeneral = useTranslations('documents.questionnaires.pku.general');
  const tCommon = useTranslations('documents.questionnaires.common');
  const tQuestions = useTranslations('questionnaires.pku.questions');

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

          {/* -------------------------------------------------------- KOMENTÁŘE -------------------------------------------------------*/}
          {/* --------------------------------------------------------------------------------------------------------------------------*/}

          <View style={{ marginTop: 10, ...styles.section }}>
            <Text style={{ ...styles.subheading, textAlign: 'left' }}>
              <Text>1. {tQuestions('1')}</Text>
            </Text>

            {result.results.questions[1].comments.length === 0 ? (
              <View style={{ marginTop: 5, ...styles.section }}>
                <View style={{ flexDirection: 'column', marginBottom: 4 }}>
                  <Text
                    style={{
                      marginHorizontal: 8,
                      fontSize: 12,
                      paddingVertical: 4
                    }}
                  >
                    {t('no_comments')}
                  </Text>
                </View>
              </View>
            ) : (
              <View style={{ marginTop: 5, ...styles.section }}>
                <View style={{ flexDirection: 'column', marginBottom: 4 }}>
                  {result.results.questions[1].comments.map((comment, index) => (
                    <Text
                      key={index}
                      style={{
                        marginHorizontal: 8,
                        fontSize: 12,
                        paddingVertical: 4
                      }}
                    >
                      • {comment}
                    </Text>
                  ))}
                </View>
              </View>
            )}
          </View>

          <View style={{ marginTop: 10, ...styles.section }}>
            <Text style={{ ...styles.subheading, textAlign: 'left' }}>
              <Text>2. {tQuestions('2')}</Text>
            </Text>

            {result.results.questions[2].comments.length === 0 ? (
              <View style={{ marginTop: 5, ...styles.section }}>
                <View style={{ flexDirection: 'column', marginBottom: 4 }}>
                  <Text
                    style={{
                      marginHorizontal: 8,
                      fontSize: 12,
                      paddingVertical: 4
                    }}
                  >
                    {t('no_comments')}
                  </Text>
                </View>
              </View>
            ) : (
              <View style={{ marginTop: 5, ...styles.section }}>
                <View style={{ flexDirection: 'column', marginBottom: 4 }}>
                  {result.results.questions[2].comments.map((comment, index) => (
                    <Text
                      key={index}
                      style={{
                        marginHorizontal: 8,
                        fontSize: 12,
                        paddingVertical: 4
                      }}
                    >
                      • {comment}
                    </Text>
                  ))}
                </View>
              </View>
            )}
          </View>

          <View style={{ marginTop: 10, ...styles.section }}>
            <Text style={{ ...styles.subheading, textAlign: 'left' }}>
              <Text>3. {tQuestions('3')}</Text>
            </Text>

            {result.results.questions[3].comments.length === 0 ? (
              <View style={{ marginTop: 5, ...styles.section }}>
                <View style={{ flexDirection: 'column', marginBottom: 4 }}>
                  <Text
                    style={{
                      marginHorizontal: 8,
                      fontSize: 12,
                      paddingVertical: 4
                    }}
                  >
                    {t('no_comments')}
                  </Text>
                </View>
              </View>
            ) : (
              <View style={{ marginTop: 5, ...styles.section }}>
                <View style={{ flexDirection: 'column', marginBottom: 4 }}>
                  {result.results.questions[3].comments.map((comment, index) => (
                    <Text
                      key={index}
                      style={{
                        marginHorizontal: 8,
                        fontSize: 12,
                        paddingVertical: 4
                      }}
                    >
                      • {comment}
                    </Text>
                  ))}
                </View>
              </View>
            )}
          </View>

          <View style={{ marginTop: 10, ...styles.section }}>
            <Text style={{ ...styles.subheading, textAlign: 'left' }}>
              <Text>4. {tQuestions('4')}</Text>
            </Text>

            {result.results.questions[4].comments.length === 0 ? (
              <View style={{ marginTop: 5, ...styles.section }}>
                <View style={{ flexDirection: 'column', marginBottom: 4 }}>
                  <Text
                    style={{
                      marginHorizontal: 8,
                      fontSize: 12,
                      paddingVertical: 4
                    }}
                  >
                    {t('no_comments')}
                  </Text>
                </View>
              </View>
            ) : (
              <View style={{ marginTop: 5, ...styles.section }}>
                <View style={{ flexDirection: 'column', marginBottom: 4 }}>
                  {result.results.questions[4].comments.map((comment, index) => (
                    <Text
                      key={index}
                      style={{
                        marginHorizontal: 8,
                        fontSize: 12,
                        paddingVertical: 4
                      }}
                    >
                      • {comment}
                    </Text>
                  ))}
                </View>
              </View>
            )}
          </View>

          {/* -------------------------------------------------- PATIČKA --------------------------------------------------*/}
          {/* -------------------------------------------------------------------------------------------------------------*/}

          <View style={styles.footer} fixed>
            <Text style={styles.pageNumber} render={({ pageNumber }) => `${pageNumber}`} />
            {/* eslint-disable-next-line jsx-a11y/alt-text */}
            <Image src={'/images/documents/' + tCommon('footer_image')}></Image>
          </View>
        </Page>
      </Document>
    </PDFViewer>
  );
}
