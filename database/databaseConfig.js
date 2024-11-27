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
  name: { type: String, required: true },
  jobTitle: { type: String },
  phone: { type: String },
  address: { type: String },
  email: { type: String },
  location: { type: String },
  profile: { type: String },
  linkedin: { type: String },
  socialMedia: { type: String },
  summary: { type: String },
  aboutMe: { type: String },
  education: [
    {
      degree: { type: String },
      institution: { type: String },
      year: { type: String },
      details: { type: String },
      duration: { type: String },
      dateRange: { type: String },
      date: { type: String },
      honors: { type: String },
      location: { type: String },
    },
  ],
  experiences: [
    {
      title: { type: String },
      company: { type: String },
      duration: { type: String },
      location: { type: String },
      responsibilities: [{ type: String }],
      dateRange: { type: String },
    },
  ],
  workExperience: [
    {
      title: { type: String },
      company: { type: String },
      duration: { type: String },
      location: { type: String },
      responsibilities: [{ type: String }],
      dateRange: { type: String },
    },
  ],
  researchExperience: [
    {
      role: { type: String },
      institution: { type: String },
      duration: { type: String },
      description: { type: String },
    },
  ],
  publications: [
    {
      title: { type: String },
      journal: { type: String },
      year: { type: String },
      pages: { type: String },
    },
  ],
  awards: [
    {
      title: { type: String },
      institution: { type: String },
      organization: { type: String },
      year: { type: String },
      location: { type: String },
    },
  ],
  achievements: [{ description: { type: String } }],
  certifications: [{ type: String }],
  skills: [
    {
      skill: { type: String },
      proficiency: { type: String },
    },
  ],
  skills3:{ type: String },
  skills4:[{ type: String }],
  skillset: [{
    skill: { type: String },
    level: { type: String },
  },
  ],
  employmentHistory:[{
    title: { type: String },
    location: { type: String },
    responsibilities: [{ type: String }],
    date: { type: String },
  }],



  languages: [{ language: { type: String }, proficiency: { type: String } }],
  contact: { phone: { type: String }, address: { type: String }, email:{type:String} },
  cvTemplateType: { type: String },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  references: [{ phone: { type: String }, name: { type: String }, email:{type:String} }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('CV', cvSchema);








const Cv = mongoose.model('Cv', cvSchema);
let User = new mongoose.model("User", userSchema)

module.exports.Cv = Cv;
module.exports.User = User