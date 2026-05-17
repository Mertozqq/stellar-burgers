const express = require('express');
const cors = require('cors');
const http = require('http');
const path = require('path');
const { WebSocketServer } = require('ws');
const crypto = require('crypto');

const { PORT } = require('./config');
const {
  hashPassword,
  issueTokens,
  getUserByAccessToken,
  refreshUserSession,
  createPasswordResetToken,
  consumePasswordResetToken,
  parseAuthorizationHeader
} = require('./auth');
const { getDb, mutateDb, saveDb } = require('./db');
const {
  serializeIngredient,
  serializeOrder,
  buildOrdersPayload,
  sortOrders
} = require('./serializers');

const app = express();
app.set('trust proxy', true);
app.use(cors());
app.use(express.json());
app.use('/images', express.static(path.resolve(__dirname, 'public', 'images')));

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

const publicClients = new Set();
const privateClients = new Map();

const getSafeUser = (user) => ({
  email: user.email,
  name: user.name
});

const getUserOrders = (userId) =>
  sortOrders(getDb().orders.filter((order) => order.userId === userId));

const broadcastMessage = (clients, payload) => {
  const message = JSON.stringify(payload);

  clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(message);
    }
  });
};

const broadcastPublicOrders = () => {
  broadcastMessage(publicClients, buildOrdersPayload(getDb().orders));
};

const broadcastPrivateOrders = (userId) => {
  const clients = privateClients.get(userId);
  if (!clients?.size) {
    return;
  }

  broadcastMessage(clients, buildOrdersPayload(getUserOrders(userId)));
};

const scheduleOrderProgress = (orderId) => {
  setTimeout(() => {
    let affectedOrder = null;

    mutateDb((db) => {
      const order = db.orders.find((item) => item._id === orderId);
      if (!order || order.status !== 'created') {
        return;
      }

      order.status = 'pending';
      order.updatedAt = new Date().toISOString();
      affectedOrder = order;
    });

    if (affectedOrder) {
      broadcastPublicOrders();
      broadcastPrivateOrders(affectedOrder.userId);
    }
  }, 4000);

  setTimeout(() => {
    let affectedOrder = null;

    mutateDb((db) => {
      const order = db.orders.find((item) => item._id === orderId);
      if (!order || order.status === 'done') {
        return;
      }

      order.status = 'done';
      order.updatedAt = new Date().toISOString();
      affectedOrder = order;
    });

    if (affectedOrder) {
      broadcastPublicOrders();
      broadcastPrivateOrders(affectedOrder.userId);
    }
  }, 12000);
};

const requireAuth = (req, res, next) => {
  const authorization = parseAuthorizationHeader(req.headers.authorization);
  let authResult = null;

  mutateDb((db) => {
    authResult = getUserByAccessToken(db, authorization);
  });

  if (authResult?.error === 'expired') {
    saveDb();
    return res.status(401).json({
      success: false,
      message: 'jwt expired'
    });
  }

  if (authResult?.error) {
    return res.status(401).json({
      success: false,
      message: 'User is not authorized'
    });
  }

  req.user = authResult.user;
  return next();
};

app.get('/api/health', (_req, res) => {
  res.json({
    success: true,
    status: 'ok'
  });
});

app.get('/api/ingredients', (req, res) => {
  const ingredients = getDb().ingredients.map((ingredient) =>
    serializeIngredient(ingredient, req)
  );

  res.json({
    success: true,
    data: ingredients
  });
});

app.post('/api/auth/register', (req, res) => {
  const { email, name, password } = req.body || {};

  if (!email || !name || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email, name and password are required'
    });
  }

  let responsePayload = null;

  mutateDb((db) => {
    const existingUser = db.users.find(
      (user) => user.email.toLowerCase() === String(email).toLowerCase()
    );

    if (existingUser) {
      responsePayload = {
        status: 409,
        body: {
          success: false,
          message: 'User already exists'
        }
      };
      return;
    }

    const user = {
      id: crypto.randomUUID(),
      email: String(email).toLowerCase(),
      name: String(name),
      passwordHash: hashPassword(String(password))
    };

    db.users.push(user);

    const tokens = issueTokens(db, user.id);

    responsePayload = {
      status: 200,
      body: {
        success: true,
        ...tokens,
        user: getSafeUser(user)
      }
    };
  });

  return res.status(responsePayload.status).json(responsePayload.body);
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body || {};
  const db = getDb();

  const user = db.users.find(
    (item) =>
      item.email.toLowerCase() === String(email || '').toLowerCase() &&
      item.passwordHash === hashPassword(String(password || ''))
  );

  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Incorrect email or password'
    });
  }

  let tokens = null;
  mutateDb((state) => {
    tokens = issueTokens(state, user.id);
  });

  return res.json({
    success: true,
    ...tokens,
    user: getSafeUser(user)
  });
});

app.post('/api/auth/token', (req, res) => {
  const { token } = req.body || {};
  let tokens = null;

  mutateDb((db) => {
    tokens = refreshUserSession(db, token);
  });

  if (!tokens) {
    return res.status(401).json({
      success: false,
      message: 'Invalid refresh token'
    });
  }

  return res.json({
    success: true,
    ...tokens
  });
});

app.post('/api/auth/logout', (req, res) => {
  const { token } = req.body || {};

  mutateDb((db) => {
    db.refreshTokens = db.refreshTokens.filter((item) => item.token !== token);
  });

  res.json({
    success: true
  });
});

