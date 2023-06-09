require("dotenv").config();

const { fetchOrderByTable, makePayment, createOrder } = require("./services/omnivore");
const tables = require("./data/tables");
const items = require("./data/items");

(async () => {
    await Promise.all(tables.map(async (table) => {
        const order = await fetchOrderByTable(table.id);
        if (order) {
            await makePayment(order.id, order.totals.due);
        }
        await createOrder(table.id, table.guest_count, table.items.map((item) => {
            item.menu_item = items.find((i) => i.name === item.name).id
            delete item.name;
            return item;
        })).catch(err=> console.log(err.response.data));
        console.info(`Table ${table.number} is ready\n`);
    }));
    console.info("All tables are ready. Exiting...");
    await new Promise((resolve) => setTimeout(resolve, 3000));
})();

