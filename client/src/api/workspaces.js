import api from "./axios";

const getWorkspaces = async () => {
    const response = await api.get("/workspaces");
    return response.data.workspace;
}

const createWorkspace = async (workspaceData) => {
    const response = await api.post("/workspaces",workspaceData);
    return response.data.workspace;
}

export { getWorkspaces, createWorkspace };

