# Pokédex App

The **Pokédex App** is a full-stack, database-driven application that provides comprehensive information on the original 151 Pokémon.  
Developed as a portfolio project, it features a clean and responsive user interface that allows users to browse and explore Pokémon entries.

---

⚠️ **Note**
1. This project is currently under development and may be missing planned features or polish.
2. The Pokédex App is not optimized for mobile devices at the moment.

---

### 🚀 Live Application

🔗 [pokedex-app-seven-tan.vercel.app](https://pokedex-app-seven-tan.vercel.app/)

---

## ✨ Features

- **Pokémon Database**  
  View detailed stats and descriptions of the original Generation I Pokémon.

- **Pokémon Data Analyzer**  
  Find out interesting visualized insights of Gen I Pokémon data, like the type and size distributions.

- **Search Functionality**  
  Search for your favourite Pokémon by name. Uses regex to match also partial names.

---

## 🔧 Features in Development

- **Optimization for mobile use**  
  *(Under Construction)* — Optimize App's UI to work better on mobile devices.

- **Search Functionality Update**  
  *(Under Construction)* — Add other methods for searching (by id number, stats, type etc)


---

## 🛠 Technologies Used

### Frontend
- JavaScript (React)
- CSS for styling

### Backend
- Node.js (Express)

### Database
- MongoDB

---

## 💻 Local Development

Requires Node.js 20+ and a MongoDB connection string.

```bash
npm install
cp apps/api/.env.example apps/api/.env   # fill in MONGO_URI
cp apps/web/.env.example apps/web/.env
npm run seed                             # first time only
npm run dev                              # API on :5000, web on :5173
```

---

## ☁️ Deployment & Hosting

This app is deployed using the following services:

[![Vercel](https://img.shields.io/badge/Vercel-Hosting-black?logo=vercel)](https://vercel.com)
[![Render](https://img.shields.io/badge/Render-Cloud-blue?logo=render)](https://render.com)
[![MongoDB Atlas](https://img.shields.io/badge/MongoDB_Atlas-Database-green?logo=mongodb)](https://www.mongodb.com/cloud/atlas)

---

⚠️ **Disclaimer**  
This application is for educational purposes only.  
It uses data provided by the public [PokéAPI](https://pokeapi.co/).


