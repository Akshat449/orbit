import Workspace from "../models/Workspace.js";

const createWorkspace= async(req,res)=>{
    try{
        const {name} =req.body;
        if(!name){
            return res.status(400).json({message:"Workspace name is required"});
        }
        const workspace= await Workspace.create({
            name,
            owner:req.user._id,
            members:[req.user._id]
        });

        return res.status(201).json({message:"Workspace created successfully",workspace});
    }
    catch(error){
        console.log(error.message);
        return res.status(500).json({message:"Server Error"});
    }
}

const getWorkspace=async(req,res)=>{
    try{
        const workspace= await Workspace.find({members:req.user._id}).populate("owner","_id name");
        return res.status(200).json({workspace});
    }
    catch(error){
        console.log(error.message);
        return res.status(500).json({message:"Server Error"});
    }
}

export { createWorkspace, getWorkspace };
