import { StyleSheet } from 'react-native';
import { colors } from './theme';

export const appStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    padding: 24,
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.bg,
    padding: 24,
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 30,
  },

  subtitle: {
    fontSize: 16,
    color: colors.dim,
    textAlign: 'center',
    marginBottom: 20,
  },

  buttonSpace: {
    height: 16,
  },

  input: {
    width: '100%',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text,
    marginBottom: 12,
  },
});