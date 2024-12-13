'use client';

import { Page, Document, Font, PDFViewer, View, Image, Text } from '@react-pdf/renderer';
import { useTranslations } from 'next-intl';

import styles from '../../styles';
import PdfColumn from '../../../../../../templates/pdf/components/pdfColumn';
import { documentFontOptions } from '../../../fonts';
import { SociogramResult } from '@/utils/reports/sokl/sociogram/index.model';

export default function Sociogram({ result }: { result: SociogramResult }) {
  Font.register(documentFontOptions);

  const t = useTranslations('documents.questionnaires.sokl.sociogram');
  const tCommon = useTranslations('documents.questionnaires.common');
  const tGeneral = useTranslations('documents.questionnaires.sokl.general');

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
              {t.rich('sociogram_1', {
                strong: (chunks) => <Text style={styles.bold}>{chunks}</Text>
              })}
            </Text>

            <Text style={styles.paragraph}>
              {t.rich('sociogram_2', {
                strong: (chunks) => <Text style={styles.bold}>{chunks}</Text>
              })}
            </Text>

            <Text style={styles.paragraph}>
              {t.rich('sociogram_3', {
                strong: (chunks) => <Text style={styles.bold}>{chunks}</Text>,
                item: (chunks) => <Text style={styles.item}>{chunks}</Text>
              })}
            </Text>

            <Text style={styles.paragraph}>
              {t.rich('sociogram_4', {
                strong: (chunks) => <Text style={styles.bold}>{chunks}</Text>
              })}
            </Text>

            <Text style={styles.paragraph}>
              {t.rich('sociogram_5', {
                strong: (chunks) => <Text style={styles.bold}>{chunks}</Text>
              })}
            </Text>

            <Text style={styles.paragraph}>
              {t.rich('sociogram_6', {
                strong: (chunks) => <Text style={styles.bold}>{chunks}</Text>
              })}
            </Text>
            <Text style={styles.paragraph}>
              {t.rich('sociogram_7', {
                strong: (chunks) => <Text style={styles.bold}>{chunks}</Text>
              })}
            </Text>
            <Text style={styles.paragraph}>
              {t.rich('sociogram_8', {
                strong: (chunks) => <Text style={styles.bold}>{chunks}</Text>
              })}
            </Text>

            <Text style={styles.paragraph}>
              {tCommon.rich('generated', {
                strong: (chunks) => <Text style={styles.bold}>{chunks}</Text>
              })}
            </Text>
          </View>

          <View style={styles.section} break>
            <Text style={styles.subsubheading}>{t('table_1')}</Text>

            <Text>
              {t.rich('friendly_relationship', {
                strong: (chunks) => <Text style={styles.bold}>{chunks}</Text>
              })}
            </Text>
            {/* <Text>{t('names')}</Text> */}

            <Text>
              {t.rich('unfriendly_relationship', {
                strong: (chunks) => <Text style={styles.bold}>{chunks}</Text>
              })}
            </Text>
            {/* <Text>{t('names')}</Text> */}

            <Text>
              {t.rich('leader', {
                strong: (chunks) => <Text style={styles.bold}>{chunks}</Text>
              })}
            </Text>
            {/* <Text>{t('names')}</Text> */}

            <Text>
              {t.rich('opposition_leader', {
                strong: (chunks) => <Text style={styles.bold}>{chunks}</Text>
              })}
            </Text>
            {/* <Text>{t('names')}</Text> */}

            <Text>
              {t.rich('black_sheep', {
                strong: (chunks) => <Text style={styles.bold}>{chunks}</Text>
              })}
            </Text>
            {/* <Text>{t('names')}</Text> */}

            <Text>
              {t.rich('grey_mouse', {
                strong: (chunks) => <Text style={styles.bold}>{chunks}</Text>
              })}
            </Text>
            {/* <Text>{t('names')}</Text> */}

            <Text>
              {t.rich('hedgehog', {
                strong: (chunks) => <Text style={styles.bold}>{chunks}</Text>
              })}
            </Text>
            {/* <Text>{t('names')}</Text> */}

            <Text>
              {t.rich('isolated', {
                strong: (chunks) => <Text style={styles.bold}>{chunks}</Text>
              })}
            </Text>
            {/* <Text>{t('names')}</Text> */}

            <Text>
              {t.rich('clique', {
                strong: (chunks) => <Text style={styles.bold}>{chunks}</Text>
              })}
            </Text>
            {/* <Text>{t('names')}</Text> */}
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

        <Page size="A4" orientation="landscape" style={styles.pageLandscape}>
          <Text style={styles.subsubheading}>{t('graph_1')}</Text>
          <View style={{ height: '90%' }}>
            {/* eslint-disable-next-line jsx-a11y/alt-text */}
            <Image src={`data:image/png;base64,${result.results.diagrams.positive}`} />
          </View>

          <Text break style={styles.subsubheading}>
            {t('graph_2')}
          </Text>
          <View style={{ height: '90%' }}>
            {/* eslint-disable-next-line jsx-a11y/alt-text */}
            <Image src={`data:image/png;base64,${result.results.diagrams.negative}`} />
          </View>

          <Text break style={styles.subsubheading}>
            {t('graph_3')}
          </Text>
          <View style={{ height: '90%' }}>
            {/* eslint-disable-next-line jsx-a11y/alt-text */}
            <Image src={`data:image/png;base64,${result.results.diagrams.aspirational}`} />
          </View>

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
