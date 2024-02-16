const mongoose=require("mongoose");
const User=new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
        private:true,
    },
    lastName:{
        type:String,
    },
    email:{
        type:String,
        required:true,
    },
    username:{
        type:String,
        required:true,
    },
    likedSongs: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Song',
        default: [],
    },
    likedPlaylists:{
        type:String,
        default:"",
    },
    subscribedArtists:{
        type:String,
        default:"",
    },
});
const UserModel=mongoose.model("User",User);
module.exports=UserModel;

