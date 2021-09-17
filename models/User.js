const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

//création du schéma pour un utilisateur en le rendant unique

const userSchema = mongoose.Schema({ 
    email: { type: String, required: true, unique: true},
    password: {type: String, required: true}
});

//pour qu'il ne soit pas possible d'enregistrer 2 fois la même adresse mail dans la base de donnée
userSchema.plugin(uniqueValidator); // on applique la méthode plugin pour controler le mail

module.exports = mongoose.model('User', userSchema);

