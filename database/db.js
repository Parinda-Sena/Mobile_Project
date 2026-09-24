export const DATABASE_NAME = 'my_restaurant.db';

// ==========================================
// 1. ฟังก์ชันสร้างตารางและ Mock Data เริ่มต้น
// ==========================================
export const initDatabase = async (db) => {
  try {
    await db.execAsync('PRAGMA foreign_keys = ON;');

    await db.withTransactionAsync(async () => {
      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS category (
          category_id TEXT PRIMARY KEY,
          category_name TEXT NOT NULL
        );

        INSERT OR IGNORE INTO category (category_id, category_name) VALUES
          ('C001', 'Dessert'),
          ('C002', 'Beverage'),
          ('C003', 'Main Course'),
          ('C004', 'Appetizers');

        CREATE TABLE IF NOT EXISTS menu (
          menu_id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          price INTEGER NOT NULL CHECK (price >= 0),
          category_id TEXT NOT NULL,
          FOREIGN KEY(category_id)
            REFERENCES category(category_id) 
            ON DELETE RESTRICT
        );

        INSERT OR IGNORE INTO menu (menu_id, name, price, category_id) VALUES
          ('D001', 'Chocolate Bingsu', 189, 'C001'),
          ('D002', 'Honey Toast', 79, 'C001'),
          ('D003', 'Macarons', 45, 'C001'),
          ('D004', 'Blueberry Cheesecake', 65, 'C001'),
          ('D005', 'Banoffee Pie', 65, 'C001'),
          ('D006', 'Strawberry Bingsu', 189, 'C001'),
          ('D007', 'Orange Cake', 65, 'C001'),
          ('D008', 'Brownie', 45, 'C001'),
          ('D009', 'Oreo Bingsu', 189, 'C001'),
          ('D010', 'Volcano Bingsu', 189, 'C001'),

          ('B001', 'Pure Matcha', 70, 'C002'),
          ('B002', 'Matcha Latte', 65, 'C002'),
          ('B003', 'Strawberry Fresh Milk', 55, 'C002'),
          ('B004', 'Coke', 25, 'C002'),
          ('B005', 'Water', 10, 'C002'),
          ('B006', 'Cocoa Frappe', 60, 'C002'),
          ('B007', 'Iced Cocoa', 55, 'C002'),
          ('B008', 'Blue Hawaii', 50, 'C002'),
          ('B009', 'Latte', 55, 'C002'),
          ('B010', 'Cappucino', 60, 'C002'),

          ('M001', 'Ommlette on Rice', 40, 'C003'),
          ('M002', 'Tom Yum Goong', 150, 'C003'),
          ('M003', 'American Fried Rice', 70, 'C003'),
          ('M004', 'Pork Steak', 69, 'C003'),
          ('M005', 'Beef Steak', 89, 'C003'),
          ('M006', 'Spaghetti with Spicy Seafood', 79, 'C003'),
          ('M007', 'Spaghetti Carbonara', 79, 'C003'),
          ('M008', 'Stir-Fried Basil with Minced Pork on Rice', 50, 'C003'),
          ('M009', 'Pork Fried Rice', 50, 'C003'),
          ('M010', 'Deep-Fried Seabass with Fish Sauce', 180, 'C003'),

          ('A001', 'Shrimp Donut', 49, 'C004'),
          ('A002', 'French Fries', 49, 'C004'),
          ('A003', 'Chicken Nuggets', 49, 'C004'),
          ('A004', 'Chicken Pop', 49, 'C004'),
          ('A005', 'Egg Tart', 35, 'C004'),
          ('A006', 'Wingz Zabb', 49, 'C004'),
          ('A007', 'Cream of Truffle Mushroom Soup', 79, 'C004'),
          ('A008', 'Toast', 35, 'C004'),
          ('A009', 'Spinach with Cheese', 69, 'C004'),
          ('A010', 'Lasagna', 79, 'C004');

        CREATE TABLE IF NOT EXISTS tables (
          tables_id TEXT PRIMARY KEY,
          tables_number TEXT NOT NULL UNIQUE,
          tables_status TEXT NOT NULL DEFAULT 'available'
            CHECK (tables_status IN ('available', 'unavailable'))
        );

        INSERT OR IGNORE INTO tables(tables_id, tables_number, tables_status) VALUES
          ('T001', '1', 'unavailable'),
          ('T002', '2', 'available'),
          ('T003', '3', 'unavailable'),
          ('T004', '4', 'available'),
          ('T005', '5', 'available'),
          ('T006', '6', 'unavailable'),
          ('T007', '7', 'available'),
          ('T008', '8', 'unavailable'),
          ('T009', '9', 'unavailable'),
          ('T010', '10', 'unavailable'),
          ('T011', '11', 'unavailable'),
          ('T012', '12', 'available'),
          ('T013', '13', 'available'),
          ('T014', '14', 'available'),
          ('T015', '15', 'unavailable');

        CREATE TABLE IF NOT EXISTS bills (
          bills_id TEXT PRIMARY KEY,
          tables_id TEXT NOT NULL,
          bills_status TEXT NOT NULL DEFAULT 'open'
            CHECK (bills_status IN ('open', 'closed', 'cancel')),
          opened_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
          closed_at TEXT,
          FOREIGN KEY (tables_id)
            REFERENCES tables(tables_id)
            ON DELETE RESTRICT
        );

        INSERT OR IGNORE INTO bills (bills_id, tables_id, bills_status, opened_at, closed_at) VALUES
          ('S001', 'T001', 'open', '2026-09-24 11:15:00', NULL),
          ('S002', 'T003', 'open', '2026-09-24 11:27:08', NULL),
          ('S003', 'T005', 'closed', '2026-09-24 10:12:12', '2026-09-24 12:19:19');

        CREATE TABLE IF NOT EXISTS orders (
          order_id TEXT PRIMARY KEY,
          bills_id TEXT NOT NULL,
          round INTEGER NOT NULL CHECK (round > 0),
          ordered_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (bills_id)
            REFERENCES bills(bills_id) 
            ON DELETE CASCADE
        );

        INSERT OR IGNORE INTO orders (order_id, bills_id, round, ordered_at) VALUES
          ('O001', 'S001', 2, '2026-09-24 11:24:20'),
          ('O002', 'S002', 1, '2026-09-24 11:38:28'),
          ('O003', 'S003', 1, '2026-09-24 10:38:28');

        CREATE TABLE IF NOT EXISTS order_item (
          order_item_id TEXT PRIMARY KEY,
          order_id TEXT NOT NULL,
          menu_id TEXT NOT NULL,
          quantity INTEGER NOT NULL CHECK (quantity > 0),
          note TEXT,
          order_item_status TEXT NOT NULL DEFAULT 'pending'
            CHECK (order_item_status IN ('pending', 'cooking', 'served', 'cancel')),
          order_item_price INTEGER NOT NULL CHECK (order_item_price >= 0),
          FOREIGN KEY (order_id)
            REFERENCES orders(order_id)
            ON DELETE CASCADE,
          FOREIGN KEY (menu_id)
            REFERENCES menu(menu_id)
            ON DELETE RESTRICT
        );

        INSERT OR IGNORE INTO order_item (order_item_id, order_id, menu_id, quantity, note, order_item_status, order_item_price) VALUES
          ('F001', 'O001', 'B002', 2, NULL, 'pending', 65),
          ('F002', 'O001', 'M005', 1, 'I like a medium rare.', 'pending', 89),
          ('F003', 'O001', 'M006', 1, 'I like a medium rare.', 'pending', 79);

        CREATE INDEX IF NOT EXISTS idx_bills_tables_status ON bills(tables_id, bills_status);
        CREATE INDEX IF NOT EXISTS idx_order_item_order_id ON order_item(order_id);
      `);
    });

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database init error:', error);
    throw error;
  }
};

// ==========================================
// 2. ระบบยืนยันตัวตน (Login System)
// ==========================================
export const loginUser = async (db, username, password) => {
  try {
    const user = await db.getFirstAsync(
      'SELECT * FROM users WHERE username = ? AND password = ?',
      [username, password]
    );

    if (!user && username === 'admin' && password === '1234') {
      return { id: 1, username: 'admin', role: 'staff' };
    }

    return user;
  } catch (error) {
    if (username === 'admin' && password === '1234') {
      return { id: 1, username: 'admin', role: 'staff' };
    }
    console.error('Error executing loginUser:', error);
    throw error;
  }
};

// ==========================================
// 3. ฟังก์ชันจัดการเมนู (Menu Queries)
// ==========================================
export const getMenuByCategory = async (db, categoryId) => {
  return await db.getAllAsync(
    'SELECT menu_id, name, price, category_id FROM menu WHERE category_id = ?',
    [categoryId]
  );
};

export const getAppetizers = async (db) => await getMenuByCategory(db, 'C004');
export const getDesserts = async (db) => await getMenuByCategory(db, 'C001');
export const getBeverages = async (db) => await getMenuByCategory(db, 'C002');
export const getMainCourses = async (db) => await getMenuByCategory(db, 'C003');

// ==========================================
// 4. ฟังก์ชันจัดการโต๊ะและบิล (Tables & Bills)
// ==========================================
export const getAllTables = async (db) => {
  return await db.getAllAsync('SELECT * FROM tables ORDER BY CAST(tables_number AS INTEGER) ASC');
};

export const getOpenBillByTable = async (db, tableId) => {
  return await db.getFirstAsync(
    'SELECT * FROM bills WHERE tables_id = ? AND bills_status = "open"',
    [tableId]
  );
};

// ==========================================
// 5. ฟังก์ชันสำหรับห้องครัว (Kitchen Queries)
// ==========================================
export const getPendingOrderItems = async (db) => {
  const query = `
    SELECT 
      oi.order_item_id,
      oi.order_id,
      oi.menu_id,
      oi.quantity,
      oi.note,
      oi.order_item_status,
      oi.order_item_price,
      m.name AS menu_name,
      t.tables_number,
      o.round,
      o.ordered_at
    FROM order_item oi
    JOIN menu m ON oi.menu_id = m.menu_id
    JOIN orders o ON oi.order_id = o.order_id
    JOIN bills b ON o.bills_id = b.bills_id
    JOIN tables t ON b.tables_id = t.tables_id
    WHERE oi.order_item_status IN ('pending', 'cooking')
    ORDER BY o.ordered_at ASC;
  `;
  return await db.getAllAsync(query);
};

export const getOrderItems = async (db) => {
  const query = `
    SELECT 
      oi.order_item_id,
      oi.order_id,
      oi.menu_id,
      oi.quantity,
      oi.note,
      oi.order_item_status,
      oi.order_item_price,
      m.name AS menu_name,
      t.tables_number,
      o.round,
      o.ordered_at
    FROM order_item oi
    JOIN menu m ON oi.menu_id = m.menu_id
    JOIN orders o ON oi.order_id = o.order_id
    JOIN bills b ON o.bills_id = b.bills_id
    JOIN tables t ON b.tables_id = t.tables_id
    ORDER BY o.ordered_at DESC;
  `;
  return await db.getAllAsync(query);
};

export const updateOrderStatus = async (db, orderItemId, status) => {
  return await db.runAsync(
    'UPDATE order_item SET order_item_status = ? WHERE order_item_id = ?',
    [status, orderItemId]
  );
};

export const updateOrderItemStatus = async (db, orderItemId, status) => {
  return await db.runAsync(
    'UPDATE order_item SET order_item_status = ? WHERE order_item_id = ?',
    [status, orderItemId]
  );
};

// ==========================================
// 6. ฟังก์ชันสรุปยอดขาย (Sales Summary Queries)
// ==========================================
export const getSalesSummary = async (db) => {
  const query = `
    SELECT 
      COUNT(DISTINCT b.bills_id) AS closed_bills,
      COALESCE(SUM(oi.quantity * oi.order_item_price), 0) AS total_sales,
      COALESCE(SUM(oi.quantity), 0) AS sold_items
    FROM bills b
    JOIN orders o ON b.bills_id = o.bills_id
    JOIN order_item oi ON o.order_id = oi.order_id
    WHERE b.bills_status = 'closed' 
      AND oi.order_item_status != 'cancel';
  `;
  return await db.getFirstAsync(query);
};

export const getSoldMenuSummary = async (db) => {
  const query = `
    SELECT 
      m.menu_id,
      m.name AS menu_name,
      SUM(oi.quantity) AS quantity,
      SUM(oi.quantity * oi.order_item_price) AS total
    FROM order_item oi
    JOIN menu m ON oi.menu_id = m.menu_id
    JOIN orders o ON oi.order_id = o.order_id
    JOIN bills b ON o.bills_id = b.bills_id
    WHERE b.bills_status = 'closed' 
      AND oi.order_item_status != 'cancel'
    GROUP BY m.menu_id, m.name
    ORDER BY total DESC;
  `;
  return await db.getAllAsync(query);
};