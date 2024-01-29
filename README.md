# CreatePDFs LWC Component

## Overview

This Lightning Web Component (LWC) generates a PDF document containing essential information from an Opportunity record, including:

- Opportunity Amount
- Opportunity Owner Name
- Opportunity Owner Email
- The PDF features a header logo, body text with the Opportunity data, and a footer logo.

## Key Features

- Data Fetching: Uses @wire adapter to retrieve Opportunity data efficiently.
- Error Handling: Validates required fields and displays informative toast messages if any fields are missing.
- PDF Generation: Leverages the JSPDF library to create a visually appealing PDF with header, body, and footer elements.
- Resource Loading: Dynamically loads the JSPDF library from Salesforce static resources.
- Customizability: Easily modify the PDF content and layout as needed.

## Usage
- Import the component into your Lightning page or app.
- Pass the Opportunity record ID to the component using the recordId attribute.
- Invoke the component's invoke method to trigger PDF generation.

## Additional Notes
- Requires the JSPDF library to be uploaded as a static resource named "jspdf".
- Includes a "pokemonFiles" static resource containing header and footer logos.
- Uses the ShowToastEvent to display user-friendly error messages.

## Resources
- Based on Coding with the Force by Matt: https://github.com/Coding-With-The-Force/Salesforce-Development-Tutorials/tree/main/lwc_pdf_generation and his YouTube video: https://youtu.be/RZ5-AArzZaY
- Also by his recommendation found this website that helps building the file structure: https://raw.githack.com/MrRio/jsPDF/master/index.html
