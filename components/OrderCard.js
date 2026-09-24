import { Text, View } from 'react-native';
import { kitchenStyles } from '../styles/kitchenStyles';
import OrderItem from './OrderItem';

const OrderCard = ({ item, showStatus = false, children }) => {
  return (
    <View style={kitchenStyles.card}>
      <View style={kitchenStyles.header}>
        <Text style={kitchenStyles.table}>
          โต๊ะ {item.tables_number}
        </Text>

        <Text style={kitchenStyles.bill}>
          {item.bills_id}
        </Text>
      </View>

      <OrderItem
        item={item}
        showStatus={showStatus}
      >
        {children}
      </OrderItem>
    </View>
  );
};

export default OrderCard;