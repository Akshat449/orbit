import api from "./axios";

const getLists = async (boardId) => {
    const response = await api.get(`/boards/${boardId}/lists`)
    return response.data.lists;
}

const createList = async (boardId,title) => {
    const response = await api.post(`/boards/${boardId}/lists`,{title})
    return response.data.list;
}

const updateList = async (boardId,listId,title) => {
    const response = await api.put(`/boards/${boardId}/lists/${listId}`,{title})
    return response.data.list;
}

const deleteList = async (boardId,listId) => {
    const response = await api.delete(`/boards/${boardId}/lists/${listId}`)
    return response.data.message;
}

const reorderLists = async (boardId,orderedListIds) => {
    const response = await api.put(`/boards/${boardId}/lists/reorder`,{orderedListIds})
    return response.data.message;
}

export {getLists,createList,updateList,deleteList,reorderLists};