import { handleResponse } from "../helpers/handleResponse";
import axios from "axios";
import { authenticationService } from "../services/authentication";

export const commentervice = {
    getAllComments: getAllComments,
    postComment: postComment,
    putComment: putComment,
    deleteComment: deleteComment
};

async function getAllComments() {
    const currentUser = authenticationService.currentUserValue;

    let response = await axios.get(`https://localhost:5001/api/comments`, {
        headers: {
            Authorization: `Bearer ${currentUser.token}`
        }
    });
    return handleResponse(response);
}
async function postComment(comment) {
    const currentUser = authenticationService.currentUserValue;

    let response = await axios.post(
        `https://localhost:5001/api/comments`,
        comment,
        {
            headers: {
                Authorization: `Bearer ${currentUser.token}`
            }
        }
    );
    return handleResponse(response);
}
async function putComment(comment) {
    const currentUser = authenticationService.currentUserValue;

    let response = await axios.put(
        `https://localhost:5001/api/comments/${comment.id}`,
        comment,
        {
            headers: {
                Authorization: `Bearer ${currentUser.token}`
            }
        }
    );
    return handleResponse(response);
}
async function deleteComment(id) {
    const currentUser = authenticationService.currentUserValue;

    let response = await axios.delete(
        `https://localhost:5001/api/comments/${id}`,
        {
            headers: {
                Authorization: `Bearer ${currentUser.token}`
            }
        }
    );
    return handleResponse(response);
}
