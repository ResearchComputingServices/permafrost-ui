/**
 * Links services.
 * @version 1.0
 * @author Sergiu Buhatel <sergiu.buhatel@carleton.ca>
 */

import Constants from './Constants'

// Do not expose the class, keep it as private
class LinksServicesClass {
    constructor() {
        this.links = Constants.TOP_LEVEL_LINKS
    }

    getCurrentLink = () => {
        for(let index = 0; index < this.links.length; index++) {
            if(window.location.pathname === this.links[index].path) {
                return this.links[index]
            }
            if(window.location.pathname.includes(this.links[index].path) && this.links[index].path !== '/') {
                return this.links[index]
            }
        }
    }
}

// Instantiate one class item and only one
const linksServices = new LinksServicesClass()

// Do not allow any further changes to the schema. No new added or modified properties.
Object.freeze(linksServices)

// Export the instance as a service. This acts like a singleton.
export default linksServices
