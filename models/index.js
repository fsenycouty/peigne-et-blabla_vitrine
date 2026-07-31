import Picture from "./Picture";
import BeforeAfterPicture from "./BeforeAfterPicture";

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

export { Picture, BeforeAfterPicture };