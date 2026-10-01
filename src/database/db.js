export const DATABASE_NAME = 'my_restaurant.db';

export const initDatabase = async (db) => {
  try {
    // เปิดใช้งาน Foreign Key
    await db.execAsync('PRAGMA foreign_keys = ON;');

    // Transaction
    await db.withTransactionAsync(async () => {
      await db.execAsync(`

        -- category
        -- เก็บหมวดหมู่ของอาหาร

        CREATE TABLE IF NOT EXISTS category (
          category_id TEXT PRIMARY KEY,
          category_name TEXT NOT NULL
        );

        INSERT OR IGNORE INTO category
        (category_id, category_name) VALUES
          ('C001', 'Dessert'),
          ('C002', 'Beverage'),
          ('C003', 'Main Course'),
          ('C004', 'Appetizers');


        -- menu
        -- เก็บเมนูอาหารและราคาปัจจุบัน

        CREATE TABLE IF NOT EXISTS menu (
          menu_id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          price INTEGER NOT NULL
            CHECK (price >= 0),
          category_id TEXT NOT NULL,
          available INTEGER NOT NULL DEFAULT 1
            CHECK (available IN (0, 1)),
          FOREIGN KEY (category_id)
            REFERENCES category(category_id)
            ON DELETE RESTRICT
        );

        INSERT OR IGNORE INTO menu
        (menu_id, name, price, category_id) VALUES
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


        -- tables
        -- เก็บข้อมูลโต๊ะ (กำหนดให้ทุกโต๊ะเริ่มเป็นสถานะ available ทั้งหมด)

        CREATE TABLE IF NOT EXISTS tables (
          tables_id TEXT PRIMARY KEY,
          tables_number TEXT NOT NULL UNIQUE,
          tables_status TEXT NOT NULL DEFAULT 'available'
            CHECK (
              tables_status IN ('available', 'unavailable')
            )
        );

        INSERT OR IGNORE INTO tables
        (tables_id, tables_number, tables_status) VALUES
          ('T001', '1', 'available'),
          ('T002', '2', 'available'),
          ('T003', '3', 'available'),
          ('T004', '4', 'available'),
          ('T005', '5', 'available'),
          ('T006', '6', 'available'),
          ('T007', '7', 'available'),
          ('T008', '8', 'available'),
          ('T009', '9', 'available'),
          ('T010', '10', 'available'),
          ('T011', '11', 'available'),
          ('T012', '12', 'available'),
          ('T013', '13', 'available'),
          ('T014', '14', 'available'),
          ('T015', '15', 'available');


        -- bills
        -- เก็บข้อมูลบิลของแต่ละโต๊ะ (ลบข้อมูลจำลองออก)

        CREATE TABLE IF NOT EXISTS bills (
          bills_id TEXT PRIMARY KEY,
          tables_id TEXT NOT NULL,
          bills_status TEXT NOT NULL DEFAULT 'open'
            CHECK (
              bills_status IN ('open', 'closed', 'cancel')
            ),
          opened_at TEXT NOT NULL
            DEFAULT CURRENT_TIMESTAMP,
          closed_at TEXT,
          FOREIGN KEY (tables_id)
            REFERENCES tables(tables_id)
            ON DELETE RESTRICT
        );


        -- orders
        -- เก็บข้อมูลการสั่งซื้อแต่ละรอบ (ลบข้อมูลจำลองออก)

        CREATE TABLE IF NOT EXISTS orders (
          order_id TEXT PRIMARY KEY,
          bills_id TEXT NOT NULL,
          round INTEGER NOT NULL
            CHECK (round > 0),
          ordered_at TEXT NOT NULL
            DEFAULT CURRENT_TIMESTAMP,
          UNIQUE (bills_id, round),
          FOREIGN KEY (bills_id)
            REFERENCES bills(bills_id)
            ON DELETE CASCADE
        );


        -- order_item
        -- เก็บรายการอาหารในแต่ละรอบ (ลบข้อมูลจำลองออก)

        CREATE TABLE IF NOT EXISTS order_item (
          order_item_id TEXT PRIMARY KEY,
          order_id TEXT NOT NULL,
          menu_id TEXT NOT NULL,
          quantity INTEGER NOT NULL
            CHECK (quantity > 0),
          note TEXT,
          order_item_status TEXT NOT NULL DEFAULT 'pending'
            CHECK (
              order_item_status IN (
                'pending',
                'cooking',
                'served',
                'cancel'
              )
            ),
          order_item_price INTEGER NOT NULL
            CHECK (order_item_price >= 0),
          FOREIGN KEY (order_id)
            REFERENCES orders(order_id)
            ON DELETE CASCADE,
          FOREIGN KEY (menu_id)
            REFERENCES menu(menu_id)
            ON DELETE RESTRICT
        );


        -- INDEX

        CREATE INDEX IF NOT EXISTS idx_bills_tables_status
        ON bills(tables_id, bills_status);

        CREATE INDEX IF NOT EXISTS idx_order_item_order_id
        ON order_item(order_id);

        CREATE INDEX IF NOT EXISTS idx_menu_name
        ON menu(name);

        CREATE INDEX IF NOT EXISTS idx_orders_ordered_at
        ON orders(ordered_at);

      `);
    });

    console.log('Database initialized successfully (Clean version)');

  } catch (error) {
    console.error('Database init error:', error);
    throw error;
  }
};

