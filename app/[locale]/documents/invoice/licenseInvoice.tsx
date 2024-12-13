'use client';

import { Page, Text, Document, StyleSheet, View, Font, PDFViewer } from '@react-pdf/renderer';
import { License, School } from '@prisma/client';
import { useTranslations } from 'next-intl';
import PdfColumn from 'templates/pdf/components/pdfColumn';
import { documentFontOptions } from '../fonts';

export default function LicenseInvoice({ license }: { license: License & { school: School } }) {
  Font.register(documentFontOptions);

  const styles = StyleSheet.create({
    page: {
      fontFamily: 'Inter',
      padding: 20,
      fontSize: 9,
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

  const t = useTranslations('documents.invoice');

  const addDays = (date: Date, days: number) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  };

  const invoiceDue = addDays(license.createdAt, 14);

  return (
    <PDFViewer style={{ height: '100vh', width: '100vw' }}>
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={{ flexDirection: 'row', marginBottom: 10 }}>
            <PdfColumn width="75%">
              <Text style={{ fontWeight: 800 }}>{t('heading') + license.invoiceNumber}</Text>
            </PdfColumn>
            <PdfColumn width="25%">
              <Text style={{ fontWeight: 800, marginLeft: 2 }}>{t('tax_doc')}</Text>
            </PdfColumn>
          </View>
          <View style={styles.row}>
            <PdfColumn width="25%">
              <Text style={{ fontWeight: 800 }}>{t('supplier.title')}</Text>
              <Text>{t('supplier.name')}</Text>
              <Text>{t('supplier.address')}</Text>
              <Text>{t('supplier.zip_city')}</Text>
              <Text>{t('supplier.country')}</Text>
              <Text style={{ marginBottom: 10, marginTop: 10 }}>{t('supplier.business_id')}</Text>
              <Text>{t('supplier.register')}</Text>
            </PdfColumn>
            <PdfColumn width="25%">
              <Text style={{ fontWeight: 800 }}>{t('supplier.delivery_info.title')}</Text>
              <Text>{t('supplier.delivery_info.name')}</Text>
              <Text>{t('supplier.delivery_info.address')}</Text>
              <Text>{t('supplier.delivery_info.zip_city')}</Text>
              <Text>{t('supplier.delivery_info.country')}</Text>
            </PdfColumn>
            <PdfColumn width="25%">
              <Text style={{ fontWeight: 800 }}>{t('purchaser.title')}</Text>
              {license.school.billingInfoEqual ? (
                <>
                  <Text>{license.school.schoolName}</Text>
                  <Text>{license.school.address}</Text>
                  <Text>{license.school.zipCode + ' ' + license.school.city}</Text>
                  {license.school.businessId && (
                    <Text>{t('purchaser.business_id') + ' ' + license.school.businessId}</Text>
                  )}
                  {license.school.taxNumber && (
                    <Text>{t('purchaser.tax_number') + ' ' + license.school.taxNumber}</Text>
                  )}
                </>
              ) : (
                <>
                  <Text>{license.school.billingName}</Text>
                  <Text>{license.school.billingAddress}</Text>
                  <Text>{license.school.billingZipCode + ' ' + license.school.billingCity}</Text>
                  {license.school.billingBusinessId && (
                    <Text>{t('purchaser.business_id') + ' ' + license.school.billingBusinessId}</Text>
                  )}
                  {license.school.billingTaxNumber && (
                    <Text>{t('purchaser.tax_number') + ' ' + license.school.billingTaxNumber}</Text>
                  )}
                </>
              )}
            </PdfColumn>
            <PdfColumn width="25%">
              <Text style={{ fontWeight: 800 }}>{t('payment_info.title')}</Text>
              <Text>{t('payment_info.variable_symbol') + license.invoiceNumber}</Text>
              <Text>{t('payment_info.constant_symbol')}</Text>
              <Text>{t('payment_info.bank_number')}</Text>
              {license.school.country !== 0 && (
                <>
                  <Text>{t('payment_info.iban')}</Text>
                  <Text>{t('payment_info.swift')}</Text>
                  <Text>{t('payment_info.currency')}</Text>
                </>
              )}
              <Text>{t('payment_info.figure') + license.price + ' ' + t('currency')}</Text>
              <Text>{t('payment_info.tax_info')}</Text>
              <Text style={{ marginTop: 10 }}>
                {t('payment_info.invoice_date') + license.createdAt.toLocaleDateString('cs-CZ')}
              </Text>
              <Text>{t('payment_info.taxable_date') + license.createdAt.toLocaleDateString('cs-CZ')}</Text>
              <Text>{t('payment_info.invoice_due') + invoiceDue.toLocaleDateString('cs-CZ')}</Text>
            </PdfColumn>
          </View>
          <View style={styles.line}></View>
          <View style={(styles.section, { padding: 10, paddingTop: 0 })}>
            <Text style={styles.header}>{t('product.title')}</Text>
            <Text>{t('product.desc')}</Text>
            <Text style={{ marginLeft: 10 }}>
              {'· ' + t('product.version')}
              <Text style={{ fontWeight: 800 }}>{t('product.' + license.product + '.version')}</Text>
              {t('product.' + license.product + '.version_desc')}
            </Text>
            <Text style={{ marginLeft: 10 }}>
              {'· ' + t('product.classes')}
              <Text style={{ fontWeight: 800 }}>
                {!license.isUnlimited && license.classesTotal}
                {license.isUnlimited && t('product.unlimited.classes')}
              </Text>
            </Text>
            <Text style={{ marginLeft: 10 }}>
              {'· ' + t('product.price')}
              <Text style={{ fontWeight: 800 }}>
                {!license.isUnlimited && t('product.' + license.product + '.price')}
                {license.isUnlimited && t('product.unlimited.price')}
              </Text>
            </Text>
            <Text style={{ marginLeft: 10 }}>
              {'· ' + t('product.validity')}
              <Text style={{ fontWeight: 800 }}>{license.validUntil.toLocaleDateString('cs-CZ')}</Text>
            </Text>
            <Text style={{ marginTop: 10 }}>{t('product.info')}</Text>
            <Text>{t('product.help')}</Text>
            <Text style={{ fontWeight: 800, marginTop: 10 }}>
              {t('product.figure') + license.price + ' ' + t('currency')}
            </Text>
          </View>
        </Page>
      </Document>
    </PDFViewer>
  );
}
