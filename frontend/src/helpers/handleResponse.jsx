import { authenticationService } from "../services/authentication";
import { history } from "./history";

export function handleResponse(response) {
    //console.log(response);
    if (response.status !== 200) {
        if ([401, 403].indexOf(response.status) !== -1) {
            if (
                response.status == 401 &&
                authenticationService.currentUserValue
            ) {
                authenticationService.refresh();
            } else {
                // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
                authenticationService.logout();
                //location.reload(true);
                history.go(0);
            }
        }

        const error = (response && response.message) || response.statusText;
        return Promise.reject(error);
    }
    return response.data;
}
