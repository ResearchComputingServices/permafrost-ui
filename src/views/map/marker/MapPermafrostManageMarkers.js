import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';
import DeleteIcon from '@material-ui/icons/Delete';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import permafrostDataService from '../../../services/PermafrostDataService';
import Typography from '@material-ui/core/Typography';
import { ToastsContainer, ToastsStore } from 'react-toasts';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Constants from '../../../services/Constants';
import { mapStateToProps, mapDispatchToProps } from '../../../redux/mappings/MapSettingsReduxMappings';

class MapPermafrostManageMarkersClass extends Component {
    constructor(props) {
        super(props);
        this.state = this.getInitialState();
        this.originalName = '';
        this.locationServices = Constants.LOCATION_SERVICES.reduce((accumulator, service) => {
            accumulator[service.name] = service;
            return accumulator;
        }, {});
        this.fields = {
            name: {
                field: 'name',
                mappedName: 'text',
                mandatory: true
            },
            lat: {
                field: 'lat',
                type: 'number',
                mandatory: true
            },
            lng: {
                field: 'lng',
                type: 'number',
                mandatory: true
            },
            elevation: {
                field: 'elevation',
                mappedName: 'elevation_in_metres',
                caption: 'Elevation in Metres',
                type: 'number'
            },
            accuracy: {
                field: 'accuracy',
                mappedName: 'accuracy_in_metres',
                caption: 'Accuracy in Metres',
                type: 'number'
            },
            comment: {
                field: 'comment',
                type: 'textarea'
            },
            recordObservations: {
                field: 'recordObservations',
                mappedName: 'record_observations',
                caption: 'Record Observations',
                type: 'checkbox'
            },
            provider: {
                field: 'provider',
                type: 'picklist',
                mandatory: true,
                items: Object.keys(this.locationServices),
            }
        };
    }

    getInitialState() {
        return {
            create: true,
            openDeleteModal: false,
            form: {
                name: '',
                lat: '',
                lng: '',
                elevation: '',
                accuracy: '',
                comment: '',
                provider: '',
                recordObservations: false,
            }
        };
    }

    sanitizeTextField(val) {
        return val == null ? '' : val;
    }

    sanitizeCheckboxField(val) {
        return val == null ? false : val;
    }

    capitalize(s) {
        if (typeof s !== 'string') return ''
        return s.charAt(0).toUpperCase() + s.slice(1)
    }

    hasCurrentlySelectedMarker() {
        return this.props.mapsSettings.currentlySelectedMarkers && this.props.mapsSettings.currentlySelectedMarkers.length === 1;
    }

    componentDidUpdate(prevProps) {
        if (this.props.mapsSettings.currentlySelectedMarkers !== prevProps.mapsSettings.currentlySelectedMarkers) {
            if (this.hasCurrentlySelectedMarker()) {
                const currentlySelectedMarker = this.props.mapsSettings.currentlySelectedMarkers[0];
                const {
                    name,
                    lat,
                    lng,
                    elevation,
                    accuracy,
                    comment,
                    provider,
                    recordObservations,
                } = currentlySelectedMarker;
                this.setState({
                    create: false,
                    form: {
                        name: this.sanitizeTextField(name),
                        lat: this.sanitizeTextField(lat),
                        lng: this.sanitizeTextField(lng),
                        elevation: this.sanitizeTextField(elevation),
                        accuracy: this.sanitizeTextField(accuracy),
                        comment: this.sanitizeTextField(comment),
                        provider: this.sanitizeTextField(provider),
                        recordObservations: recordObservations || false,
                    }
                });
                this.originalName = name;
            } else {
                this.setState(this.getInitialState);
                this.originalName = '';
            }
        }
    }

    onChange(key, value) {
        if (key === 'name') {
            if (this.originalName !== value) {
                return this.setState({
                    ...this.state,
                    create: true,
                    form: {
                        ...this.state.form,
                        [key]: value,
                    }
                });
            }
        }
        return this.setState({
            ...this.state,
            form: {
                ...this.state.form,
                [key]: value,
            }
        });
    }

