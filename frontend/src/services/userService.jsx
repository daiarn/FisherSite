import jwt from "jwt-decode";
import { handleResponse } from "../helpers/handleResponse";
import axios from "axios";
import { authenticationService } from "./authentication";

export const userService = {
    getAllUsers: getAllUsers,
    getUser: getUser,
    getCurrentUser: getCurrentUser,
    getCurrentUserArticles: getCurrentUserArticles,
    getCurrentUserArticle: getCurrentUserArticle,
    getCurrentUserComments: getCurrentUserComments,
    getCurrentUserComment: getCurrentUserComment,
    postUser: postUser,
    putUser: putUser,
    deleteUser: deleteUser
};

async function getAllUsers() {
    const currentUser = authenticationService.currentUserValue;
    if (authenticationService.refreshStatus) {
        authenticationService.refresh();
    }
    let response = await axios.get(`https://localhost:5001/api/users`, {
        headers: {
            Authorization: `Bearer ${currentUser.token}`
        }
    });
    return handleResponse(response);
}

async function getUser(id) {
    const currentUser = authenticationService.currentUserValue;
    if (authenticationService.refreshStatus) {
        authenticationService.refresh();
    }
    let response = await axios.get(`https://localhost:5001/api/users/${id}`, {
        headers: {
            Authorization: `Bearer ${currentUser.token}`
        }
    });
    return handleResponse(response);
}

async function getCurrentUser() {
    const currentUser = authenticationService.currentUserValue;
    if (authenticationService.refreshStatus) {
        authenticationService.refresh();
    }
    const userInfo = jwt(currentUser.token);

    let response = await axios.get(
        `https://localhost:5001/api/users/${userInfo.id}`,
        {
            headers: {
                Authorization: `Bearer ${currentUser.token}`
            }
        }
    );
    return handleResponse(response);
}

async function getCurrentUserArticles() {
    const currentUser = authenticationService.currentUserValue;
    if (authenticationService.refreshStatus) {
        authenticationService.refresh();
    }
    const userInfo = jwt(currentUser.token);

    let response = await axios.get(
        `https://localhost:5001/api/users/${userInfo.id}/Articles`,
        {
            headers: {
                Authorization: `Bearer ${currentUser.token}`
            }
        }
    );
    return handleResponse(response);
}

async function getCurrentUserArticle(id) {
    const currentUser = authenticationService.currentUserValue;
    if (authenticationService.refreshStatus) {
        authenticationService.refresh();
    }
    const userInfo = jwt(currentUser.token);

    let response = await axios.get(
        `https://localhost:5001/api/users/${userInfo.id}/Articles/${id}`,
        {
            headers: {
                Authorization: `Bearer ${currentUser.token}`
            }
        }
    );
    return handleResponse(response);
}

async function getCurrentUserComments() {
    const currentUser = authenticationService.currentUserValue;
    if (authenticationService.refreshStatus) {
        authenticationService.refresh();
    }
    const userInfo = jwt(currentUser.token);

    let response = await axios.get(
        `https://localhost:5001/api/users/${userInfo.id}/Comments`,
        {
            headers: {
                Authorization: `Bearer ${currentUser.token}`
            }
        }
    );
    return handleResponse(response);
}

async function getCurrentUserComment(id) {
    const currentUser = authenticationService.currentUserValue;
    if (authenticationService.refreshStatus) {
        authenticationService.refresh();
    }
    const userInfo = jwt(currentUser.token);

    let response = await axios.get(
        `https://localhost:5001/api/users/${userInfo.id}/Comments/${id}`,
        {
            headers: {
                Authorization: `Bearer ${currentUser.token}`
            }
        }
    );
    return handleResponse(response);
}

async function postUser(user) {
    const currentUser = authenticationService.currentUserValue;
    if (authenticationService.refreshStatus) {
        authenticationService.refresh();
    }
    let response = await axios.post(`https://localhost:5001/api/users`, user, {
        headers: {
            Authorization: `Bearer ${currentUser.token}`
        }
    });
    return handleResponse(response);
}
async function putUser(user) {
    const currentUser = authenticationService.currentUserValue;
    if (authenticationService.refreshStatus) {
        authenticationService.refresh();
    }
    let response = await axios.put(
        `https://localhost:5001/api/users/${user.id}`,
        user,
        {
            headers: {
                Authorization: `Bearer ${currentUser.token}`
            }
        }
    );
    return handleResponse(response);
}
async function deleteUser(id) {
    const currentUser = authenticationService.currentUserValue;
    if (authenticationService.refreshStatus) {
        authenticationService.refresh();
    }
    let response = await axios.delete(
        `https://localhost:5001/api/users/${id}`,
        {
            headers: {
                Authorization: `Bearer ${currentUser.token}`
            }
        }
    );
    return handleResponse(response);
}