app.get('/api/auth/user', requireAuth, (req, res) => {
  res.json({
    success: true,
    user: getSafeUser(req.user)
  });
});

app.patch('/api/auth/user', requireAuth, (req, res) => {
  const { email, name, password } = req.body || {};
  let updatedUser = null;
  let conflict = false;

  mutateDb((db) => {
    const duplicateUser = db.users.find(
      (user) =>
        user.id !== req.user.id &&
        email &&
        user.email.toLowerCase() === String(email).toLowerCase()
    );

    if (duplicateUser) {
      conflict = true;
      return;
    }

    const user = db.users.find((item) => item.id === req.user.id);
    if (!user) {
      return;
    }

    if (email) {
      user.email = String(email).toLowerCase();
    }
    if (name) {
      user.name = String(name);
    }
    if (password) {
      user.passwordHash = hashPassword(String(password));
    }

    updatedUser = getSafeUser(user);
  });

  if (conflict) {
    return res.status(409).json({
      success: false,
      message: 'Email is already in use'
    });
  }

  return res.json({
    success: true,
    user: updatedUser
  });
});

app.post('/api/password-reset', (req, res) => {
  const { email } = req.body || {};
  let resetToken = null;

  mutateDb((db) => {
    const user = db.users.find(
      (item) => item.email.toLowerCase() === String(email || '').toLowerCase()
    );

    if (!user) {
      return;
    }

    resetToken = createPasswordResetToken(db, user.id);
  });

  if (resetToken) {
    console.log(`Password reset token for ${email}: ${resetToken}`);
  }

  res.json({
    success: true,
    resetToken
  });
});

app.post('/api/password-reset/reset', (req, res) => {
  const { password, token } = req.body || {};

  if (!password || !token) {
    return res.status(400).json({
      success: false,
      message: 'Password and token are required'
    });
  }

  let updated = false;

  mutateDb((db) => {
    const user = consumePasswordResetToken(db, String(token));
    if (!user) {
      return;
    }

    user.passwordHash = hashPassword(String(password));
    updated = true;
  });

  if (!updated) {
    return res.status(400).json({
      success: false,
      message: 'Invalid or expired reset token'
    });
  }

  return res.json({
    success: true
  });
});

app.get('/api/orders/all', (_req, res) => {
  res.json(buildOrdersPayload(getDb().orders));
});

app.get('/api/orders/:number', (req, res) => {
  const orderNumber = Number(req.params.number);
  const order = getDb().orders.find((item) => item.number === orderNumber);

  res.json({
    success: true,
    orders: order ? [serializeOrder(order)] : []
  });
});

app.get('/api/orders', requireAuth, (req, res) => {
  res.json({
    success: true,
    orders: getUserOrders(req.user.id).map(serializeOrder)
  });
});

app.post('/api/orders', requireAuth, (req, res) => {
  const { ingredients } = req.body || {};

  if (!Array.isArray(ingredients) || !ingredients.length) {
    return res.status(400).json({
      success: false,
      message: 'Ingredients are required'
    });
  }

  const db = getDb();
  const validIngredientIds = new Set(db.ingredients.map((item) => item._id));
  const hasInvalidIngredients = ingredients.some(
    (ingredientId) => !validIngredientIds.has(ingredientId)
  );

  if (hasInvalidIngredients) {
    return res.status(400).json({
      success: false,
      message: 'Unknown ingredient in order'
    });
  }

  let createdOrder = null;

  mutateDb((state) => {
    state.counters.orderNumber += 1;

    const order = {
      _id: crypto.randomUUID(),
      userId: req.user.id,
      status: 'created',
      name: 'Заказ Cowboy Burger',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      number: state.counters.orderNumber,
      ingredients
    };

    state.orders.push(order);
    createdOrder = order;
  });

  broadcastPublicOrders();
  broadcastPrivateOrders(req.user.id);
  scheduleOrderProgress(createdOrder._id);

  return res.json({
    success: true,
    name: createdOrder.name,
    order: serializeOrder(createdOrder)
  });
});

wss.on('connection', (socket, request) => {
  const url = new URL(request.url, `http://${request.headers.host}`);

  if (url.pathname === '/orders/all') {
    publicClients.add(socket);
    socket.send(JSON.stringify(buildOrdersPayload(getDb().orders)));

    socket.on('close', () => {
      publicClients.delete(socket);
    });

    return;
  }

  if (url.pathname === '/orders') {
    const token = url.searchParams.get('token');
    let authResult = null;

    mutateDb((db) => {
      authResult = getUserByAccessToken(db, token);
    });

    if (authResult?.error) {
      socket.send(
        JSON.stringify({
          success: false,
          message: 'Unauthorized WebSocket connection'
        })
      );
      socket.close();
      return;
    }

    const userId = authResult.user.id;
    const clients = privateClients.get(userId) || new Set();
    clients.add(socket);
    privateClients.set(userId, clients);

    socket.send(JSON.stringify(buildOrdersPayload(getUserOrders(userId))));

    socket.on('close', () => {
      const userClients = privateClients.get(userId);
      if (!userClients) {
        return;
      }

      userClients.delete(socket);
      if (!userClients.size) {
        privateClients.delete(userId);
      }
    });

    return;
  }

  socket.close();
});

setInterval(() => {
  wss.clients.forEach((client) => {
    if (client.readyState === 1) {
      client.ping();
    }
  });
}, 30000);

server.listen(PORT, () => {
  console.log(`Cowboy Burger API is running on http://localhost:${PORT}`);
});