    createField(opts) {
        opts = opts || {};
        const fieldName = opts.field;
        if (fieldName == null) throw new Error('Name must be provided for field to be created');
        const type = opts.type || 'text';
        const caption = opts.caption || this.capitalize(fieldName);
        const mandatory = opts.mandatory !== null ? opts.mandatory : false;
        if (type === 'checkbox') {
            return (
                <FormControlLabel
                    className='marker-manager-checkbox-field'
                    control={
                        <Checkbox
                            checked={this.state.form[fieldName]}
                            onChange={e => this.onChange(fieldName, e.target.checked)}
                            name={caption}
                            color='primary'
                        />
                    }
                    label={<Typography className='marker-manager-checkbox-field-label'>{caption}</Typography>}
                />
            );
        }
        if (type === 'picklist') {
            const items = opts.items || [];
            return (
                <FormControl
                    error={mandatory && !this.state.form[fieldName]}
                >
                    <Select
                        value={this.state.form[fieldName]}
                        className='marker-manager-fields'
                        onChange={e => this.onChange(fieldName, e.target.value)}
                    >
                        {items.map((item, index) => (
                            <MenuItem key={index} value={item}>
                                <em>{item}</em>
                            </MenuItem>
                        ))}
                    </Select>
                    <FormHelperText>{caption}</FormHelperText>
                </FormControl>
            );
        }
        if (type === 'textarea') {
            return (
                <TextField
                    value={this.state.form[fieldName]}
                    className='marker-manager-fields'
                    helperText={caption}
                    type={type}
                    onChange={e => this.onChange(fieldName, e.target.value)}
                    multiline
                    error={mandatory && this.state.form[fieldName] === ''}
                />
            );
        }
        return (
            <TextField
                value={this.state.form[fieldName]}
                className='marker-manager-fields'
                helperText={caption}
                type={type}
                onChange={e => this.onChange(fieldName, e.target.value)}
                error={mandatory && this.state.form[fieldName] === ''}
            />
        );
    }

    canCreate() {
        const locationService = this.locationServices[this.state.form.provider];
        const canCreate = locationService && locationService.permissions && locationService.permissions.create;
        return canCreate === true;
    }

    canUpdate() {
        const locationService = this.locationServices[this.state.form.provider];
        const canUpdate = locationService && locationService.permissions && locationService.permissions.update;
        return canUpdate === true;
    }

    isInCreateMode() {
        return this.state.create;
    }

    isFormValid(form) {
        for (const fieldName in form) {
            const fieldDef = this.fields[fieldName];
            const isMandatory = fieldDef.mandatory;
            if (isMandatory && !fieldDef.type && !form[fieldName]) {
                return false;
            }
            if (isMandatory && fieldDef.type === 'number' && (form[fieldName] == null || form[fieldName] === '')) {
                return false;
            }
        }
        return true;
    }

    getFormData(form) {
        const data = {};
        for (const fieldName in form) {
            let value = form[fieldName];
            const key = this.fields[fieldName].mappedName || fieldName;
            const type = this.fields[fieldName].type;
            if (type === 'number' && value === '') {
                value = null;
            }
            data[key] = value;
        }
        return data;
    }

    find(name) {
        return this.props.mapsSettings && this.props.mapsSettings.markers.find(({ text }) => text === name);
    }

    onDelete() {
        this.setState({
            ...this.state,
            openDeleteModal: true
        });
    }

    canDelete() {
        const locationService = this.locationServices[this.state.form.provider];
        return this.state.form.name && (locationService ? locationService.permissions.delete : true)
    }

    onCloseDeleteModal() {
        this.setState({
            ...this.state,
            openDeleteModal: false,
        });
    }

    onCancelDelete() {
        this.setState({
            ...this.state,
            openDeleteModal: false,
        });
    }

    async onCreate() {
        if (!this.canCreate()) return;
        const marker = this.getFormData(this.state.form);
        if (this.find(marker.text)) {
            return ToastsStore.warning(`${this.state.form.name} already exist!`);
        }
        try {
            await permafrostDataService.addLocationOfObservations(marker);
            this.props.updateMapsSettings({
                ...this.props.mapsSettings,
                markers: [...this.props.mapsSettings.markers, marker],
                currentlySelectedMarkers: []
            });
            ToastsStore.success('Successfully Created a Marker');
        } catch (err) {
            ToastsStore.error('An error has occured');
        }
    }

