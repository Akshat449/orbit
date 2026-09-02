import Board from "../models/Board.js";

const createBoard=async(req,res)=>{
    try{
        const {title,workspaceId}=req.body;
        if(!title ||!workspaceId){
            return res.status(400).json({message:"Title and workspaceId are required"})
        }
        const board=await Board.create({
            title,
            workspace:workspaceId
        })
        return res.status(201).json({message:"Board created successfully",board});
    }
    catch(error){
        console.log(error.message);
        return res.status(500).json({message:"Server Error"});
    }
}

const getBoards=async(req,res)=>{
    try{
        const {workspaceId} = req.params;
        if(!workspaceId){
            return res.status(400).json({message:"Workspace Id is required"})
        }
        const boards=await Board.find({workspace:workspaceId})
        return res.status(200).json({message:"Boards fetched successfully",boards});
    }
    catch(error){
        console.log(error.message);
        return res.status(500).json({message:"Server Error"})
    }
}
export {createBoard,getBoards}