// RESET DATABASE
export const resetDatabase = async (db) => {
  try {
    await db.withTransactionAsync(async () => {
      await db.execAsync(`
        DROP TABLE IF EXISTS order_item;
        DROP TABLE IF EXISTS orders;
        DROP TABLE IF EXISTS bills;
        DROP TABLE IF EXISTS tables;
        DROP TABLE IF EXISTS menu;
        DROP TABLE IF EXISTS category;
      `);
    });

    await initDatabase(db);
    console.log('Database reset successfully');

  } catch (error) {
    console.error('Database reset error:', error);
    throw error;
  }
};

// ส่วนฟังก์ชัน Query

// ดึงรายการอาหารทั้งหมดสำหรับหน้าครัว/สถานะ
export const getOrderItems = async (db) => {
  try {
    const query = `
      SELECT
        oi.order_item_id,
        oi.order_id,
        b.bills_id,
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
      WHERE b.bills_status = ?
    `;

    return await db.getAllAsync(query, ['open']);
  } catch (error) {
    console.error('Error getting order items:', error);
    throw error;
  }
};

// อัปเดตสถานะรายการอาหาร (เช่น เปลี่ยนจาก pending เป็น cooking หรือ served)
export const updateOrderStatus = async (db, orderItemId, newStatus) => {
  try {
    const query = `
      UPDATE order_item 
      SET order_item_status = ? 
      WHERE order_item_id = ?
    `;
    await db.runAsync(query, [newStatus, orderItemId]);
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};

// ค้นหาชื่อเมนู
export const searchMenuItems = async (db, searchQuery) => {
  try {
    const query = 'SELECT menu_id, name, price, category_id FROM menu WHERE name LIKE ?';
    const results = await db.getAllAsync(query, [`%${searchQuery.trim()}%`]);
    return results;
  } catch (error) {
    console.error('Error searching menu:', error);
    return [];
  }
};

// ดึงเมนูตามหมวดหมู่
export const getMenuItemsByCategory = async (db, categoryId) => {
  try {
    const query = 'SELECT menu_id, name, price, category_id FROM menu WHERE category_id = ?';
    const result = await db.getAllAsync(query, [categoryId]);
    return result;
  } catch (error) {
    console.error('Error loading menu by category:', error);
    return [];
  }
};


// เพิ่มฟังก์ชันสรุปยอดขายสำหรับ SalesSummaryScreen
// ดึงสรุปยอดขายรวมและจำนวนบิลที่ปิดแล้ว (bills_status = 'closed')
export const getSalesSummary = async (db) => {
  try {
    // 1. นับจำนวนบิลเฉพาะที่ปิดแล้ว (closed) จริงๆ และใช้ COUNT(DISTINCT bills_id) ป้องกันการนับซ้ำ
    const billResult = await db.getFirstAsync(`
      SELECT COUNT(DISTINCT b.bills_id) AS closed_bills, 
             COALESCE(SUM(oi.order_item_price * oi.quantity), 0) AS total_sales
      FROM bills b
      JOIN orders o ON b.bills_id = o.bills_id
      JOIN order_item oi ON o.order_id = oi.order_id
      WHERE b.bills_status = 'closed' AND oi.order_item_status != 'cancel'
    `);

    // 2. นับจำนวนรายการอาหารทั้งหมดที่ขายได้ (นับจำนวนชิ้นที่สั่ง)
    const itemResult = await db.getFirstAsync(`
      SELECT COALESCE(SUM(oi.quantity), 0) AS sold_items
      FROM bills b
      JOIN orders o ON b.bills_id = o.bills_id
      JOIN order_item oi ON o.order_id = oi.order_id
      WHERE b.bills_status = 'closed' AND oi.order_item_status != 'cancel'
    `);

    return {
      closed_bills: billResult?.closed_bills || 0,
      total_sales: billResult?.total_sales || 0,
      sold_items: itemResult?.sold_items || 0,
    };
  } catch (error) {
    console.error('getSalesSummary error:', error);
    throw error;
  }
};

//ดึงรายการอาหารที่ขายได้แยกตามเมนู (เฉพาะบิลที่ปิดแล้ว)
export const getSoldMenuSummary = async (db) => {
  try {
    const query = `
      SELECT 
        m.menu_id,
        m.name as menu_name,
        SUM(oi.quantity) as quantity,
        SUM(oi.quantity * oi.order_item_price) as total
      FROM bills b
      JOIN orders o ON b.bills_id = o.bills_id
      JOIN order_item oi ON o.order_id = oi.order_id
      JOIN menu m ON oi.menu_id = m.menu_id
      WHERE b.bills_status = 'closed'
      GROUP BY m.menu_id, m.name
    `;
    const result = await db.getAllAsync(query);
    return result;
  } catch (error) {
    console.error('Error getting sold menu summary:', error);
    throw error;
  }
};
export const getTables = async (db) => {
  try {
    const query = `
      SELECT
        tables_id,
        tables_number,
        tables_status
      FROM tables
      ORDER BY CAST(tables_number AS INTEGER)
    `;

    return await db.getAllAsync(query);
  } catch (error) {
    console.error('Error getting tables:', error);
    throw error;
  }
};

// สร้าง Order จาก Cart และบันทึกลง Database
export const createOrder = async (db, tablesId, cart) => {
  try {
    if (!tablesId) {
      throw new Error('ไม่พบโต๊ะที่เลือก');
    }

    if (!cart || cart.length === 0) {
      throw new Error('ไม่มีรายการอาหารในตะกร้า');
    }

    let createdOrder = null;

    await db.withTransactionAsync(async () => {

      // ตรวจสอบว่าโต๊ะมีอยู่จริง
      const table = await db.getFirstAsync(
        `
        SELECT tables_id, tables_number, tables_status
        FROM tables
        WHERE tables_id = ?
        `,
        [tablesId]
      );

      if (!table) {
        throw new Error('ไม่พบโต๊ะที่เลือก');
      }

      // หา Bill ที่ยังเปิดอยู่ของโต๊ะนี้
      let bill = await db.getFirstAsync(
        `
        SELECT bills_id
        FROM bills
        WHERE tables_id = ?
          AND bills_status = ?
        ORDER BY opened_at DESC
        LIMIT 1
        `,
        [tablesId, 'open']
      );

      //ถ้ายังไม่มี Bill ให้สร้างใหม่
      if (!bill) {
        const billsId = `S${Date.now()}`;

        await db.runAsync(
          `INSERT INTO bills (bills_id,tables_id,bills_status)VALUES (?, ?, ?)`,
          [
            billsId,
            tablesId,
            'open',
          ]
        );

        bill = {
          bills_id: billsId,
        };
      }

      //หาเลขรอบถัดไปของ Bill นี้
      const roundResult = await db.getFirstAsync(
        `
        SELECT COALESCE(MAX(round), 0) + 1 AS next_round
        FROM orders
        WHERE bills_id = ?
        `,
        [bill.bills_id]
      );

      const nextRound = roundResult?.next_round || 1;

      //สร้าง Order
      const orderId = `O${Date.now()}`;

      await db.runAsync(
        `
        INSERT INTO orders (
          order_id,
          bills_id,
          round
        )
        VALUES (?, ?, ?)
        `,
        [
          orderId,
          bill.bills_id,
          nextRound,
        ]
      );

      // 6. เพิ่มอาหารแต่ละรายการลง order_item
      for (let index = 0; index < cart.length; index++) {

        const item = cart[index];

        // ตรวจสอบ menu จาก Database
        const menu = await db.getFirstAsync(
          `
          SELECT menu_id, price, available
          FROM menu
          WHERE menu_id = ?
          `,
          [item.menu_id]
        );

        if (!menu) {
          throw new Error(
            `ไม่พบเมนู ${item.menu_id}`
          );
        }

        if (menu.available !== 1) {
          throw new Error(
            `เมนู ${item.name || item.menu_id} ไม่พร้อมขาย`
          );
        }

        if (!item.quantity || item.quantity <= 0) {
          throw new Error(
            `จำนวนของ ${item.name || item.menu_id} ไม่ถูกต้อง`
          );
        }

        const orderItemId =
          `F${Date.now()}${index}`;

        await db.runAsync(
          ` INSERT INTO order_item ( order_item_id, order_id, menu_id, quantity, note,
          order_item_status, order_item_price)VALUES (?, ?, ?, ?, ?, ?, ?) `,
          [
            orderItemId,
            orderId,
            menu.menu_id,
            item.quantity,
            item.note || null,
            'pending',
            menu.price,
          ]
        );
      }
      //เปลี่ยนสถานะโต๊ะเป็นไม่ว่าง
      await db.runAsync(
        `
        UPDATE tables
        SET tables_status = ?
        WHERE tables_id = ?
        `,
        [
          'unavailable',
          tablesId,
        ]
      );

      createdOrder = {
        orderId,
        billsId: bill.bills_id,
        round: nextRound,
        tablesId,
        tablesNumber: table.tables_number,
      };
    });

    console.log(
      'Order created successfully:',
      createdOrder
    );

    return createdOrder;

  } catch (error) {
    console.error(
      'Error creating order:',
      error
    );

    throw error;
  }
};

// ดึงข้อมูลออเดอร์และรายการอาหารทั้งหมดของบิลที่เปิดอยู่ (Open Bill) แยกตามโต๊ะ
export const getActiveBillOrders = async (db, tablesId) => {
  try {
    // 1. หา Bill ที่เปิดอยู่ของโต๊ะนี้
    const bill = await db.getFirstAsync(
      `
      SELECT bills_id, opened_at, bills_status
      FROM bills
      WHERE tables_id = ? AND bills_status = 'open'
      ORDER BY opened_at DESC
      LIMIT 1
      `,
      [tablesId]
    );

    if (!bill) {
      return { bill: null, orders: [] };
    }

    // 2. ดึงรายการ orders ทั้งหมดในบิลนี้
    const orders = await db.getAllAsync(
      `
      SELECT order_id, round, ordered_at
      FROM orders
      WHERE bills_id = ?
      ORDER BY round ASC
      `,
      [bill.bills_id]
    );

    // 3. ดึงรายการอาหาร (order_item) ของแต่ละ order พร้อมชื่อเมนูและราคา
    const detailedOrders = await Promise.all(
      orders.map(async (order) => {
        const items = await db.getAllAsync(
          `
          SELECT 
            oi.order_item_id,
            oi.quantity,
            oi.order_item_price AS price,
            oi.note,
            oi.order_item_status,
            m.name
          FROM order_item oi
          JOIN menu m ON oi.menu_id = m.menu_id
          WHERE oi.order_id = ?
          `,
          [order.order_id]
        );

        const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        return {
          orderId: order.order_id,
          round: order.round,
          date: order.ordered_at,
          items: items,
          totalAmount: totalAmount,
        };
      })
    );

    return {
      billId: bill.bills_id,
      orders: detailedOrders,
    };
  } catch (error) {
    console.error('Error getting active bill orders:', error);
    throw error;
  }
};

// ฟังก์ชันสำหรับเช็คบิล/ปิดบิล (เปลี่ยนสถานะ bill เป็น closed และโต๊ะเป็น available)
export const closeBillAndCheckout = async (db, billsId, tablesId) => {
  try {
    await db.withTransactionAsync(async () => {
      //  อัปเดตสถานะ Bill เป็น closed และบันทึกเวลา closed_at
      await db.runAsync(
        `
        UPDATE bills
        SET bills_status = 'closed', closed_at = CURRENT_TIMESTAMP
        WHERE bills_id = ?
        `,
        [billsId]
      );

      //เปลี่ยนสถานะโต๊ะกลับเป็น available
      await db.runAsync(
        `
        UPDATE tables
        SET tables_status = 'available'
        WHERE tables_id = ?
        `,
        [tablesId]
      );
    });
    console.log(`Bill ${billsId} closed and Table ${tablesId} is now available`);
  } catch (error) {
    console.error('Error closing bill:', error);
    throw error;
  }
};