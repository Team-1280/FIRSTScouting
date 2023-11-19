# Scouting P.A.S.S. Google Sheets

## Table of Contents

1. [Disclaimer](#disclaimer)
2. [Description](#description)
3. [Getting Started](#set-up)

## Disclaimer

This feature was implemented due to many requests.  This feature is not used currently by PWNAGE due to the "Low/No Bandwith" goal of our scouting system.
Support for this feature will be secondary to our main features and possibly delayed due to not having a working environment for testing and debugging.

[Back to top](#scouting-pass-google-sheets)

## Description

Scouting PASS now implements an inteface to a Google Sheets spreadsheet.

Data from the web page (form) will be packaged up and sent to your Google Sheets spreadsheet.
A new row will be inserted for every robot scouted for a match.  The fields in the form that match the headers in the spreadsheet will automatically
be populated.

There is an extensive set-up process described in following section.  Follow the instructions carefully as it can be tricky in spots.

[Back to top](#scouting-pass-google-sheets)

## Set Up

### Google Sheets Set up

1. Create spreadheet
    * Create a new Google Spreadsheet on your Google Drive.
    * The "Sheet" needs to be named "Sheet1"
    * The first column header should be labeled "Date"
    * Create headers for all of your data elements (avoid spaces; not tested with spaces)
2. Add script
    * While still in the spreadsheet click Extensions -> Apps Script
    * Update the project name from "Untitled project" to something meaningful to you
    * Clear out the code there (i.e. MyFunction...) and replace it with this:

    ```javascript
        const sheetName = 'Sheet1'
        const scriptProp = PropertiesService.getScriptProperties()

        function initialSetup () {
          const activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet()
          scriptProp.setProperty('key', activeSpreadsheet.getId())
        }

        function doPost (e) {
          const lock = LockService.getScriptLock()
          lock.tryLock(10000)

          try {
            const doc = SpreadsheetApp.openById(scriptProp.getProperty('key'))
            const sheet = doc.getSheetByName(sheetName)

            const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0]
            const nextRow = sheet.getLastRow() + 1

            const newRow = headers.map(function(header) {
              return header === 'Date' ? new Date() : e.parameter[header].join(",")
            })

            sheet.getRange(nextRow, 1, 1, newRow.length).setValues([newRow])

            return ContentService
              .createTextOutput(JSON.stringify({ 'result': 'success', 'row': nextRow }))
              .setMimeType(ContentService.MimeType.JSON)
          }
          catch (e) {
            return ContentService
              .createTextOutput(JSON.stringify({ 'result': 'error', 'error': e }))
              .setMimeType(ContentService.MimeType.JSON)
          }
          finally {
            lock.releaseLock()
          }
        }
      ```

   * Save the project (Ctrl-S or click the floppy icon)
3. Execute initialization
    * Next to the Debug menu item select "initialSetup" and click Run.
    * Google will pop up a warning screen.  Click "advanced" on the lower left side
    * You will need to select a Google Account to login as and grant permissions
4. Create Trigger
    * Click on the "alarm" icon on the left side.
    * Click "Add Trigger" in the lower right corner.
    * Set the trigger with these parameters:
        * Function to run:   doPost
        * Deployment: Head
        * Event Source:  From Spreadsheet
        * Event Type:  On Form Submit
    * Click Save  
5. Deploy
    * Click on Deploy at the Top
    * Click "New Deployment"
    * Click the "Select Type" icon and select "Web App"
    * Fill in a description (whatever you want)
    * Set "Execute as" to Me
    * Set "Who has access" to Anyone
    * Click Deploy
6. Copy URL
    * After deploying, on the next screen, copy the Web App URL and save it.  You'll need it later.

## Scouting P.A.S.S Set Up

1. Set up the URL
    * In resources/js/googleSheets.js, on line 2, replace `SCRIPT URL` with the URL you just copied from Google Sheets.  It needs to stay wrapped in single quotes.
2. Enable Google Sheets in Scouting PASS
    * In your configuraiton file (i.e. 2022/RR_GS_config.js) at the top level add:

        `"enable_google_sheets": "true",`
    * Best place to add this is just after line 2, like this:

    ```javascript
            var config_data = `
            {
              "enable_google_sheets": "true",
              "title": "Scouting PASS 2022",
              "page_title": "Rapid React",
              ...
    ```

3. Add gsCol tag in config file
    * In that same configuration file, you need to add a "gsCol" tag for each element in the configuration script.  The gsCol (AKA Google Sheets Column) will tell Google
  Sheets which column to put the data in.
    * For example, the first entry in our configuraiton is Scouter Initials, the new entry with the gsCol tag would look like this:

        ```json
            { "name": "Scouter Initials",
              "gsCol": "scouter",
              "code": "s",
              "type": "scouter",
              "size": 5,
              "maxSize": 5,
              "required": "true"
            },
        ```

    * The scouter initials will be put in the column with the header "scouter"
    * Add that gsCol tag to all your elements to map that element to a header in your Google Sheets spreadsheet
    * If you mispell it or omit it, it will not populate in your spreadsheet
  
See 2022/RR_GS_config.js as an example of a configuration file that uses Google Sheets.
  
[Back to top](#scouting-pass-google-sheets)