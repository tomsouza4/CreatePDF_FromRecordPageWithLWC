import { LightningElement, wire, api } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
import { loadScript } from "lightning/platformResourceLoader";
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import JSPDF from '@salesforce/resourceUrl/jspdf';
import pokemonFiles from '@salesforce/resourceUrl/pokemonFiles';

const OPPORTUNITY_FIELDS = [
    'Opportunity.Amount',
    'Opportunity.Owner.Name',
    'Opportunity.Owner.Email'
]; 

export default class CreatePDFs extends LightningElement {

    @api recordId;
    opportunityData = {};
    error;
    errorMessages = [];
    toastMessage = '';
    dataCurrentOpp;
    errorMessage = false;
    // The folder containing all the logos were added as a zip file 
    headerLogo = pokemonFiles + '/pokemon-pikachu.png';
    footerLogo = pokemonFiles + '/pokemonFootnote.png';


    // Invokes the action when the button is clicked on UI
    @api async invoke() {
        if(this.validateOppFields(this.dataCurrentOpp) === 0){
        //      this.generatePdf();
        }
    }

    @wire(getRecord, { recordId: '$recordId', fields: OPPORTUNITY_FIELDS })
    wiredOpportunity({ error, data }) {
        console.log('***Entered wire');
        // console.log('***data.fields.Name.value: ' + data.fields.Name.value);
        console.log('***data.fields.Amount.value: ' + data.fields.Amount.value);
        console.log('***data.fields.Owner.value.fields.Name.value: ' + data.fields.Owner.value.fields.Name.value);
        if (data) {
            console.log('***Entered if(data)');
            this.dataCurrentOpp = data;

        } else if (error) {
            console.error('***Error retrieving opportunity:', error);
        }
    }

    // // Validates the data and if the required fields were filled out, if not a Toast msg is shown
    validateOppFields(dataOpps){
        this.errorMessages = [];
        // console.log('***data.fields.Name.value: ' + dataOpps.fields.Name.value);
        // console.log('***data.fields.Amount.value: ' + dataOpps.fields.Amount.value);
        // console.log('***data.fields.Owner.value.fields.Name.value: ' + dataOpps.fields.Owner.value.fields.Name.value);
    
        if(dataOpps === null){
            this.errorMessages.push('Error Opportunity not found');
            return;
        }

        if (dataOpps.fields.Amount.value === null) {
            this.errorMessages.push(' Amount');
        }

        if (dataOpps.fields.Owner.value === null) {
            this.errorMessages.push(' Opportunity Owner');
        }

        if (dataOpps.fields.Owner.value.fields.Email.value === null) {
            this.errorMessages.push(' Opportunity Email');
        }

    //     if(dataOpps.fields.Invoice_Date__c.value != null){
    //         var myDate = new Date(dataOpps.fields.Invoice_Date__c.value);
    //         var formattedInvoiceDate = myDate.toLocaleDateString('en-US', {
    //             year: 'numeric',
    //             month: 'long',
    //             day: 'numeric'
    //             });
    //     }else{
    //         this.errorMessages.push(' Invoice Date');
    //     }

        if(this.errorMessages.length === 0){            
            
            this.opportunityData = {
                amount: dataOpps.fields.Amount.value,
                ownerid: dataOpps.fields.Owner.value.fields.Name.value,
                owneremail: dataOpps.fields.Owner.value.fields.Email.value
            };

        }else{
            this.toastMessage += this.errorMessages; 

            // Creates the toast message indicating which fields must be filled out
            const toastMsg = new ShowToastEvent({
                title: 'Please, fill out all required Fields: ',
                message: this.toastMessage,
                variant: 'info',
                mode: 'dismissable'
            });

            this.dispatchEvent(toastMsg);
            this.toastMessage = '';
            this.errorMessage = '';
        }
        return this.errorMessages.length;
    }

    // Loads the JSPDF lib from static resources
    renderedCallback() {
        Promise.all([loadScript(this, JSPDF)]);        
    }

    // Assembles the PDF, creates a header, body and footer according to the Opp the user is viewing
    generatePdf(){
        if(this.errorMessages.length === 0){
            const { jsPDF } = window.jspdf;

            var pageWidth = 8.5,
                pageUnit = 'in',
                lineHeight = 1.2,
                margin = 0.5,
                maxLineWidth = pageWidth - margin * 2,
                fontSize = 12,
                body = 'This is an example showing that data from Opp can be shown: ' + '\nOpportunity Amount: ' + this.opportunityData.amount + '\nOpportunity Owner: ' + this.opportunityData.ownerid + '\nOpportunity Owner Email: ' + this.opportunityData.owneremail,
                footNoteAddress = 'Pokemon Center',
                doc = new jsPDF({
                    unit: pageUnit,
                    lineHeight: lineHeight
                }).setProperties({title: 'Pokemon Letter'});
            
            var textBody = doc
            .setFont('arial')
            .setFontSize(fontSize)
            .splitTextToSize(body, maxLineWidth);

            var textFootNotes = doc
            .setFont('arial')
            .setFontSize(fontSize)
            .splitTextToSize(footNoteAddress, maxLineWidth);

            doc.addImage(this.headerLogo, 'PNG', 0.5, 0.5, 1.1, 1);

            doc.text(textBody, 0.5, 2);

            doc.text(textFootNotes, 0.5, 10);

            // Adjust the coordinates (X, Y) and size(X, Y) according to your needs
            doc.addImage(this.footerLogo, 'JPEG', 0, 8.5, pageWidth, 3);
            doc.save("PokemonLetter.pdf");
        }
    }

}