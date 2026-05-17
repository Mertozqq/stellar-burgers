const { PUBLIC_BASE_URL } = require('./config');

const sortOrders = (orders) =>
  [...orders].sort(
    (left, right) =>
      new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime()
  );

const getBaseUrl = (req) => {
  if (PUBLIC_BASE_URL) {
    return PUBLIC_BASE_URL;
  }

  return `${req.protocol}://${req.get('host')}`;
};

const serializeIngredient = (ingredient, req) => {
  const imageUrl = `${getBaseUrl(req)}/images/${ingredient.imageSlug}`;

  return {
    _id: ingredient._id,
    name: ingredient.name,
    type: ingredient.type,
    proteins: ingredient.proteins,
    fat: ingredient.fat,
    carbohydrates: ingredient.carbohydrates,
    calories: ingredient.calories,
    price: ingredient.price,
    image: imageUrl,
    image_large: imageUrl,
    image_mobile: imageUrl
  };
};

const serializeOrder = (order) => ({
  _id: order._id,
  status: order.status,
  name: order.name,
  createdAt: order.createdAt,
  updatedAt: order.updatedAt,
  number: order.number,
  ingredients: order.ingredients
});

const getTodayTotal = (orders) => {
  const todayPrefix = new Date().toISOString().slice(0, 10);

  return orders.filter((order) => order.createdAt.startsWith(todayPrefix)).length;
};

const buildOrdersPayload = (orders) => {
  const sortedOrders = sortOrders(orders);

  return {
    success: true,
    orders: sortedOrders.map(serializeOrder),
    total: sortedOrders.length,
    totalToday: getTodayTotal(sortedOrders)
  };
};

module.exports = {
  serializeIngredient,
  serializeOrder,
  buildOrdersPayload,
  sortOrders
};