    async onUpdate() {
        if (!this.canUpdate()) return;
        const marker = this.getFormData(this.state.form);
        try {
            await permafrostDataService.updateLocationOfObservations(marker);
            this.props.updateMapsSettings({
                ...this.props.mapsSettings,
                markers: this.props.mapsSettings.markers.filter(item => item.text !== marker.text).concat([marker]),
                currentlySelectedMarkers: []
            });
            ToastsStore.success('Successfully Updated a Marker');
        } catch (err) {
            ToastsStore.error('An error has occured');
        }
    }

    onConfirmDelete() {
        this.setState({
            ...this.state,
            openDeleteModal: false,
        }, async () => {
            const form = this.state.form;
            const marker = this.getFormData(form);
            const storeMarker = this.find(marker.text);
            if (!storeMarker) {
                return ToastsStore.warning(`${this.state.form.name} does not exist!`);
            }
            if (storeMarker) {
                const locationService = this.locationServices[storeMarker.provider];
                const canDelete = locationService && locationService.permissions && locationService.permissions.delete;
                if (!canDelete) return ToastsStore.success('Cannot delete from provider');
            }
            try {
                await permafrostDataService.deleteLocationOfObservations(marker);
                this.props.updateMapsSettings({
                    ...this.props.mapsSettings,
                    markers: this.props.mapsSettings.markers.filter(item => item.text !== marker.text),
                    currentlySelectedMarkers: []
                });
                ToastsStore.success('Successfully Deleted a Marker');
            } catch (err) {
                ToastsStore.error('An error has occured');
            }
        });
    }

    render() {
        const isFormValid = this.isFormValid(this.state.form);
        const disableCreate = !isFormValid ? true : !(this.state.create && this.canCreate());
        const disableUpdate = !isFormValid ? true : !(!this.state.create && this.canUpdate());
        const disableDelete = !this.canDelete();
        return (
            <form noValidate autoComplete='off'>
                <div className='marker-manager-container' >
                    {this.createField(this.fields['name'])}
                    <div className='marker-manager-form-section'>
                        {this.createField(this.fields['lat'])}
                        {this.createField(this.fields['lng'])}
                    </div>
                    {this.createField(this.fields['elevation'])}
                    {this.createField(this.fields['accuracy'])}
                    {this.createField(this.fields['comment'])}
                    {this.createField(this.fields['provider'])}
                    {this.createField(this.fields['recordObservations'])}
                </div>
                {
                    this.isInCreateMode()
                        ? (
                            <Button
                                className={`marker-manager-button ${!disableCreate ? 'active-button-color' : ''}`}
                                variant='contained'
                                size='small'
                                startIcon={<SaveIcon />}
                                disabled={disableCreate}
                                onClick={this.onCreate.bind(this)}
                            >
                                Create
                            </Button>
                        )
                        : (
                            <Button
                                className={`marker-manager-button ${!disableUpdate ? 'active-button-color' : ''}`}
                                variant='contained'
                                size='small'
                                startIcon={<SaveIcon />}
                                disabled={disableUpdate}
                                onClick={this.onUpdate.bind(this)}
                            >
                                Update
                            </Button>
                        )
                }
                <Button
                    className='marker-manager-button'
                    variant='contained'
                    color='secondary'
                    size='small'
                    startIcon={<DeleteIcon />}
                    disabled={disableDelete}
                    onClick={this.onDelete.bind(this)}
                >
                    Delete
                </Button>
                <Dialog
                    open={this.state.openDeleteModal}
                    onClose={this.onCloseDeleteModal.bind(this)}
                >
                    <DialogTitle id='alert-dialog-title'>{'Delete Confirmation'}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id='alert-dialog-description'>
                            Are you sure you want to delete this observation?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.onCancelDelete.bind(this)} color='primary'>
                            Cancel
                        </Button>
                        <Button onClick={this.onConfirmDelete.bind(this)} color='primary' autoFocus>
                            Confirm
                        </Button>
                    </DialogActions>
                </Dialog>
                <ToastsContainer store={ToastsStore} />
            </form>
        );
    }
}

const MapPermafrostManageMarkers = connect(mapStateToProps, mapDispatchToProps)(MapPermafrostManageMarkersClass);

export default MapPermafrostManageMarkers;
