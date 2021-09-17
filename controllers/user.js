const bcrypt = require('bcrypt'); //Plugging pour le hash du mot de passe dans la base de donnée
const jwt = require('jsonwebtoken');  //le token d'authentification
const cryptojs = require('crypto-js');    //chiffrer déchiffrer l'email dans la base de donnée

const User = require('../models/User');  //modèle de la base de donnée

//importation pour utilisation des variables d'environnements
const dotenv = require('dotenv');
const result = dotenv.config();
if (result.error) {
  throw result.error
} 
/*console.log(result.parsed);*/

//SIGNUP pour enregistrer un nouvel utilisateur
exports.signup = (req, res, next) => {
  const emailCryptoJs =  cryptojs.HmacSHA512(req.body.email, `${process.env.CRYPTOJS_RANDOM_SECRET_KEY}`).toString();   //chiffrer l'email dans la base de donnée
    bcrypt.hash(req.body.password, 10)
      .then(hash => {
        const user = new User({    //ce qui va être enregistré dans mongoDB
          email: emailCryptoJs,
          password: hash
        });
        user.save()
          .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
          .catch(error => res.status(400).json({ message:"Cette adresse mail est déjà utilisée !" }));
      })
      .catch(error => res.status(500).json({ error }));
};


//LOGIN pour controler la validité de l'utilisateur
exports.login = (req, res, next) => {
  const emailCryptoJs =  cryptojs.HmacSHA512(req.body.email, `${process.env.CRYPTOJS_RANDOM_SECRET_KEY}`).toString();
    User.findOne({ email: emailCryptoJs })     //chercher le mail de l'utilisateur chiffré dans la base de donnée s'il existe
      .then(user => {
        if (!user) {
          return res.status(401).json({ error: 'Utilisateur non trouvé !' });
        }
        bcrypt.compare(req.body.password, user.password) //le user existe on utilise la méthode compare( ) de bcrypt pour comparer le mot de passe  envoyé par l'utilisateur
                                                        //avec le hash qui est enregistré avec le user dans la base de donnée
          .then(valid => {
            if (!valid) {
              return res.status(401).json({ error: 'Mot de passe incorrect !' });
            }
            res.status(200).json({
              userId: user._id,
              token: jwt.sign(
                { userId: user._id },
                'RANDOM_TOKEN_SECRET',
                { expiresIn: '24h' }
              )
            });
          })
          .catch(error => res.status(500).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
};