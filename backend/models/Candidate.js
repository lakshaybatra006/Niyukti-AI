const mongoose = require("mongoose");

const candidateSchema = new mongoose.Schema(
{
name: {
type: String,
required: true,
},


email: {
  type: String,
  required: true,
  unique: true,
},

skills: [String],

experience: {
  type: Number,
  default: 0,
},

projects: [
  {
    title: String,
    description: String,
  },
],

education: [
  {
    degree: String,
    college: String,
  },
],

fraudRisk: {
  type: Number,
  default: 0,
},

fraudReason: {
  type: String,
  default: "",
},

status: {
  type: String,
  enum: ["pending", "shortlist", "hire", "reject"],
  default: "pending",
},


},
{
timestamps: true,
}
);

module.exports = mongoose.model(
"Candidate",
candidateSchema
);
