import api from "./axios";

const getCards = async (boardId) => {
    const response = await api.get(`/boards/${boardId}/cards`)
    return response.data.cards;
}

const createCard = async (listId,title,description = "") => {
    const response = await api.post(`/lists/${listId}/cards`,{title,description})
    return response.data.card;
}

const updateCard = async (cardId,title = "",description = "") => {
    const response = await api.put(`/cards/${cardId}`,{title,description})
    return response.data.card;
}

const deleteCard = async (cardId) => {
    const response = await api.delete(`/cards/${cardId}`)
    return response.data.message;
}

const reorderCards = async (cardId,sourceListId,destListId, newPosition) => {
    const response = await api.put(`/cards/reorder`,{cardId, sourceListId, destListId, newPosition})
    return response.data.message;
}

export {getCards,createCard,updateCard,deleteCard,reorderCards};