import { StyleSheet } from 'react-native';
import { colors } from './theme';

export const kitchenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    padding: 16,
  },

  card: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },

  table: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },

  bill: {
    fontSize: 13,
    color: colors.dim,
  },

  row: {
    marginTop: 7,
  },

  label: {
    fontSize: 13,
    color: colors.dim,
    marginBottom: 2,
  },

  value: {
    fontSize: 16,
    color: colors.text,
  },

  menu: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },

  quantity: {
    fontSize: 16,
    color: colors.cyan,
    marginTop: 4,
  },

  noteBox: {
    backgroundColor: colors.bg,
    borderRadius: 8,
    padding: 10,
    marginTop: 10,
  },

  note: {
    color: colors.text,
    fontSize: 14,
  },

  statusBox: {
    marginTop: 12,
  },

  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },

  emptyText: {
    color: colors.dim,
    fontSize: 16,
    textAlign: 'center',
  },
});