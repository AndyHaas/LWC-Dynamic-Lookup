import { LightningElement,api,track } from 'lwc';
import getResults from '@salesforce/apex/dynamicLookupController.getResults';

export default class DynamicLookup extends LightningElement {
    @api objectName = 'Account';
    @api fieldName = 'Name';
    @api Label;
    @track searchRecords = [];
    @track selectedRecords = [];
    @api selectedRecordId = '';
    @api selectRecordId = '';
    @track selectRecordName;
    @api required = false;
    @api iconName = 'standard:account'
    @api LoadingText = false;
    @track txtclassname = 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click';
    @track messageFlag = false;
    @api whereClause = '';
    @api multi = false;
 
    searchField(event) {
        console.log('searchField event.target.value',event.target.value);
        var currentText = event.target.value;
        var selectRecId = [];
        for(let i = 0; i < this.selectedRecords.length; i++){
            selectRecId.push(this.selectedRecords[i].recId);
        }
        this.LoadingText = true;
        getResults({ ObjectName: this.objectName, fieldName: this.fieldName, value: currentText, selectedRecId : selectRecId })
        .then(result => {
            this.searchRecords= result;
            this.LoadingText = false;
            
            this.txtclassname =  result.length > 0 ? 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click slds-is-open' : 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click';
            if(currentText.length > 0 && result.length == 0) {
                this.messageFlag = true;
            }
            else {
                this.messageFlag = false;
            }

            if(this.selectRecordId != null && this.selectRecordId.length > 0) {
                this.iconFlag = false;
                this.clearIconFlag = true;
            }
            else {
                this.iconFlag = true;
                this.clearIconFlag = false;
            }
        })
        .catch(error => {
            console.log('-------error-------------'+error);
            console.log(error);
        });
        
    }
    
   setSelectedRecord(event) {
        var recId = event.currentTarget.dataset.id;
        var selectName = event.currentTarget.dataset.name;
        this.txtclassname =  'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click';


        // Multi Select values
        if(this.multi) {		
            this.template.querySelectorAll('lightning-input').forEach(each => {
            each.value = '';
            });
            let newsObject = { 'recId' : recId ,'recName' : selectName };
            this.selectedRecords.push(newsObject);
            console.log('this.selectedRecords',this.selectedRecords);
            this.selectedRecordsId = this.selectedRecords.map(item => item.recId).toString();
            console.log('this.selectedRecordsId',this.selectedRecordsId);
            let selRecords = this.selectedRecords;
            const selectedEvent = new CustomEvent('selected', { detail: {selRecords}, });
            // Dispatches the event.
            this.dispatchEvent(selectedEvent);
        } else {
            // Single Select values
            this.iconFlag = false;
            this.clearIconFlag = true;
            this.inputReadOnly = true;
            this.selectRecordName = event.currentTarget.dataset.name;
            let newsObject = { 'recId' : recId ,'recName' : selectName };
            this.selectedRecords.push(newsObject);
            this.selectedRecordsId = this.selectedRecords.map(item => item.recId).toString();
            const selectedEvent = new CustomEvent('selected', { detail: {selectName, recId}, });
            // Dispatches the event.
            this.dispatchEvent(selectedEvent);
        }
    }

    // For Multi Select
    removeRecord (event){
        let selectRecId = [];
        for(let i = 0; i < this.selectedRecords.length; i++){
            if(event.detail.name !== this.selectedRecords[i].recId)
                selectRecId.push(this.selectedRecords[i]);
        }
        this.selectedRecords = [...selectRecId];
        let selRecords = this.selectedRecords;
        const selectedEvent = new CustomEvent('selected', { detail: {selRecords}, });
        // Dispatches the event.
        this.dispatchEvent(selectedEvent);
    }

    // For Single Select
    resetData(event) {
        this.selectRecordName = "";
        this.selectRecordId = "";
        this.inputReadOnly = false;
        this.iconFlag = true;
        this.clearIconFlag = false;
        this.selectedRecords = [];
        this.dispatchEvent(selectedEvent);
    }
}