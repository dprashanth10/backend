const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const familySchema = new Schema(
  {
    familyName: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
    },
    homeIdsArr: {
      type: Array,
      default: [],
    },
    familyUsersIdsArr: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

const Family = mongoose.model("Family", familySchema);
module.exports = Family;

// _id: {
//   type: String,
//   required: true,
//   unique: true,
//   isPrimary: true,
// },
