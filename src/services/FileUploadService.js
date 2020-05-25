/**
 * File upload service.
 * @version 1.0
 * @author Sergiu Buhatel <sergiu.buhatel@carleton.ca>
 */

import axios from 'axios';
import Constants from './Constants'

// Do not expose the class, keep it as private
class FileUploadServiceClass {
    fileUpload(file){
        const formData = new FormData();
        formData.append('file',file)
        const config = {
            headers: {
                'content-type': 'multipart/form-data',
            }
        }
        return axios.post(Constants.FILE_UPLOAD_URS, formData,config).then(res => {
            return res
          }).catch(function (error) {
            // handle error
            console.log(error)
          })
    }

    fileDownload(fileName){
        return axios.get(Constants.FILE_DOWNLOAD_URS + '?name=' + fileName, { responseType: "blob" }).then(res => {
            return res
          }).catch(function (error) {
            // handle error
            console.log(error)
          })
    }
}

// Instantiate one class item and only one
const fileUploadService = new FileUploadServiceClass()

// Export the instance as a service. This acts like a singleton.
export default fileUploadService
