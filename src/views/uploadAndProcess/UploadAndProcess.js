/**
 * Upload and process files
 * @version 1.0
 * @author Sergiu Buhatel <sergiu.buhatel@carleton.ca>
 */

import React, {Component} from 'react';
import { connect } from "react-redux";
import {ToastsContainer, ToastsStore} from 'react-toasts'
import { library } from '@fortawesome/fontawesome-svg-core';
import { faUpload } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { mapStateToProps, mapDispatchToProps } from '../../redux/mappings/LoggedInUserReduxMappings'
import fileUploadService from '../../services/FileUploadService'
import FileSaver from 'file-saver';

class UploadAndProcessClass extends Component {
    constructor(props) {
        super(props)
        library.add(faUpload);
        this.state ={
          file: null,
          text: null
        }
        this.onFormSubmit = this.onFormSubmit.bind(this)
        this.onChange = this.onChange.bind(this)
        this.onFormSubmit = this.onFormSubmit.bind(this)
    }

    onFormSubmit(e){
        e.preventDefault() // Stop form submit
        fileUploadService.fileUpload(this.state.file).then(response => {
            if(response && response.status === 201) {
                fileUploadService.fileDownload(this.state.file.name).then(response => {
                    if(response && response.status === 200) {
                        this.setState({text:response.data})
                        const blob = new Blob([response.data]);
                        FileSaver.saveAs(blob, this.state.file.name);
                    }
                })
            }
        })
    }

    onChange(e) {
        this.setState({file:e.target.files[0]})
    }

    canDisplayView() {
        const canDisplay = (!!this.props.loggedInUser && !!this.props.loggedInUser.loggedInUserRoles &&
                          !!this.props.loggedInUser.loggedInUserName);
        if (!!this.props.loggedInUser) {
            let hasPerms = false;
            if (Array.isArray(this.props.loggedInUser.loggedInUserRoles)) {
                hasPerms = ['Administrator', 'Contributor'].some(role => this.props.loggedInUser.loggedInUserRoles.indexOf(role) >= 0);
            }
            return canDisplay && hasPerms;
        }
        return canDisplay
    }

    render() {
        const jsx=(this.canDisplayView()) ? <div className='center-group'>
                <h4 className='headline-selector'>File Upload and Process</h4>
                <div className='marker-top-margin'>
                    <form onSubmit={this.onFormSubmit}>
                        <input type="file" onChange={this.onChange} />
                        <button disabled = {!this.state.file}
                                type="submit"
                                className='left-margin'
                                data-toggle="tooltip" data-placement="bottom"
                                title="Upload, process and download a file.">
                            <FontAwesomeIcon icon="upload"/>
                        </button>
                    </form>
                </div>
                <ToastsContainer store={ToastsStore}/>
            </div> : null

        return (<div>{jsx}</div>)
    }
}

const UploadAndProcess = connect(mapStateToProps, mapDispatchToProps)(UploadAndProcessClass)
export default UploadAndProcess
