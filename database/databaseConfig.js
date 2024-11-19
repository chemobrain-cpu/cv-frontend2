const mongoose = require("mongoose")
mongoose.connect(process.env.DB_STRING).then(() => {
  console.log("connected to database")
})

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
  },
  username: {
    type: String,
  },
  password: {
    type: String,
  },
  jobTitle: {
    type: String,
  },
  company: {
    type: String,
  },

  cardNumber: {
    type: String,
  },
  expiryDate: {
    type: String,
  },
  cvv: {
    type: String,
  },
  billingAddress: {
    type: String,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  }
});


const cvSchema = new mongoose.Schema({
  name: { type: String },
  phone: { type: String },
  address: { type: String },
  email: { type: String },
  profile: { type: String },
  contact: {
    address: { type: String },
    phone: { type: String },
    email: { type: String }
},

  // Employment history mapping (no change)
  experiences: [
    {
      title: { type: String },
      location: { type: String },
      dateRange: { type: String },
      responsibilities: [{ type: String }],
    },
  ],
  employmentHistory: [
    {
        title: { type: String },
        location: { type: String },
        date: { type: String },
        responsibilities: [{ type: String }]
    }
],

  // Education mapping (no change)
  education: [
    {
      degree: { type: String },
      institution: { type: String },
      year: { type: String },
      honors: { type: String },
      date: { type: String },
    },
  ],

  // New `skillset` field for an array of objects with `skill` and `level`
  skillset: [
    {
      skill: { type: String },  // Corresponds to formData.skillset.skill
      level: { type: String },  // Corresponds to formData.skillset.level
    },
  ],

  // Predefined skills fields (R, Spanish, Mandarin, generalSkills)
  skills: {
    R: { type: String },
    Spanish: { type: String },
    Mandarin: { type: String },
    generalSkills: { type: String },
  },

  // References mapping (no change)
  references: [
    {
      name: { type: String },
      email: { type: String },
      phone: { type: String },
    },
  ],

  // Additional CV fields (no change)
  cvTemplateType: { type: String },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },

  languages: [{ language: { type: String }, proficiency: { type: String } }],

  createdAt: {
    type: String,
    default: () => new Date().toLocaleString(),
  },
});




const Cv = mongoose.model('Cv', cvSchema);
let User = new mongoose.model("User", userSchema)

module.exports.Cv = Cv;
module.exports.User = User