/**
 * Client Configurations
 * @version 1.0
 * @author Sergiu Buhatel <sergiu.buhatel@carleton.ca>
 */

class ClientConfig {
  getServerURL() {
    return 'http://localhost'
  }
  getAuthenticationURL () {
    return this.getServerURL() + ':7006'
  }
  getPermafrostApi() {
    return this.getServerURL() + ':7004/permafrost_api'
  }
  getPermafrostObservationsApi() {
    return this.getServerURL() + ':7002/permafrost_observations_api'
  }
  getPermafrostWFSApi() {
    return this.getServerURL() + ':5004/permafrost_wfs_api'
  }

  // Keycloak stuff
  getRealm() {
    return ''
  }
  getClient() {
    return ''
  }
  getServer() {
    return ''
  }
  getPort() {
    return ''
  }
  getSecret() {
    return ''
  }
  isHTTPS() {
    return true
  }
}

export default ClientConfig

