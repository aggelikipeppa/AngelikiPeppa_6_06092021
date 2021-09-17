//multer pour gérer les uploads des images
//middleware pour enregistrer les images qui arrive du frontend
const multer = require('multer');

//résolution de l'extension de fichier
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

// indique où enregistrer les fichier
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  // indique qu'il faut utiliser le nom d'origine du fichier, de remplacer les espaces par des _ 
    //et d'ajouter un timestamp comme nom de fichier pour le rendre le plus unique possible
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_');
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + '.' + extension);
  }
});

module.exports = multer({storage: storage}).single('image');