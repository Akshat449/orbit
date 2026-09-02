import mongoose from "mongoose";

const boardSchema=new mongoose.Schema({
    title:{type:String,required:true},
    workspace:{type:mongoose.Schema.Types.ObjectId,ref:'Workspace'},
},{timestamps:true});

const Board=mongoose.model("Board",boardSchema);

export default Board;
