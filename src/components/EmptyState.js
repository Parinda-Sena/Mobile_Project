import { Text, View } from 'react-native';
import { kitchenStyles } from '../styles/kitchenStyles';

const EmptyState = ({ text = 'ไม่มีรายการ' }) => {
  return (
    <View style={kitchenStyles.empty}>
      <Text style={kitchenStyles.emptyText}>
        {text}
      </Text>
    </View>
  );
};

export default EmptyState;