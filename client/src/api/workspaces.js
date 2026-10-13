import api from "./axios";

const getWorkspaces = async () => {
    const response = await api.get("/workspaces");
    return response.data.workspace;
}

const createWorkspace = async (workspaceData) => {
    const response = await api.post("/workspaces",workspaceData);
    return response.data.workspace;
}

const getWorkspaceMembers = async (workspaceId) => {
    const response = await api.get(`/workspaces/${workspaceId}/members`);
    return response.data;
}

const addWorkspaceMember = async (workspaceId, email) => {
    const response = await api.post(`/workspaces/${workspaceId}/members`, { email });
    return response.data;
}

export { getWorkspaces, createWorkspace, getWorkspaceMembers, addWorkspaceMember };

