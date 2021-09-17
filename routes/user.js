const express = require('express');
const router = express.Router();
const checkEmail=require('../middleware/checkEmail')
const checkPassword=require('../middleware/checkPassword');
const userCtrl = require('../controllers/user');


//On utilise les routes POST car le frontend va egalement envoyer les informations, l'adresse mail et le mot de passe
router.post('/signup', checkEmail, checkPassword, userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;