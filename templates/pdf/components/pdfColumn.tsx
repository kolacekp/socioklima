import React from 'react';
import { View, StyleSheet } from '@react-pdf/renderer';

const PdfColumn = ({ children, width }: { children: React.ReactNode; width: string }) => {
  const styles = StyleSheet.create({
    column: {
      flexDirection: 'column',
      width: width,
      paddingRight: 5
    }
  });

  return <View style={styles.column}>{children}</View>;
};

export default PdfColumn;
