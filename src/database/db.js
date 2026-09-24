export const DATABASE_NAME = 'my_restaurant.db';
export const initDatabase = async (db) => {
  try {
    await db.execAsync('PRAGMA foreign_keys = ON;');

    await db.execAsync(`
      DROP TABLE IF EXISTS order_item;
      DROP TABLE IF EXISTS orders;
      DROP TABLE IF EXISTS bills;
      DROP TABLE IF EXISTS tables;
      DROP TABLE IF EXISTS menu;
      DROP TABLE IF EXISTS category;

      CREATE TABLE category (
        category_id TEXT PRIMARY KEY,
        category_name TEXT NOT NULL
      );

      INSERT INTO category (category_id, category_name) VALUES
      ('C001', 'Dessert'),
      ('C002', 'Beverage'),
      ('C003', 'Main Course'),
      ('C004', 'Appetizers');

      CREATE TABLE menu (
        menu_id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        price INTEGER NOT NULL CHECK (price >= 0),
        category_id TEXT NOT NULL,
        FOREIGN KEY (category_id) REFERENCES category(category_id) ON DELETE RESTRICT
      );

      INSERT INTO menu (menu_id, name, price, category_id) VALUES
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

      CREATE TABLE tables (
        tables_id TEXT PRIMARY KEY,
        tables_number TEXT NOT NULL UNIQUE,
        tables_status TEXT NOT NULL DEFAULT 'available' CHECK (tables_status IN ('available', 'unavailable'))
      );

      INSERT INTO tables (tables_id, tables_number, tables_status) VALUES
      ('T001', '1', 'unavailable'),
      ('T002', '2', 'available'),
      ('T003', '3', 'unavailable'),
      ('T004', '4', 'available'),
      ('T005', '5', 'available');

      CREATE TABLE bills (
        bills_id TEXT PRIMARY KEY,
        tables_id TEXT NOT NULL,
        bills_status TEXT NOT NULL DEFAULT 'open' CHECK (bills_status IN ('open', 'closed', 'cancel')),
        opened_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        closed_at TEXT,
        FOREIGN KEY (tables_id) REFERENCES tables(tables_id) ON DELETE RESTRICT
      );

      INSERT INTO bills (bills_id, tables_id, bills_status, opened_at, closed_at) VALUES
      ('S001', 'T001', 'open', '2026-09-24 11:15:00', NULL),
      ('S002', 'T003', 'open', '2026-09-24 11:27:08', NULL),
      ('S003', 'T005', 'closed', '2026-09-24 10:12:12', '2026-09-24 12:19:19');

      CREATE TABLE orders (
        order_id TEXT PRIMARY KEY,
        bills_id TEXT NOT NULL,
        round INTEGER NOT NULL CHECK (round > 0),
        ordered_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (bills_id) REFERENCES bills(bills_id) ON DELETE CASCADE
      );

      INSERT INTO orders (order_id, bills_id, round, ordered_at) VALUES
      ('O001', 'S001', 2, '2026-09-24 11:24:20'),
      ('O002', 'S002', 1, '2026-09-24 11:38:28'),
      ('O003', 'S003', 1, '2026-09-24 10:38:28');

      CREATE TABLE order_item (
        order_item_id TEXT PRIMARY KEY,
        order_id TEXT NOT NULL,
        menu_id TEXT NOT NULL,
        quantity INTEGER NOT NULL CHECK (quantity > 0),
        note TEXT,
        order_item_status TEXT NOT NULL DEFAULT 'pending' CHECK (order_item_status IN ('pending', 'cooking', 'served', 'cancel')),
        order_item_price INTEGER NOT NULL CHECK (order_item_price >= 0),
        FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
        FOREIGN KEY (menu_id) REFERENCES menu(menu_id) ON DELETE RESTRICT
      );

      INSERT INTO order_item (order_item_id, order_id, menu_id, quantity, note, order_item_status, order_item_price) VALUES
      ('F001', 'O001', 'B002', 2, NULL, 'pending', 130),
      ('F002', 'O001', 'M005', 1, 'I like a medium rare.', 'pending', 89),
      ('F003', 'O001', 'M006', 1, 'I like a medium rare.', 'pending', 79);

      CREATE INDEX IF NOT EXISTS idx_bills_tables_status ON bills(tables_id, bills_status);
      CREATE INDEX IF NOT EXISTS idx_order_item_order_id ON order_item(order_id);
    `);

    console.log('Database reset & initialized successfully');
  } catch (error) {
    console.error('Database init error:', error);
  }
};
