import { Text, View } from 'react-native';
import { kitchenStyles } from '../styles/kitchenStyles';

const OrderItem = ({ item, showStatus = false, children }) => {
  return (
    <View>
      <View style={kitchenStyles.row}>
        <Text style={kitchenStyles.menu}>
          {item.menu_name}
        </Text>

        <Text style={kitchenStyles.quantity}>
          จำนวน {item.quantity} รายการ
        </Text>
      </View>

      <View style={kitchenStyles.row}>
        <Text style={kitchenStyles.label}>
          โต๊ะ
        </Text>

        <Text style={kitchenStyles.value}>
          {item.tables_number}
        </Text>
      </View>

      <View style={kitchenStyles.row}>
        <Text style={kitchenStyles.label}>
          รอบที่
        </Text>

        <Text style={kitchenStyles.value}>
          {item.round}
        </Text>
      </View>

      <View style={kitchenStyles.row}>
        <Text style={kitchenStyles.label}>
          เวลา
        </Text>

        <Text style={kitchenStyles.value}>
          {item.ordered_at}
        </Text>
      </View>

      {item.note ? (
        <View style={kitchenStyles.noteBox}>
          <Text style={kitchenStyles.note}>
            หมายเหตุ: {item.note}
          </Text>
        </View>
      ) : null}

      {showStatus && children}
    </View>
  );
};

export default OrderItem;