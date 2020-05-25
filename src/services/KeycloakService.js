/**
 * Keycloak service.
 * @version 1.0
 * @author Sergiu Buhatel 
 */

import Keycloak from 'keycloak-js';
import axios from 'axios';
import ClientConfig from '../client-configurations';

const clientConfig = new ClientConfig();

// Do not expose the class, keep it as private
class KeycloakServiceClass {
    constructor() {
        const protocol = clientConfig.isHTTPS() ? 'https' : 'http';
        this._keycloakAuth = Keycloak({
            'realm': clientConfig.getRealm(),
            'clientId': clientConfig.getClient(),
            'resource': clientConfig.getClient(),
            'auth-server-url': `${protocol}://${clientConfig.getServer()}:${clientConfig.getPort()}/auth`,
            'url': `${protocol}://${clientConfig.getServer()}:${clientConfig.getPort()}/auth`,
            'ssl-required': clientConfig.isHTTPS() ? 'external-requests' : 'none',
            'credentials': { 'secret': clientConfig.getSecret() },
            'enable-cors': true,
            'confidential-port': 0
        });
    }

    registerTokenInterceptor() {
        axios.interceptors.request.use((request) => {
            request.headers.Authorization = `Bearer ${this._keycloakAuth.token}`;
            return request;
        });
    }

    registerUnauthorizedInterceptor() {
        axios.interceptors.response.use(response => response, (error) => {
            if (error && error.response && error.response.status === 401) {
                return this._keycloakAuth.logout();
            }
            return Promise.reject(error);
        });
    }

    registerInterceptors() {
        this.registerTokenInterceptor();
        this.registerUnauthorizedInterceptor();
    }

    getUser() {
        return this._keycloakAuth.loadUserProfile();
    }

    getUserRole() {
        const roleObject = this._keycloakAuth.realmAccess
        const { roles } = typeof roleObject === 'object'
            && roleObject;
        return roles || [];
    }

    async login() {
        const authenticated = await this._keycloakAuth.init({ onLoad: 'login-required', promiseType: 'native' });
        if (!authenticated) {
            window.location.reload();
        }
        this.registerInterceptors();
        const user = await this.getUser();
        user.roles = this.getUserRole();
        return user;
    }

    async logout() {
        await this._keycloakAuth.logout();
    }
}

// Instantiate one class item and only one
const keycloakService = new KeycloakServiceClass();

// Do not allow any further changes to the schema. No new added or modified properties.
Object.freeze(keycloakService);

// Export the instance as a service. This acts like a singleton.
export default keycloakService;

