import { handleResponse } from "../helpers/handleResponse";
import axios from "axios";
import { authenticationService } from "../services/authentication";

export const articleService = {
    getAllArticles: getAllArticles,
    postArticle: postArticle,
    putArticle: putArticle,
    deleteArticle: deleteArticle
};

async function getAllArticles() {
    const currentUser = authenticationService.currentUserValue;

    let response = await axios.get(`https://localhost:5001/api/articles`, {
        headers: {
            Authorization: `Bearer ${currentUser.token}`
        }
    });
    return handleResponse(response);
}
async function postArticle(article) {
    const currentUser = authenticationService.currentUserValue;

    let response = await axios.post(
        `https://localhost:5001/api/articles`,
        article,
        {
            headers: {
                Authorization: `Bearer ${currentUser.token}`
            }
        }
    );
    return handleResponse(response);
}
async function putArticle(article) {
    const currentUser = authenticationService.currentUserValue;

    let response = await axios.put(
        `https://localhost:5001/api/articles/${article.id}`,
        article,
        {
            headers: {
                Authorization: `Bearer ${currentUser.token}`
            }
        }
    );
    return handleResponse(response);
}
async function deleteArticle(id) {
    const currentUser = authenticationService.currentUserValue;

    let response = await axios.delete(
        `https://localhost:5001/api/articles/${id}`,
        {
            headers: {
                Authorization: `Bearer ${currentUser.token}`
            }
        }
    );
    return handleResponse(response);
}
