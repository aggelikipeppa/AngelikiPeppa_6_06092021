const Sauce = require('../models/Sauce');
const fs = require('fs');   // accéder au système de fichier


exports.createSauce = (req, res, next) => {
  
  /*console.log("--->controllers/sauce.js CONTENU de req.body");
  console.log(req.body);

  console.log("--->controllers/sauce.js CONTENU de req.body.sauce");  
  console.log(req.body.sauce);*/

  const sauceObject = JSON.parse(req.body.sauce);

  /*console.log("--->controllers/sauce.js CONTENU de sauceObject après JSON.parse");  
  console.log(sauceObject);*/
    delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: []
     });
     sauce.save()
     .then(() => res.status(201).json({ message: 'Sauce enregistré !'}))
     .catch(error => res.status(400).json({ error }));
 };

 exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ?        /*si on modifie le fichier image, récupérer le nom du fichier image sauce actuelle pour la suppréssion
                                          pour éviter d'avoir un fichier inutile dans le dossier images */
     {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
     } : { ...req.body}
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Sauce modifié !'}))
      .catch(error => res.status(400).json({ error }));
};

exports.getAllSauces = (req,res, next) =>{
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error}));
};

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id}) 
     .then(sauce => res.status(200).json(sauce))
     .catch(error => res.status(404).json({ error}));
 };

 //suppression d'une sauce et du fichier image
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id})
        .then(sauce => {
            const filename = sauce.imageUrl.split("/images/")[1];
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Sauce supprimé !'}))
                    .catch(error => res.status(400).json({ error }));
            });
        })
        .catch(error => res.status(500).json({ error}));
};

//Définit le statut "like" d'une sauce
//Définit le statut "j'aime" d'une sauce
exports.likeSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id})
        .then((sauce) => {
        const userId = req.body.userId; 
        const like = req.body.like;

        //si l'utilisateur clique sur j'aime
        if (like == 1) { 
          // on vérifie que l'utilisateur n'a pas déjà cliqué sur j'aime
          if (sauce.usersLiked.indexOf(userId) !== 1) { 
            sauce.likes += 1;
            sauce.usersLiked.push(userId);
          }
          //on met à jour l'objet Sauce
          Sauce.updateOne({_id:req.params.id}, sauce)
          .then(sauce => { res.status(200).json(sauce);})
          .catch((error) => { res.status(500).json({error: error});
          })

        //si l'utilisateur clique sur je n'aime pas
        } else if (like == -1) { 
          //on vérifie que l'utilisateur n'a pas déjà cliqué sur je n'aime pas
          if (sauce.usersDisliked.indexOf(userId) !== 1) { 
            sauce.dislikes += 1;
            sauce.usersDisliked.push(userId);
          }
          //on met à jour l'objet Sauce
          Sauce.updateOne({_id:req.params.id}, sauce)
          .then(sauce => { res.status(200).json(sauce);})
          .catch((error) => { res.status(500).json({ error: error });
          })

        //si l'utilisateur veut annuler son "j'aime" ou "je n'aime pas"
        } else if (like == 0) { 
          
          if (sauce.usersLiked.indexOf(userId) !== -1) { // on vérifie si l'utilisateur se trouve dans le tableau des usersLiked
            sauce.likes -= 1; // on retire -1 du décompte de "j'aime"
            sauce.usersLiked.splice(userId, 1); // on retire l'userId du tableau de usersLiked
          } else { // si l'utilisateur ne se trouve pas dans le tableau des usersLiked
            sauce.dislikes -= 1;  //on retire -1 du décompte de "je n'aime pas"
            sauce.usersDisliked.splice(userId, 1);  // on retire l'userId du tableau de usersDisliked
          }
          Sauce.updateOne({_id:req.params.id}, sauce) // on met à jour notre objet sauce
          .then(sauce => { res.status(200).json(sauce); })
          .catch((error) => {res.status(500).json({ error: error });
          })
        }
      }
    ).catch((error) => { res.status(404).json({ error: error });
      }
    );
  };


