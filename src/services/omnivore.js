const serviceConnector = require("@sliit-foss/service-connector").default;

const connector = serviceConnector({
    baseURL: `${process.env.OMNIVORE_BASE_URL}/locations/${process.env.OMNIVORE_LOCATION_ID}`,
    headerIntercepts: () => ({
        "Api-Key": process.env.OMNIVORE_API_KEY
    })
});

exports.fetchOrderByTable = async (table) => {
    const data = await connector.get(`/tickets?where=and(eq(open,true),eq(@table.id,${table}))`).then(connector.resolve);
    return data?._embedded?.tickets?.[0];
};

exports.makePayment = (orderId, amount) => {
    return connector.post(`/tickets/${orderId}/payments`, {
        amount,
        tip: 0,
        type: "cash"
    });
};

exports.createOrder = (table, items) => {
    return connector.post("/tickets", {
        employee: process.env.EMPLOYEE_ID,
        revenue_center: process.env.RVC_ID,
        order_type: "1",
        table: table,
        auto_send: true,
        items
    })
};