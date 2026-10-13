import api from "./axios";

const getBoardMessages = async (boardId) => {
    try {
        const response = await api.get(`/boards/${boardId}/messages`);
        return response.data.messages || [];
    } catch (error) {
        console.error("Failed to fetch board messages:", error);
        throw error;
    }
};

export { getBoardMessages };
