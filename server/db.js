const fs = require('fs');
const path = require('path');
const { DB_FILE } = require('./config');
const { hashPassword } = require('./auth');

const seedDatabase = () => {
  const now = new Date();
  const isoNow = now.toISOString();

  return {
    counters: {
      orderNumber: 105
    },
    ingredients: [
      {
        _id: 'ing-bun-sesame',
        name: 'Булка кунжутная',
        type: 'bun',
        proteins: 10,
        fat: 8,
        carbohydrates: 34,
        calories: 290,
        price: 140,
        imageSlug: 'bun-sesame.svg'
      },
      {
        _id: 'ing-bun-brioche',
        name: 'Булка бриошь',
        type: 'bun',
        proteins: 11,
        fat: 9,
        carbohydrates: 31,
        calories: 302,
        price: 160,
        imageSlug: 'bun-brioche.svg'
      },
      {
        _id: 'ing-sauce-smoke',
        name: 'Соус копчёный',
        type: 'sauce',
        proteins: 2,
        fat: 18,
        carbohydrates: 7,
        calories: 210,
        price: 60,
        imageSlug: 'sauce-smoke.svg'
      },
      {
        _id: 'ing-sauce-cheese',
        name: 'Соус сырный',
        type: 'sauce',
        proteins: 4,
        fat: 20,
        carbohydrates: 6,
        calories: 225,
        price: 55,
        imageSlug: 'sauce-cheese.svg'
      },
      {
        _id: 'ing-sauce-jalapeno',
        name: 'Соус халапеньо',
        type: 'sauce',
        proteins: 1,
        fat: 9,
        carbohydrates: 5,
        calories: 110,
        price: 50,
        imageSlug: 'sauce-jalapeno.svg'
      },
      {
        _id: 'ing-main-beef',
        name: 'Котлета из говядины',
        type: 'main',
        proteins: 23,
        fat: 18,
        carbohydrates: 0,
        calories: 260,
        price: 190,
        imageSlug: 'main-beef.svg'
      },
      {
        _id: 'ing-main-bacon',
        name: 'Хрустящий бекон',
        type: 'main',
        proteins: 12,
        fat: 24,
        carbohydrates: 1,
        calories: 280,
        price: 120,
        imageSlug: 'main-bacon.svg'
      },
      {
        _id: 'ing-main-cheddar',
        name: 'Чеддер',
        type: 'main',
        proteins: 8,
        fat: 19,
        carbohydrates: 1,
        calories: 220,
        price: 95,
        imageSlug: 'main-cheddar.svg'
      },
      {
        _id: 'ing-main-onion',
        name: 'Луковый конфитюр',
        type: 'main',
        proteins: 1,
        fat: 0,
        carbohydrates: 15,
        calories: 70,
        price: 65,
        imageSlug: 'main-onion.svg'
      },
      {
        _id: 'ing-main-pickle',
        name: 'Маринованные огурцы',
        type: 'main',
        proteins: 1,
        fat: 0,
        carbohydrates: 3,
        calories: 20,
        price: 40,
        imageSlug: 'main-pickle.svg'
      }
    ],
    users: [
      {
        id: 'user-demo',
        email: 'demo@cowboy.local',
        name: 'Демо Ковбой',
        passwordHash: hashPassword('123456')
      }
    ],
    accessTokens: [],
    refreshTokens: [],
    passwordResets: [],
    orders: [
      {
        _id: 'order-seed-101',
        userId: 'user-demo',
        status: 'done',
        name: 'Ковбой бургер с беконом',
        createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 5).toISOString(),
        updatedAt: new Date(now.getTime() - 1000 * 60 * 60 * 4).toISOString(),
        number: 101,
        ingredients: [
          'ing-bun-sesame',
          'ing-main-beef',
          'ing-main-bacon',
          'ing-sauce-smoke',
          'ing-main-cheddar',
          'ing-bun-sesame'
        ]
      },
      {
        _id: 'order-seed-102',
        userId: 'user-demo',
        status: 'pending',
        name: 'Ковбой бургер с огурцами',
        createdAt: new Date(now.getTime() - 1000 * 60 * 35).toISOString(),
        updatedAt: new Date(now.getTime() - 1000 * 60 * 10).toISOString(),
        number: 102,
        ingredients: [
          'ing-bun-brioche',
          'ing-main-beef',
          'ing-main-pickle',
          'ing-sauce-jalapeno',
          'ing-bun-brioche'
        ]
      },
      {
        _id: 'order-seed-103',
        userId: 'user-demo',
        status: 'created',
        name: 'Ковбой бургер с луком',
        createdAt: new Date(now.getTime() - 1000 * 60 * 5).toISOString(),
        updatedAt: isoNow,
        number: 103,
        ingredients: [
          'ing-bun-brioche',
          'ing-main-beef',
          'ing-main-onion',
          'ing-sauce-cheese',
          'ing-bun-brioche'
        ]
      }
    ]
  };
};

const ensureDirectory = () => {
  fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });
};

const loadDatabase = () => {
  ensureDirectory();

  if (!fs.existsSync(DB_FILE)) {
    const initialData = seedDatabase();
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf8');
    return initialData;
  }

  const rawContent = fs.readFileSync(DB_FILE, 'utf8');
  return JSON.parse(rawContent);
};

let state = loadDatabase();

const getDb = () => state;

const saveDb = () => {
  ensureDirectory();
  fs.writeFileSync(DB_FILE, JSON.stringify(state, null, 2), 'utf8');
};

const mutateDb = (updater) => {
  updater(state);
  saveDb();
  return state;
};

module.exports = {
  getDb,
  mutateDb,
  saveDb
};
