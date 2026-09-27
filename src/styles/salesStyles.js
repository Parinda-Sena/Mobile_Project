import { StyleSheet } from 'react-native';
import { colors } from './Theme';

export const salesStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    padding: 16,
    paddingTop: 50, // เว้นขอบบนหลบขอบจอมือถือ
  },

  // ส่วนหัวข้อและปุ่มย้อนกลับ
  headerContainer: {
    marginBottom: 16,
  },
  backBtn: {
    marginBottom: 8,
  },
  backText: {
    fontSize: 16,
    color: colors.dim,
    fontWeight: '600',
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },

  // การ์ดยอดขายรวม (เน้นให้เด่นที่สุด)
  mainCard: {
    backgroundColor: colors.card,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    alignItems: 'center',
  },
  mainLabel: {
    fontSize: 14,
    color: colors.dim,
    marginBottom: 6,
  },
  mainValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text,
  },

  // แถวสถิติย่อยแบบ 2 คอลัมน์คู่กัน
  rowStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    padding: 16,
    marginHorizontal: 4, // เว้นช่องไฟซ้ายขวาเล็กน้อย
  },

  summaryLabel: {
    fontSize: 13,
    color: colors.dim,
    marginBottom: 6,
  },

  summaryValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 12,
    marginBottom: 12,
  },

  // การ์ดรายการอาหาร (จัดเลย์เอาต์ซ้าย-ขวาให้ดูโปร่งขึ้น)
  menuCard: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  menuName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },

  menuDetail: {
    color: colors.dim,
    fontSize: 13,
  },

  menuTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
  },

  emptyContainer: {
    padding: 24,
    alignItems: 'center',
  },
});