
const mongoose=require("mongoose");


const videoSchema = new mongoose.Schema({
    url: String,
    name: String,
    email: String,
    timestamp: { type: Date, default: Date.now },
  });
const userSchema = new mongoose.Schema({
  email: { type: String, required: true },
  name: { type: String, required: true }, 
});
mongoose.models = {};
const User = mongoose.model("User", userSchema);
const Video= mongoose.model('Video', videoSchema);

module.exports={
    User,
    Video
}


