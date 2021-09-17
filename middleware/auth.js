const jwt = require('jsonwebtoken');
//importation pour utilisation des variables d'environnements
const dotenv = require('dotenv');
const result = dotenv.config();
if (result.error) {
  throw result.error
} 
console.log(result.parsed);

//authentification
module.exports = (req, res, next) => {
    try{
      const token = req.headers.authorization.split(' ')[1];
      const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
      const userId = decodedToken.userId;
      if (req.body.userId && req.body.userId !==userId) {
          throw 'User ID non valable !';
        }else {
          next();
        }
    } catch(error) {
        res.status(401).json({ error:error | 'Requête non authentifiée !'});
    }
};