const mongoose=require("mongoose");
const songSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    artist:{
        type:String,
        required:true,
    },
    audioUrl:{
        type:String,
        required:true,
    },
    thumbnailUrl: {
        type: String,
        required: true,
    },
});
songSchema.index({
    name: 'text',
});
const Song=mongoose.model("Song",songSchema);
module.exports=Song;

