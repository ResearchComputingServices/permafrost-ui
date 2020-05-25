/**
 * Logged in user service.
 * @version 1.0
 * @author Sergiu Buhatel <sergiu.buhatel@carleton.ca>
 */

import axios from 'axios';
import Constants from './Constants'

// Do not expose the class, keep it as private
class LoginServiceClass {
    handleLogIn(userName, password) {
        return axios.get(Constants.LOGIN_URL + "?user_name=" + userName + "&password=" + password)
          .then(res => {
            return res.data
          })
    }

    handleLogout() {
    }
}

// Instantiate one class item and only one
const loginService = new LoginServiceClass()

// Do not allow any further changes to the schema. No new added or modified properties.
Object.freeze(loginService)

// Export the instance as a service. This acts like a singleton.
export default loginService
