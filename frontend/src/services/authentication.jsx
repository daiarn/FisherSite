import { BehaviorSubject } from "rxjs";

//import config from "config";
import { handleResponse } from "../helpers/handleResponse";
import axios from "axios";
import jwt from "jwt-decode";

const currentUserSubject = new BehaviorSubject(
    JSON.parse(localStorage.getItem("currentUser"))
);

export const authenticationService = {
    login,
    logout,
    refresh,
    checkTimestemp,
    register,
    currentUser: currentUserSubject.asObservable(),
    get currentUserValue() {
        return currentUserSubject.value;
    },
    get refreshStatus() {
        const user = jwt(authenticationService.currentUserValue.token);
        const time = Math.floor(Date.now() / 1000);
        return user.exp < time;
    }
};

function login(username, password) {
    return axios
        .post(`https://localhost:5001/api/login`, { username, password })
        .then(handleResponse)
        .then(user => {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem("currentUser", JSON.stringify(user));
            currentUserSubject.next(user);
            //console.log(user.data);
            return user;
        });
}

function logout() {
    // remove user from local storage to log user out
    localStorage.removeItem("currentUser");
    currentUserSubject.next(null);
    window.location.reload();
}

function checkTimestemp() {
    const user = jwt(authenticationService.currentUserValue.token);
    return user;
}

function refresh() {
    return axios
        .post(`https://localhost:5001/api/refresh`, currentUserSubject.value)
        .then(user => {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem(
                "currentUser",
                JSON.stringify({ ...user.data })
            );
            currentUserSubject.next(user);
            return user;
        });
}
function register(newUser) {
    return axios
        .post(`https://localhost:5001/api/register`, newUser)
        .then(handleResponse)
        .then(user => {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem("currentUser", JSON.stringify(user));
            currentUserSubject.next(user);
            return user;
        });
}
