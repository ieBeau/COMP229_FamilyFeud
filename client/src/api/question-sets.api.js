import { apiFetch } from "./api";

export const getQuestionSets = async () => {
    const response =  await apiFetch(`/question-sets`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .catch(error => {
        console.error('Error:', error);
        return [];
    });

    return response;
};

export const createQuestionSet = async (data) => {
    const response =  await apiFetch(`/question-sets`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .catch(error => {
        console.error('Error:', error);
        return [];
    });

    return response;
};

export const deleteQuestionSetById = async (id) => {
    const response =  await apiFetch(`/question-sets/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .catch(error => {
        console.error('Error:', error);
        return [];
    });

    return response;
};

