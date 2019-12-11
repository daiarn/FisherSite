import { BehaviorSubject } from "rxjs";

//import config from "config";
import { handleResponse } from "../helpers/handleResponse";
import axios from "axios";

const currentUserSubject = new BehaviorSubject(
    JSON.parse(localStorage.getItem("currentUser"))
);

export const authenticationService = {
    login,
    logout,
    refresh,
    currentUser: currentUserSubject.asObservable(),
    get currentUserValue() {
        return currentUserSubject.value;
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
}
function refresh() {
    return axios
        .post(`https://localhost:5001/api/refresh`, currentUserSubject.value)
        .then(user => {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem("currentUser", JSON.stringify(user));
            currentUserSubject.next(user);
            //console.log(user.data);
            return user;
        });
}
