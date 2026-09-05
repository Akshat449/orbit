import api from "./axios";

const getBoards = async (workspaceId) => {
    const response = await api.get(`/workspaces/${workspaceId}/boards`)
    return response.data.boards
}

const createBoard = async (workspaceId, boardData) => {
    const response = await api.post(`/workspaces/${workspaceId}/boards`, boardData)
    return response.data.board
}

export { getBoards, createBoard }