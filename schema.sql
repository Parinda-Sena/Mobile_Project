--  เปิดการใช้งาน Foreign Key
PRAGMA foreign_keys = ON;

-- category เก็บหมวดหมู่
CREATE TABLE category (
    category_id INTEGER PRIMARY KEY AUTOINCREMENT,
    category_name TEXT NOT NULL

    -- เพิ่มข้อมูลหมวดหมู่
INSERT OR IGNORE INTO category (category_id,category_name) VALUE
(A001,Dessert),
(A002,Beverage),
(A003,Main Course),
(A004,Appetizers);
);

-- menu เก็บเมนูอาหารและราคาปัจจุบัน
CREATE TABLE menu (
    menu_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    price INTEGER NOT NULL CHECK (price >= 0),
    category_id INTEGER NOT NULL,
    FOREIGN KEY (category_id) REFERENCES category(category_id) ON DELETE RESTRICT

     -- เพิ่มข้อมูลเมนู
INSERT OR IGNORE INTO menu (menu_id,name,price,category_id) VALUE
(B001,Dessert),
(A002,Beverage),
(A003,Main Course),
(A004,Appetizers);
);
);

-- table เก็บข้อมูลโต๊ะในร้าน
CREATE TABLE tables (
    tables_id INTEGER PRIMARY KEY AUTOINCREMENT,
    tables_number TEXT NOT NULL UNIQUE,
    tables_status TEXT NOT NULL DEFAULT 'available' CHECK (tables_status IN ('available', 'unavailable'))
);

-- bills เก็บข้อมูลบิล
CREATE TABLE bills (
    bills_id INTEGER PRIMARY KEY AUTOINCREMENT,
    tables_id INTEGER NOT NULL,
    opened_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    closed_at TEXT,
    bills_status TEXT NOT NULL DEFAULT 'open' CHECK (bills_status IN ('open', 'closed', 'cancel')),
    FOREIGN KEY (tables_id) REFERENCES tables(tables_id) ON DELETE RESTRICT
);

 -- orders เก็บข้อมูลการสั่งซื้อ
CREATE TABLE orders (
    order_id INTEGER PRIMARY KEY AUTOINCREMENT,
    bills_id INTEGER NOT NULL,
    round INTEGER NOT NULL CHECK (round > 0),
    ordered_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (bills_id) REFERENCES bills(bills_id) ON DELETE CASCADE
);

-- เก็บข้อมูลรายการการสั่งซื้ออาหารในแต่ละรอบ
CREATE TABLE order_item (
    order_item_id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL,
    menu_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    note TEXT,
    order_item_status TEXT NOT NULL DEFAULT 'pending' CHECK (order_item_status IN ('pending', 'cooking', 'served', 'cancel')),
    order_item_price INTEGER NOT NULL CHECK (order_item_price >= 0),
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (menu_id) REFERENCES menu(menu_id) ON DELETE RESTRICT
);

-- คำสั่ง CREATE INDEX 
CREATE INDEX idx_bills_tables_status ON bills(tables_id, bills_status);
CREATE INDEX idx_order_item_order_id ON order_item(order_id);
