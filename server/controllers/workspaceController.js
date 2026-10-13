import Workspace from "../models/Workspace.js";
import User from "../models/User.js";

const createWorkspace= async(req,res)=>{
    try{
        const {name, description} =req.body;
        if(!name){
            return res.status(400).json({message:"Workspace name is required"});
        }
        const workspace= await Workspace.create({
            name,
            description,
            owner:req.user._id,
            members:[req.user._id]
        });
        await User.findByIdAndUpdate(req.user._id,
            {$push:{workspaces:workspace._id}
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

const addWorkspaceMember = async (req, res) => {
    try {
        const { workspaceId } = req.params;
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        const workspace = await Workspace.findById(workspaceId);
        if (!workspace) {
            return res.status(404).json({ message: "Workspace not found" });
        }

        // Only existing members can invite
        const isMember = workspace.members.some(memberId => memberId.equals(req.user._id));
        if (!isMember) {
            return res.status(403).json({ message: "You are not a member of this workspace" });
        }

        const normalizedEmail = email.toLowerCase().trim();
        const userToAdd = await User.findOne({ email: normalizedEmail });

        if (!userToAdd) {
            return res.status(404).json({ message: "No registered user found with this email. Make sure they have signed up for Orbit first." });
        }

        // Check if already in workspace
        const alreadyMember = workspace.members.some(memberId => memberId.equals(userToAdd._id));
        if (alreadyMember) {
            return res.status(400).json({ message: "User is already a member of this workspace" });
        }

        workspace.members.push(userToAdd._id);
        await workspace.save();

        await User.findByIdAndUpdate(userToAdd._id, {
            $addToSet: { workspaces: workspace._id }
        });

        return res.status(200).json({
            message: "Member added successfully",
            member: {
                _id: userToAdd._id,
                name: userToAdd.name,
                email: userToAdd.email
            }
        });
    } catch (error) {
        console.error("Add Member Error:", error.message);
        return res.status(500).json({ message: "Server Error" });
    }
};

const getWorkspaceMembers = async (req, res) => {
    try {
        const { workspaceId } = req.params;
        const workspace = await Workspace.findById(workspaceId)
            .populate("members", "_id name email avatar")
            .populate("owner", "_id name email");

        if (!workspace) {
            return res.status(404).json({ message: "Workspace not found" });
        }

        const isMember = workspace.members.some(member => member._id.equals(req.user._id));
        if (!isMember) {
            return res.status(403).json({ message: "You are not a member of this workspace" });
        }

        return res.status(200).json({
            members: workspace.members,
            owner: workspace.owner
        });
    } catch (error) {
        console.error("Get Members Error:", error.message);
        return res.status(500).json({ message: "Server Error" });
    }
};

export { createWorkspace, getWorkspace, addWorkspaceMember, getWorkspaceMembers };
