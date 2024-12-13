'use client';

import { Page, Text, Document, StyleSheet, View, Font, PDFViewer } from '@react-pdf/renderer';
import PdfColumn from '../../../../templates/pdf/components/pdfColumn';
import { Class, Pupil, School, User } from '@prisma/client';
import { useTranslations } from 'next-intl';
import { documentFontOptions } from '../fonts';

export default function PupilConsent({
  pupils
}: {
  pupils: Array<
    Pupil & {
      user: User;
      class: Class & { school: School & { contactUser: User } };
    }
  >;
}) {
  Font.register(documentFontOptions);

  const styles = StyleSheet.create({
    page: {
      fontFamily: 'Inter',
      padding: 30,
      fontSize: 10,
      fontWeight: 300
    },
    section: {
      marginBottom: 10
    },
    row: {
      flexDirection: 'row'
    },
    line: {
      width: '100%',
      height: 1,
      backgroundColor: '#CCC',
      marginBottom: 20,
      marginTop: 20
    },
    header: {
      fontWeight: 400,
      fontSize: 14,
      marginBottom: 10
    },
    paragraph: {
      fontWeight: 400,
      fontSize: 12,
      lineHeight: '130%'
    },
    bold: {
      fontWeight: 700
    }
  });

  const t = useTranslations('documents.pupilConsent');

  return (
    <PDFViewer style={{ height: '100vh', width: '100vw' }}>
      <Document>
        {pupils.map((pupil) => (
          <Page key={pupil.id} size="A4" style={styles.page}>
            <View style={styles.section}>
              <Text
                style={{
                  fontWeight: 700,
                  fontSize: 13,
                  textAlign: 'center',
                  textTransform: 'uppercase'
                }}
              >
                {t('heading')}
              </Text>
              <Text
                style={{
                  fontWeight: 400,
                  textAlign: 'center',
                  marginBottom: 20
                }}
              >
                {t('subheading')}
              </Text>
            </View>
            <View style={(styles.section, { padding: 10, paddingTop: 0 })}>
              <Text style={styles.paragraph}>
                {t('1')}
                {'\n'}
                {'\n'}
                {t('2')}
                {'\n'}
                {'\n'}
                {t('3')}
                {'\n'}
                {'\n'}
                {t('4')}
                {'\n'}
                {'\n'}
                {t('5')}
                {'\n'}
                {'\n'} {t('6')}
                {'\n'}
                {'\n'}
                {t('school')} <Text style={styles.bold}>{pupil.class.school.schoolName}</Text>
                {'\n'}
                {'\n'}
                {t('contactPerson')} <Text style={styles.bold}>{pupil.class.school.contactUser.name}</Text>
                {'\n'}
                {'\n'}
                {t('contactPersonContact')} <Text style={styles.bold}>{pupil.class.school.contactUser.email}</Text>
              </Text>
              <View style={styles.line}></View>
              <Text style={styles.paragraph}>
                {t('agreementPart1')} <Text style={styles.bold}>{pupil.user.name}</Text>
                {t('agreementSchool')} <Text style={styles.bold}>{pupil.class.school.schoolName}</Text>
                {t('agreementClass')} <Text style={styles.bold}>{pupil.class.name}</Text>
                {t('agreementYear')} <Text style={styles.bold}>2024/2025</Text>
                {t('agreementPart2')}
                {'\n'}
                {'\n'} {t('note')}
                {'\n'}
                {'\n'}
                {'\n'}
                {'\n'}
              </Text>
            </View>
            <View style={(styles.section, { padding: 10, paddingTop: 0 })}>
              <View style={styles.row}>
                <PdfColumn width="50%">
                  <Text style={styles.paragraph}>{t('signLeft')}</Text>
                </PdfColumn>
                <PdfColumn width="50%">
                  <Text style={styles.paragraph}>{t('signRight')}</Text>
                </PdfColumn>
              </View>
            </View>
          </Page>
        ))}
      </Document>
    </PDFViewer>
  );
}
