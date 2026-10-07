-- เปิดการใช้งาน Foreign Key
PRAGMA foreign_keys = ON;

-- category เก็บหมวดหมู่
CREATE TABLE IF NOT EXISTS category (
    category_id TEXT PRIMARY KEY,
    category_name TEXT NOT NULL
);

INSERT OR IGNORE INTO category (category_id, category_name) VALUES
('C001', 'Dessert'),
('C002', 'Beverage'),
('C003', 'Main Course'),
('C004', 'Appetizers');

-- menu เก็บเมนูอาหารและราคาปัจจุบัน
CREATE TABLE IF NOT EXISTS menu (
    menu_id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    price INTEGER NOT NULL CHECK (price >= 0),
    image TEXT NOT NULL,
    category_id TEXT NOT NULL,
    available INTEGER NOT NULL DEFAULT 1 CHECK (available IN (0, 1)),
    FOREIGN KEY (category_id) REFERENCES category(category_id) ON DELETE RESTRICT
);

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

-- tables เก็บข้อมูลโต๊ะในร้าน
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

-- bills เก็บข้อมูลบิล
CREATE TABLE IF NOT EXISTS bills (
    bills_id TEXT PRIMARY KEY,
    tables_id TEXT NOT NULL,
    bills_status TEXT NOT NULL DEFAULT 'open'
        CHECK (bills_status IN ('open', 'closed', 'cancel')),
    opened_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    closed_at TEXT,
    FOREIGN KEY (tables_id) REFERENCES tables(tables_id) ON DELETE RESTRICT
);

-- orders เก็บข้อมูลการสั่งซื้อแต่ละรอบ
CREATE TABLE IF NOT EXISTS orders (
    order_id TEXT PRIMARY KEY,
    bills_id TEXT NOT NULL,
    round INTEGER NOT NULL CHECK (round > 0),
    ordered_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (bills_id, round),
    FOREIGN KEY (bills_id) REFERENCES bills(bills_id) ON DELETE CASCADE
);

-- order_item เก็บรายการอาหารในแต่ละรอบ
CREATE TABLE IF NOT EXISTS order_item (
    order_item_id TEXT PRIMARY KEY,
    order_id TEXT NOT NULL,
    menu_id TEXT NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    note TEXT,
    order_item_status TEXT NOT NULL DEFAULT 'pending'
        CHECK (order_item_status IN ('pending','cooking','served','cancel')),
    order_item_price INTEGER NOT NULL CHECK (order_item_price >= 0),
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (menu_id) REFERENCES menu(menu_id) ON DELETE RESTRICT
);

-- INDEX
CREATE INDEX IF NOT EXISTS idx_bills_tables_status ON bills(tables_id, bills_status);
CREATE INDEX IF NOT EXISTS idx_order_item_order_id ON order_item(order_id);
CREATE INDEX IF NOT EXISTS idx_menu_name ON menu(name);
CREATE INDEX IF NOT EXISTS idx_orders_ordered_at ON orders(ordered_at);
