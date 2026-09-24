import {
    Text,
    TextInput,
    View,
} from 'react-native';

import { colors } from '../styles/theme';

const Field = ({
  label,
  placeholder,
  secureTextEntry = false,
  autoCapitalize = 'sentences',
  value,
  onChangeText,
  error,
  hint,
}) => {
  return (
    <View style={{ width: '100%', marginBottom: 16 }}>

      <Text
        style={{
          fontSize: 15,
          color: colors.text,
          marginBottom: 6,
        }}
      >
        {label}
      </Text>

      <TextInput
        style={{
          width: '100%',
          backgroundColor: colors.card,
          borderWidth: 1,
          borderColor: error
            ? colors.red
            : colors.border,
          borderRadius: 10,
          paddingHorizontal: 15,
          paddingVertical: 12,
          fontSize: 16,
          color: colors.text,
        }}
        placeholder={placeholder}
        placeholderTextColor={colors.dim}
        secureTextEntry={secureTextEntry}
        autoCapitalize={autoCapitalize}
        value={value}
        onChangeText={onChangeText}
      />

      {error ? (
        <Text
          style={{
            color: colors.red,
            fontSize: 13,
            marginTop: 5,
          }}
        >
          {error}
        </Text>
      ) : null}

      {hint ? (
        <Text
          style={{
            color: colors.dim,
            fontSize: 12,
            marginTop: 5,
          }}
        >
          {hint}
        </Text>
      ) : null}

    </View>
  );
};

export default Field;