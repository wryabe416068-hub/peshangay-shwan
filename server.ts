import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { initialShopSettings, initialProducts, initialCategories, kurdistanCities } from './src/data/initialData';

const app = express();
const PORT = 3000;
const DATA_DIR = path.join(process.cwd(), 'data');
const STORE_FILE = path.join(DATA_DIR, 'store.json');

// The permanent, unchangeable master key for Shwan
export const PERMANENT_MASTER_KEY = 'SHWAN-9988';

// Store version tracking & SSE active clients for multi-admin live sync
let storeVersion = Date.now();
const sseClients = new Set<express.Response>();

function broadcastStoreUpdate(data: StoreData) {
  storeVersion = Date.now();
  const payload = JSON.stringify({ version: storeVersion, store: data });
  for (const client of sseClients) {
    try {
      client.write(`event: update\ndata: ${payload}\n\n`);
    } catch {
      sseClients.delete(client);
    }
  }
}

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

interface StoreData {
  products: typeof initialProducts;
  categories: typeof initialCategories;
  cities: typeof kurdistanCities;
  settings: typeof initialShopSettings;
  orders: any[];
}

function getInitialStore(): StoreData {
  return {
    products: initialProducts,
    categories: initialCategories,
    cities: kurdistanCities,
    settings: {
      ...initialShopSettings,
      adminPin: '1254', // Default updated to user's desired 1254
      masterRecoveryKey: PERMANENT_MASTER_KEY,
    },
    orders: [],
  };
}

function readStore(): StoreData {
  try {
    if (fs.existsSync(STORE_FILE)) {
      const raw = fs.readFileSync(STORE_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      // Ensure masterRecoveryKey is present
      if (!parsed.settings.masterRecoveryKey) {
        parsed.settings.masterRecoveryKey = PERMANENT_MASTER_KEY;
      }
      return parsed;
    }
  } catch (err) {
    console.error('Error reading store.json, falling back to initial data', err);
  }
  const initial = getInitialStore();
  writeStore(initial, false);
  return initial;
}

function writeStore(data: StoreData, broadcast = true) {
  try {
    fs.writeFileSync(STORE_FILE, JSON.stringify(data, null, 2), 'utf-8');
    if (broadcast) {
      broadcastStoreUpdate(data);
    }
  } catch (err) {
    console.error('Error writing store.json', err);
  }
}

// Middlewares
app.use(express.json({ limit: '20mb' }));

// API: Server-Sent Events (SSE) for Real-Time Multi-Admin Synchronization
app.get('/api/store/live', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders?.();

  // Send initial state immediately to new client
  const store = readStore();
  res.write(`event: init\ndata: ${JSON.stringify({ version: storeVersion, store })}\n\n`);

  sseClients.add(res);

  // Periodic heartbeat to keep connection alive through proxies
  const heartbeat = setInterval(() => {
    try {
      res.write(': heartbeat\n\n');
    } catch {
      clearInterval(heartbeat);
      sseClients.delete(res);
    }
  }, 15000);

  req.on('close', () => {
    clearInterval(heartbeat);
    sseClients.delete(res);
  });
});

// API: Get current version for polling fallback
app.get('/api/store/version', (req, res) => {
  res.json({ version: storeVersion });
});

// API: Get entire shared store state
app.get('/api/store', (req, res) => {
  const store = readStore();
  res.json({ ...store, version: storeVersion });
});

// API: Update entire store state or partial
app.post('/api/store', (req, res) => {
  const current = readStore();
  const { products, categories, cities, settings, orders } = req.body;
  
  if (products) current.products = products;
  if (categories) current.categories = categories;
  if (cities) current.cities = cities;
  if (settings) {
    current.settings = {
      ...current.settings,
      ...settings,
      // Ensure master recovery key cannot be accidentally deleted
      masterRecoveryKey: settings.masterRecoveryKey || current.settings.masterRecoveryKey || PERMANENT_MASTER_KEY,
    };
  }
  if (orders) current.orders = orders;

  writeStore(current, true);
  res.json({ success: true, version: storeVersion, store: current });
});

// API: Verify Admin PIN or Master Key
app.post('/api/admin/verify', (req, res) => {
  const { pin } = req.body;
  const store = readStore();
  const cleanPin = String(pin || '').trim();
  const currentAdminPin = String(store.settings.adminPin || '').trim();
  const masterKey = String(store.settings.masterRecoveryKey || PERMANENT_MASTER_KEY).trim();

  // Allow login if matching admin PIN or Master Key
  if (cleanPin && (cleanPin === currentAdminPin || cleanPin === masterKey || cleanPin === PERMANENT_MASTER_KEY)) {
    const isMaster = cleanPin === masterKey || cleanPin === PERMANENT_MASTER_KEY;
    res.json({ success: true, isMaster });
  } else {
    res.status(401).json({ success: false, message: 'کۆدی تێپەڕەوشە هەڵەیە' });
  }
});

// API: Master Recovery & Seize Control (لەژێر دەست دەرهێنان بە کلیلی ماستەر)
app.post('/api/admin/master-reset', (req, res) => {
  const { masterKey, newPin } = req.body;
  const store = readStore();
  const cleanMasterKey = String(masterKey || '').trim();
  const configuredMasterKey = String(store.settings.masterRecoveryKey || PERMANENT_MASTER_KEY).trim();

  // Verify master key against configured master key or permanent master key
  if (cleanMasterKey === configuredMasterKey || cleanMasterKey === PERMANENT_MASTER_KEY) {
    if (!newPin || String(newPin).trim().length < 3) {
      return res.status(400).json({ success: false, message: 'تکایە تێپەڕەوشەیەکی دروست و بەهێز دابنێ (کەمتر لە ٣ پیت نەبێت)' });
    }

    const updatedPin = String(newPin).trim();
    store.settings.adminPin = updatedPin;
    writeStore(store, true);

    console.log(`[SECURITY] Master Reset Executed! Admin PIN reset to: ${updatedPin}`);
    return res.json({ 
      success: true, 
      message: 'کۆنترۆڵی پێشەنگاکەت بە سەرکەوتوویی گەڕێنرایەوە و تێپەڕەوشەی نوێ جێگیرکرا!', 
      newPin: updatedPin,
      store
    });
  }

  return res.status(403).json({ success: false, message: 'کلیلی ماستەر هەڵەیە! ناتوانیت کۆنترۆڵ بگەڕێنیتەوە.' });
});

// API: Place a new order
app.post('/api/orders', (req, res) => {
  const { order } = req.body;
  if (!order) {
    return res.status(400).json({ success: false, message: 'Order data missing' });
  }
  const store = readStore();
  store.orders = [order, ...store.orders];
  writeStore(store, true);
  res.json({ success: true, order, version: storeVersion });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString(), connectedAdmins: sseClients.size });
});

// Start Server with Vite Middleware
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
