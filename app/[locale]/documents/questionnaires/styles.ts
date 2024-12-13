import { StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Inter',
    paddingTop: 30,
    paddingHorizontal: 35,
    paddingBottom: 80,
    fontSize: 10,
    fontWeight: 300
  },
  pageLandscape: {
    fontFamily: 'Inter',
    paddingTop: 35,
    paddingHorizontal: 35,
    paddingBottom: 90,
    fontSize: 10,
    fontWeight: 300
  },
  section: { marginBottom: 10 },
  line: {
    width: '100%',
    height: 1,
    backgroundColor: '#eee',
    marginBottom: 10,
    marginTop: 10
  },
  row: { flexDirection: 'row' },
  header: { marginBottom: 10, textAlign: 'center' },
  pageNumber: { marginBottom: 5 },
  footer: {
    position: 'absolute',
    fontSize: 11,
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    marginTop: 20
  },
  heading: {
    fontWeight: 500,
    textTransform: 'uppercase',
    fontSize: 20,
    textAlign: 'center',
    lineHeight: 1.45,
    paddingHorizontal: 20
  },
  subheading: {
    fontWeight: 500,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: '130%',
    marginBottom: 10,
    paddingHorizontal: 10
  },
  subheadingtleft: {
    fontWeight: 500,
    fontSize: 14,
    lineHeight: '130%',
    marginBottom: 10
  },
  subsubheading: {
    fontWeight: 500,
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 1.45,
    marginBottom: 5,
    paddingHorizontal: 10
  },
  subsubheadingleft: {
    fontWeight: 500,
    fontSize: 12,
    lineHeight: 1.45,
    marginBottom: 5
  },
  italic: {
    transform: 'rotate(-90deg)'
  },
  paragraph: { lineHeight: 1.45, marginBottom: 8 },
  itemParagraph: { lineHeight: 1.45, marginBottom: 4 },
  item: { lineHeight: 1.45 },
  paragraph_indented: {
    lineHeight: 1.45,
    marginBottom: 10,
    paddingLeft: 15,
    paddingRight: 15
  },
  bold: { fontWeight: 700 },
  tableFirstRow: {
    flexDirection: 'row',
    borderLeftWidth: 2,
    borderTopWidth: 2,
    borderRightWidth: 2,
    borderColor: '#dddddd'
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderColor: '#dddddd'
  },
  tableRowLast: {
    flexDirection: 'row',
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderColor: '#dddddd'
  },
  tableRowCategory: {
    flexDirection: 'row',
    borderLeftWidth: 2,
    borderTopWidth: 3,
    borderRightWidth: 2,
    borderBottomWidth: 3
  },
  cellCategoryHeader: {
    width: '60%',
    borderRightWidth: 1,
    borderColor: '#dddddd',
    paddingHorizontal: 5,
    paddingVertical: 1,
    fontWeight: 700,
    fontSize: 11
  },
  cellChoiceCountHeader: {
    width: '40%',
    paddingHorizontal: 5,
    paddingVertical: 1,
    fontWeight: 700,
    fontSize: 11
  },
  cellCategoryName: {
    width: '60%',
    borderRightWidth: 1,
    borderColor: '#dddddd',
    paddingHorizontal: 5,
    paddingVertical: 1,
    fontWeight: 700,
    fontSize: 11,
    textTransform: 'uppercase'
  },
  cellCategoryPart: {
    width: '60%',
    borderRightWidth: 1,
    borderColor: '#dddddd',
    paddingHorizontal: 5,
    paddingVertical: 1,
    fontSize: 10
  },
  cellCategoryNamePercentGR: {
    width: '8%',
    borderRightWidth: 1,
    borderColor: '#dddddd',
    paddingHorizontal: 5,
    paddingVertical: 1,
    fontWeight: 700,
    fontSize: 11,
    textAlign: 'center'
  },
  cellCategoryNamePercentGNR: {
    width: '20%',
    borderRightWidth: 1,
    borderColor: '#dddddd',
    paddingHorizontal: 5,
    paddingVertical: 1,
    fontWeight: 700,
    fontSize: 11,
    textAlign: 'center'
  },
  cellCategoryNameCountGR: {
    width: '8%',
    borderRightWidth: 1,
    borderColor: '#dddddd',
    paddingHorizontal: 5,
    paddingVertical: 1,
    fontSize: 11,
    fontWeight: 700,
    textAlign: 'center'
  },
  cellCategoryNameCountMenGR: {
    width: '8%',
    borderRightWidth: 1,
    borderColor: '#dddddd',
    paddingHorizontal: 5,
    paddingVertical: 1,
    fontSize: 11,
    fontWeight: 700,
    textAlign: 'center',
    color: 'blue'
  },
  cellCategoryNameCountWomenGR: {
    width: '8%',
    borderRightWidth: 1,
    borderColor: '#dddddd',
    paddingHorizontal: 5,
    paddingVertical: 1,
    fontSize: 11,
    fontWeight: 700,
    textAlign: 'center',
    color: 'red'
  },
  cellCategoryNameCountOtherGR: {
    width: '8%',
    paddingHorizontal: 5,
    paddingVertical: 1,
    fontSize: 11,
    fontWeight: 700,
    textAlign: 'center',
    color: 'green'
  },
  cellCategoryNameCountGNR: {
    width: '20%',
    paddingHorizontal: 5,
    paddingVertical: 1,
    fontSize: 11,
    fontWeight: 700,
    textAlign: 'center'
  },
  cellCategoryPartPercentGR: {
    width: '8%',
    borderRightWidth: 1,
    borderColor: '#dddddd',
    paddingHorizontal: 5,
    paddingVertical: 1,
    fontSize: 10,
    textAlign: 'center'
  },
  cellCategoryPartPercentGNR: {
    width: '20%',
    borderRightWidth: 1,
    borderColor: '#dddddd',
    paddingHorizontal: 5,
    paddingVertical: 1,
    fontSize: 10,
    textAlign: 'center'
  },
  cellCategoryPartCountGR: {
    width: '8%',
    borderRightWidth: 1,
    borderColor: '#dddddd',
    paddingHorizontal: 5,
    paddingVertical: 1,
    fontSize: 10,
    textAlign: 'center'
  },
  cellCategoryPartCountMenGR: {
    width: '8%',
    borderRightWidth: 1,
    borderColor: '#dddddd',
    paddingHorizontal: 5,
    paddingVertical: 1,
    fontSize: 10,
    textAlign: 'center',
    color: 'blue'
  },
  cellCategoryPartCountWomenGR: {
    width: '8%',
    borderRightWidth: 1,
    borderColor: '#dddddd',
    paddingHorizontal: 5,
    paddingVertical: 1,
    fontSize: 10,
    textAlign: 'center',
    color: 'red'
  },
  cellCategoryPartCountOtherGR: {
    width: '8%',
    paddingHorizontal: 5,
    paddingVertical: 1,
    fontSize: 10,
    textAlign: 'center',
    color: 'green'
  },
  cellCategoryPartCountGNR: {
    width: '20%',
    paddingHorizontal: 5,
    paddingVertical: 1,
    fontSize: 10,
    textAlign: 'center'
  },
  cellVerticalMiddle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 5
  }
});

export default styles;
