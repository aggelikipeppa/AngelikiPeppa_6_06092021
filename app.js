const express = require('express');  //import express: node.js web framework
const mongoose = require('mongoose');  //import mongoose
const helmet = require('helmet');//import Helmet, protection against sql and xss injection
const cors = require("cors");//Pour gérer les problèmes de CORS(Cross-Origin Request Sharing)
const dotenv = require("dotenv");
  
dotenv.config();
const path = require('path');


const userRoutes = require('./routes/user');
const sauceRoutes = require('./routes/sauce');

//Connection à la base de données
mongoose.connect(process.env.SECRET_DB,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();
//middleware qui aide à sécuriser l'API en définissant divers en-têtes HTTP
app.use(helmet());

//middleware permettant d'accéder à l'API depuis n'importe quelle origine
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});


app.use(express.json());

app.use('/images', express.static(path.join(__dirname, 'images')));

app.use(cors());



//l'authentification
app.use("/api/auth", userRoutes);

app.use("/api/sauces", sauceRoutes);


module.exports = app; //exportation de app.js pour pouvoir y acceder depuis un autre fichier