import { StyleSheet } from 'react-native';
import { colors } from './theme';

export const salesStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    padding: 16,
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },

  summaryCard: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    padding: 18,
    marginBottom: 12,
  },

  summaryLabel: {
    fontSize: 14,
    color: colors.dim,
    marginBottom: 6,
  },

  summaryValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
  },

  menuCard: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },

  menuName: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.text,
  },

  menuDetail: {
    marginTop: 5,
    color: colors.dim,
    fontSize: 14,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 12,
    marginBottom: 12,
  },
});