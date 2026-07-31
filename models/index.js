import Picture from './Picture.js';
import BeforeAfterPicture from './BeforeAfterPicture.js';

// ** Association : 1 Picture belongs To One BeforeAfterPicture **

//* Pour la photo "avant"
BeforeAfterPicture.belongsTo(
  Picture,
  // configuration de l'association
  {
    // nom de la colonne qui contient la clé étrangère
    foreignKey: "beforePictureId",
    as: "before"
  },
);
Picture.hasOne(
  BeforeAfterPicture,
  { 
    foreignKey: "beforePictureId",
    as: "before"
  }
);


//* Pour la photo "après"
BeforeAfterPicture.belongsTo(
  Picture,
  // configuration de l'association
  {
    // nom de la colonne qui contient la clé étrangère
    foreignKey: "afterPictureId",
    as: "after"
  },
);
Picture.hasOne(
  BeforeAfterPicture,
  { 
    foreignKey: "afterPictureId",
    as: "after"
  }
);

export { BeforeAfterPicture, Picture };