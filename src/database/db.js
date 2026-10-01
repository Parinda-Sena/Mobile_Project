export const initDatabase = async (db) => {
  try {
    // เปิดใช้งาน Foreign Key
    await db.execAsync('PRAGMA foreign_keys = ON;');

    // Transaction
    await db.withTransactionAsync(async () => {
      await db.execAsync(`

        -- category
        CREATE TABLE IF NOT EXISTS category (
          category_id TEXT PRIMARY KEY,
          category_name TEXT NOT NULL
        );

        INSERT OR IGNORE INTO category (category_id, category_name) VALUES
          ('C001', 'Dessert'),
          ('C002', 'Beverage'),
          ('C003', 'Main Course'),
          ('C004', 'Appetizers');


        -- menu (ใช้ CREATE TABLE IF NOT EXISTS แทน DROP TABLE)
        CREATE TABLE IF NOT EXISTS menu (
          menu_id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          price INTEGER NOT NULL CHECK (price >= 0),
          image TEXT NOT NULL,
          category_id TEXT NOT NULL,
          available INTEGER NOT NULL DEFAULT 1 CHECK (available IN (0, 1)),
          FOREIGN KEY (category_id) REFERENCES category(category_id) ON DELETE RESTRICT
        );

        -- ใช้ INSERT OR IGNORE เพื่อป้องกันข้อมูลซ้ำ
        INSERT OR IGNORE INTO menu (menu_id, name, price, image, category_id) VALUES
          ('D001', 'Chocolate Bingsu', 189, 'https://shopee.co.th/blog/wp-content/uploads/2022/02/E6OnzwWXsAIE3s1-1.jpg', 'C001'),
          ('D002', 'Honey Toast', 79, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-iyOgfMr5mFAQHxDCUa2PxWKM7VtaHNv3eAe2LyZUOFoYpG4BnK0wC1E&s=10', 'C001'),
          ('D003', 'Macarons', 45, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxWktYk45-oYq7S2BXTmOpNQXkyBlnAjs6522NuQQJXjHcOnQAfImenOw5&s=10', 'C001'),
          ('D004', 'Blueberry Cheesecake', 65, 'https://www.calforlife.com/image/food/Blueberry-Cheesecake.jpg', 'C001'),
          ('D005', 'Banoffee Pie', 65, 'https://sprouted-seeds.com/wp-content/uploads/2021/08/S__250593392.jpg', 'C001'),
          ('D006', 'Strawberry Bingsu', 189, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8TT4Q501KbyMhCTtpv2xBIWgaZ_3JV53-5x5WnRRmOIHjzYQg5d2GWelE&s=10', 'C001'),
          ('D007', 'Orange Cake', 65, 'https://api2.krua.co/wp-content/uploads/2025/01/ArticlePic_1670x1095_Artboard-1-16-scaled.jpg', 'C001'),
          ('D008', 'Brownie', 45, 'https://img.wongnai.com/p/1920x0/2025/04/07/11282c9ca2eb42af9b46ff2119fbb933.jpg', 'C001'),
          ('D009', 'Oreo Bingsu', 189, 'https://img.wongnai.com/p/400x0/2020/05/04/ca1cf4d65693470287c35fff3f0e6038.jpg', 'C001'),
          ('D010', 'Volcano Bingsu', 189, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQVrBEMXvWri3hm013kvpaGc3oOFDJGea_NGgM383tiXbfNiuOUdRrG_-3v&s=10', 'C001'),

          ('B001', 'Pure Matcha', 70, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSezGUcdksLE12ylTP0OFRi_0K-jtxMtm8Oya_ey3sPvzH8_EQDeAHqi0I&s=10', 'C002'),
          ('B002', 'Matcha Latte', 65, 'https://www.finedininglovers.com/sites/default/files/styles/1_1_768x768/public/2026-02/matcha-latte.jpg.webp?h=4963bdfc&itok=PdfRJCgX', 'C002'),
          ('B003', 'Strawberry Fresh Milk', 55, 'https://streetsmartnutrition.com/wp-content/uploads/2022/07/IMG_6612.jpg', 'C002'),
          ('B004', 'Coke', 25, 'https://media.istockphoto.com/id/458464735/photo/coke.jpg?s=612x612&w=0&k=20&c=YbmiazMmY0DkWh_W8T0pBkOgai2k62hGF1TJn9EC5W0=', 'C002'),
          ('B005', 'Water', 10, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTpJm7ZZbDgEAxmIDEpHZHKTDjpKoGgRZ5EDLneDhfjIiJ53qMlCXobFP09&s=10', 'C002'),
          ('B006', 'Cocoa Frappe', 60, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQaQdbRX7EP-VenUEjFyF-E--AsReVAcnf96kR_oAVOYpSLjFantqAU-Ug&s=10', 'C002'),
          ('B007', 'Iced Cocoa', 55, 'https://www.cacaobrew.co.uk/cdn/shop/articles/Iced_Chocolate2_bc38211b-194b-4ae7-9c8f-75e5cbb96100.jpg?v=1754420953', 'C002'),
          ('B008', 'Blue Hawaii', 50, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQp3sa3F82Tr1QxDaiTVpKYJpwyXY0hIDpAYFydBSAPTpHAQVGotO4smctM&s=10', 'C002'),
          ('B009', 'Latte', 55, 'https://www.cuisinart.com/dw/image/v2/ABAF_PRD/on/demandware.static/-/Sites-us-cuisinart-sfra-Library/default/dw42dcae51/images/recipe-Images/cafe-latte1-recipe_resized.jpg?sw=1200&sh=1200&sm=fit', 'C002'),
          ('B010', 'Cappucino', 60, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKgae6KFiwdV6y8vN2-3fbxLV5aGzwZ398Q9fhQJeFu7MCbLo5j3vQk2Vw&s=10', 'C002'),

          ('M001', 'Ommlette on Rice', 40, 'https://s359.kapook.com/pagebuilder/4854bb38-8906-4f15-9684-172c873d305f.jpg', 'C003'),
          ('M002', 'Tom Yum Goong', 150, 'https://ptkss.com/wp-content/uploads/2025/10/%E0%B8%95%E0%B9%89%E0%B8%A1%E0%B8%A2%E0%B8%B3%E0%B8%81%E0%B8%B8%E0%B9%89%E0%B8%87.png', 'C003'),
          ('M003', 'American Fried Rice', 70, 'https://img.kapook.com/u/pirawan/Cooking1/americanfriedrice.jpg', 'C003'),
          ('M004', 'Pork Steak', 69, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQccO7bGVdZB_NVUl3QDvx_aOOKqKGq5Jz2KTICAg-TH1RuEFyD2XhaKwda&s=10', 'C003'),
          ('M005', 'Beef Steak', 89, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThExAlN28ZEQqYQoX-LSnlxrf3lpsFB8TpvWb-JsyTWYF-pAcZSnqKco8&s=10', 'C003'),
          ('M006', 'Spaghetti with Spicy Seafood', 79, 'https://s359.kapook.com/pagebuilder/19910966-cc8c-4be8-ad45-b90915bdb54a.jpg', 'C003'),
          ('M007', 'Spaghetti Carbonara', 79, 'https://static.cdntap.com/tap-assets-prod/wp-content/uploads/sites/25/2022/03/pasta-spaghetti-Carbonara.jpg?width=700&quality=95', 'C003'),
          ('M008', 'Stir-Fried Basil with Minced Pork on Rice', 50, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSfCiJmeeNs0zF1_mPggVhRQYOSdAJDeiFmnVgNUqrbfBvnPpCsuxhlG8M&s=10', 'C003'),
          ('M009', 'Pork Fried Rice', 50, 'https://s359.kapook.com/pagebuilder/2810e9c2-ac36-4970-bc50-d2fa431e2c3c.jpg', 'C003'),
          ('M010', 'Deep-Fried Seabass with Fish Sauce', 180, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRnwgEBpHJgjT2232PL0xWOpi_OC97Lj-9aazxQQpRmOFFk2fcSixhgNKU&s=10', 'C003'),

          ('A001', 'Shrimp Donut', 49, 'https://www.dailynews.co.th/wp-content/uploads/2022/05/2-1-1.jpg', 'C004'),
          ('A002', 'French Fries', 49, 'https://img.magnific.com/free-photo/fried-potatoes-with-ketchup-mayonnaise-isolated-white-background_123827-21724.jpg?semt=ais_hybrid&w=740&q=80', 'C004'),
          ('A003', 'Chicken Nuggets', 49, 'https://fit-d.com/uploads/food/cdfe567fab5d89ed634629e91fc8eb5c.jpg', 'C004'),
          ('A004', 'Chicken Pop', 49, 'https://png.pngtree.com/png-clipart/20250224/original/pngtree-crispy-fried-chicken-pieces-falling-on-paper-plate-png-image_20507209.png', 'C004'),
          ('A005', 'Egg Tart', 35, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS05ht211s37lQ5p7IkhBnmnugbndZWkbI17Whs0AzfOMQv5SinY9Qb2vD2&s=10', 'C004'),
          ('A006', 'Wingz Zabb', 49, 'https://obs-ect.line-scdn.net/r/ect/ect/cj02dGI5dHZrb3M0aWZ2JnM9anA2JnQ9bSZ1PTFmdmM4YnN1azRkZzAmaT0w', 'C004'),
          ('A007', 'Cream of Truffle Mushroom Soup', 79, 'https://www.greengenelife.com/wp-content/uploads/2024/09/Truffle-mushroom-soup-1.jpg', 'C004'),
          ('A008', 'Toast', 35, 'https://png.pngtree.com/png-clipart/20240814/original/pngtree-three-slices-of-toasted-bread-stacked-vertically-png-image_15771956.png', 'C004'),
          ('A009', 'Spinach with Cheese', 69, 'https://cuisineyimyai.wordpress.com/wp-content/uploads/2014/10/1385949783-image-o.jpg?w=640', 'C004'),
          ('A010', 'Lasagna', 79, 'https://aroifin.com/wp-content/uploads/2025/12/17122025-lasagna-cover.webp', 'C004');


        -- tables
        CREATE TABLE IF NOT EXISTS tables (
          tables_id TEXT PRIMARY KEY,
          tables_number TEXT NOT NULL UNIQUE,
          tables_status TEXT NOT NULL DEFAULT 'available'
            CHECK (tables_status IN ('available', 'unavailable'))
        );

        INSERT OR IGNORE INTO tables (tables_id, tables_number, tables_status) VALUES
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
        CREATE TABLE IF NOT EXISTS bills (
          bills_id TEXT PRIMARY KEY,
          tables_id TEXT NOT NULL,
          bills_status TEXT NOT NULL DEFAULT 'open'
            CHECK (bills_status IN ('open', 'closed', 'cancel')),
          opened_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
          closed_at TEXT,
          FOREIGN KEY (tables_id) REFERENCES tables(tables_id) ON DELETE RESTRICT
        );


        -- orders
        CREATE TABLE IF NOT EXISTS orders (
          order_id TEXT PRIMARY KEY,
          bills_id TEXT NOT NULL,
          round INTEGER NOT NULL CHECK (round > 0),
          ordered_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
          UNIQUE (bills_id, round),
          FOREIGN KEY (bills_id) REFERENCES bills(bills_id) ON DELETE CASCADE
        );


        -- order_item
        CREATE TABLE IF NOT EXISTS order_item (
          order_item_id TEXT PRIMARY KEY,
          order_id TEXT NOT NULL,
          menu_id TEXT NOT NULL,
          quantity INTEGER NOT NULL CHECK (quantity > 0),
          note TEXT,
          order_item_status TEXT NOT NULL DEFAULT 'pending'
            CHECK (order_item_status IN ('pending', 'cooking', 'served', 'cancel')),
          order_item_price INTEGER NOT NULL CHECK (order_item_price >= 0),
          FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
          FOREIGN KEY (menu_id) REFERENCES menu(menu_id) ON DELETE RESTRICT
        );


        -- INDEX
        CREATE INDEX IF NOT EXISTS idx_bills_tables_status ON bills(tables_id, bills_status);
        CREATE INDEX IF NOT EXISTS idx_order_item_order_id ON order_item(order_id);
        CREATE INDEX IF NOT EXISTS idx_menu_name ON menu(name);
        CREATE INDEX IF NOT EXISTS idx_orders_ordered_at ON orders(ordered_at);

      `);
    });

    console.log('Database initialized successfully');
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
        m.image,
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

// อัปเดตสถานะรายการอาหาร
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

// ค้นหาชื่อเมนู (ดึง image เพิ่ม)
export const searchMenuItems = async (db, searchQuery) => {
  try {
    const query = 'SELECT menu_id, name, price, image, category_id, available FROM menu WHERE name LIKE ?';
    const results = await db.getAllAsync(query, [`%${searchQuery.trim()}%`]);
    return results;
  } catch (error) {
    console.error('Error searching menu:', error);
    return [];
  }
};

// ดึงเมนูตามหมวดหมู่ (ดึง image เพิ่ม)
export const getMenuItemsByCategory = async (db, categoryId) => {
  try {
    const query = 'SELECT menu_id, name, price, image, category_id, available FROM menu WHERE category_id = ?';
    const result = await db.getAllAsync(query, [categoryId]);
    return result;
  } catch (error) {
    console.error('Error loading menu by category:', error);
    return [];
  }
};

// ดึงสรุปยอดขายรวม
export const getSalesSummary = async (db) => {
  try {
    const billResult = await db.getFirstAsync(`
      SELECT COUNT(DISTINCT b.bills_id) AS closed_bills, 
             COALESCE(SUM(oi.order_item_price * oi.quantity), 0) AS total_sales
      FROM bills b
      JOIN orders o ON b.bills_id = o.bills_id
      JOIN order_item oi ON o.order_id = oi.order_id
      WHERE b.bills_status = 'closed' AND oi.order_item_status != 'cancel'
    `);

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

// ดึงรายการอาหารที่ขายได้แยกตามเมนู
export const getSoldMenuSummary = async (db) => {
  try {
    const query = `
      SELECT 
        m.menu_id,
        m.name as menu_name,
        m.image,
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
      const table = await db.getFirstAsync(
        `SELECT tables_id, tables_number, tables_status FROM tables WHERE tables_id = ?`,
        [tablesId]
      );

      if (!table) {
        throw new Error('ไม่พบโต๊ะที่เลือก');
      }

      let bill = await db.getFirstAsync(
        `SELECT bills_id FROM bills WHERE tables_id = ? AND bills_status = ? ORDER BY opened_at DESC LIMIT 1`,
        [tablesId, 'open']
      );

      if (!bill) {
        const billsId = `S${Date.now()}`;
        await db.runAsync(
          `INSERT INTO bills (bills_id, tables_id, bills_status) VALUES (?, ?, ?)`,
          [billsId, tablesId, 'open']
        );
        bill = { bills_id: billsId };
      }

      const roundResult = await db.getFirstAsync(
        `SELECT COALESCE(MAX(round), 0) + 1 AS next_round FROM orders WHERE bills_id = ?`,
        [bill.bills_id]
      );

      const nextRound = roundResult?.next_round || 1;
      const orderId = `O${Date.now()}`;

      await db.runAsync(
        `INSERT INTO orders (order_id, bills_id, round) VALUES (?, ?, ?)`,
        [orderId, bill.bills_id, nextRound]
      );

      for (let index = 0; index < cart.length; index++) {
        const item = cart[index];

        // แก้ไขไวยากรณ์ SQL ที่ผิดพลาดในจุดนี้เรียบร้อยแล้ว
        const menu = await db.getFirstAsync(
          `SELECT menu_id, price, image, available FROM menu WHERE menu_id = ?`,
          [item.menu_id]
        );

        if (!menu) {
          throw new Error(`ไม่พบเมนู ${item.menu_id}`);
        }

        if (menu.available !== 1) {
          throw new Error(`เมนู ${item.name || item.menu_id} ไม่พร้อมขาย`);
        }

        if (!item.quantity || item.quantity <= 0) {
          throw new Error(`จำนวนของ ${item.name || item.menu_id} ไม่ถูกต้อง`);
        }

        const orderItemId = `F${Date.now()}${index}`;

        await db.runAsync(
          `INSERT INTO order_item (order_item_id, order_id, menu_id, quantity, note, order_item_status, order_item_price) VALUES (?, ?, ?, ?, ?, ?, ?)`,
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

      await db.runAsync(
        `UPDATE tables SET tables_status = ? WHERE tables_id = ?`,
        ['unavailable', tablesId]
      );

      createdOrder = {
        orderId,
        billsId: bill.bills_id,
        round: nextRound,
        tablesId,
        tablesNumber: table.tables_number,
      };
    });

    console.log('Order created successfully:', createdOrder);
    return createdOrder;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

// ดึงข้อมูลออเดอร์ของบิลที่เปิดอยู่
export const getActiveBillOrders = async (db, tablesId) => {
  try {
    const bill = await db.getFirstAsync(
      `SELECT bills_id, opened_at, bills_status FROM bills WHERE tables_id = ? AND bills_status = 'open' ORDER BY opened_at DESC LIMIT 1`,
      [tablesId]
    );

    if (!bill) {
      return { bill: null, orders: [] };
    }

    const orders = await db.getAllAsync(
      `SELECT order_id, round, ordered_at FROM orders WHERE bills_id = ? ORDER BY round ASC`,
      [bill.bills_id]
    );

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
            m.name,
            m.image
          FROM order_item oi
          JOIN menu m ON oi.menu_id = m.menu_id
          WHERE oi.order_id = ?
          `,
          [order.order_id]
        );

        const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

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

// เช็คบิล/ปิดบิล
export const closeBillAndCheckout = async (db, billsId, tablesId) => {
  try {
    await db.withTransactionAsync(async () => {
      await db.runAsync(
        `UPDATE bills SET bills_status = 'closed', closed_at = CURRENT_TIMESTAMP WHERE bills_id = ?`,
        [billsId]
      );

      await db.runAsync(
        `UPDATE tables SET tables_status = 'available' WHERE tables_id = ?`,
        [tablesId]
      );
    });
    console.log(`Bill ${billsId} closed and Table ${tablesId} is now available`);
  } catch (error) {
    console.error('Error closing bill:', error);
    throw error;
  }
};