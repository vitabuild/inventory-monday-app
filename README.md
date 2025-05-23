# Inventory Dashboard App for Monday.com

This is a React-based inventory management app designed to run as a native board view inside Monday.com.

---

## 🌐 Live Deployment

After pushing to GitHub, deploy with [Vercel](https://vercel.com) to get a URL for embedding in Monday:
```
https://inventory-app.vercel.app
```

---

## 🚀 Getting Started

### 1. Clone this repo
```bash
git clone https://github.com/vitabuild/inventory-monday-app.git
cd inventory-monday-app
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start development server
```bash
npm start
```

---

## 📦 Production Build
```bash
npm run build
```

---

## 🧾 Monday App Setup

### In `manifest.json`, use:
```json
"main": "https://inventory-app.vercel.app/",
"features": [
  {
    "type": "board-view",
    "name": "Inventory View",
    "url": "https://inventory-app.vercel.app/",
    "height": 600
  }
]
```

### Upload app in:
```
Monday → Admin → Developers → Create App
```

---

## 🔒 Secure Your Token (optional)
You can use `.env` for sensitive data like API tokens:

```bash
REACT_APP_MONDAY_TOKEN=your-api-token-here
```

Then access it in React:
```js
const token = process.env.REACT_APP_MONDAY_TOKEN;
```

---

## 👨‍💻 Built With
- React 18
- Tailwind CSS (optional styling)
- Monday.com Apps Framework

---

MIT License  
(c) 2025 vitabuild
