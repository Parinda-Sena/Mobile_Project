import { Picker } from '@react-native-picker/picker';
import { View } from 'react-native';

import { kitchenStyles } from '../styles/kitchenStyles';
import { colors } from '../styles/theme';

const StatusDropdown = ({ value, onChange }) => {
  return (
    <View
      style={[
        kitchenStyles.statusBox,
        {
          borderWidth: 1,
          borderColor: colors.border,
          borderRadius: 10,
          overflow: 'hidden',
        },
      ]}
    >
      <Picker
        selectedValue={value}
        onValueChange={onChange}
      >
        <Picker.Item
          label="รอทำ"
          value="pending"
        />

        <Picker.Item
          label="กำลังทำ"
          value="cooking"
        />

        <Picker.Item
          label="เสิร์ฟแล้ว"
          value="served"
        />
      </Picker>
    </View>
  );
};

export default StatusDropdown;