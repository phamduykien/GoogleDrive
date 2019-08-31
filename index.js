const fs = require('fs');
const readline = require('readline');
const {
    google
} = require('googleapis');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/drive', 'https://www.googleapis.com/auth/drive.appfolder'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';
const args = process.argv;
var folderPath = '/opt/pdkien/hello-world';

// Load client secrets from a local file.
fs.readFile('credentials.json', (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    // Authorize a client with credentials, then call the Google Drive API.
    authorize(JSON.parse(content), storeFiles);
});

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
    const {
        client_secret,
        client_id,
        redirect_uris
    } = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris[0]);

    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, (err, token) => {
        if (err) return getAccessToken(oAuth2Client, callback);
        oAuth2Client.setCredentials(JSON.parse(token));
        callback(oAuth2Client);
    });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getAccessToken(oAuth2Client, callback) {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });
    console.log('Authorize this app by visiting this url:', authUrl);
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    rl.question('Enter the code from that page here: ', (code) => {
        rl.close();
        oAuth2Client.getToken(code, (err, token) => {
            if (err) return console.error('Error retrieving access token', err);
            oAuth2Client.setCredentials(token);
            // Store the token to disk for later program executions
            fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
                if (err) return console.error(err);
                console.log('Token stored to', TOKEN_PATH);
            });
            callback(oAuth2Client);
        });
    });
}

/**
 * Lists the names and IDs of up to 10 files.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function listFiles(auth) {
    const drive = google.drive({
        version: 'v3',
        auth
    });
    drive.files.list({
        pageSize: 10,
        fields: 'nextPageToken, files(id, name)',
    }, (err, res) => {
        if (err) return console.log('The API returned an error: ' + err);
        const files = res.data.files;
        if (files.length) {
            console.log('Files:');
            files.map((file) => {
                console.log(`${file.name} (${file.id})`);
            });
        } else {
            console.log('No files found.');
        }
    });
}

function listDrive(auth) {

    const drive = google.drive({
        version: 'v3',
        auth
    });
    drive.files.list({       
        "corpora": "drive",
        "driveId": "0AA1g4vGWGsYVUk9PVA",
        "includeItemsFromAllDrives": true,
        "includeTeamDriveItems": true,
        "pageSize": 15,
        "supportsAllDrives": true,
        "supportsTeamDrives": true
    }, (err, res) => {
        if (err) return console.log('The API returned an error: ' + err);
        const files = res.data.files;
        if (files.length) {
            console.log('Files:');
            files.map((file) => {
                console.log(`${file.name} (${file.id})`);
            });
        } else {
            console.log('No files found.');
        }
    });
}

//upload file to store in google drive team
//Created By PDKIEN 27/08/2019
function storeFiles(auth) {
    const drive = google.drive({
        version: 'v3',
        auth
    });
    //List file on local
    fs.readdir(folderPath, {
        withFileTypes: true
    }, (err, res) => {
        if (err) {
            console.log(err);
        } else {
            res.forEach((e) => {
                upload(e, drive);
            });
        }

    });


    // console.log("auth", JSON.stringify(auth));
    // const drive = google.drive({
    //     version: 'v3',
    //     auth
    // });
    // var fileMetadata = {
    //     'name': 'dotnetfx35.exe'
    // };
    // var media = {
    //     mimeType: 'application/vnd.microsoft.portable-executable',
    //     //PATH OF THE FILE FROM YOUR COMPUTER
    //     body: fs.createReadStream('D:\\Install\\dotNetFx\\dotnetfx35.exe')
    // };
    // drive.files.create({
    //     resource: fileMetadata,
    //     media: media,
    //     fields: 'id'
    // }, function (err, file) {
    //     if (err) {
    //         // Handle error
    //         console.error(err);
    //     } else {
    //         console.log('File Id: ', file.data.id);
    //     }
    // });
}

function upload(item, drive) {
    if (item.isDirectory()) {
        //Check exist Directory on Drive, if not 
        let s="mimeType='application/vnd.google-apps.folder' and name='"+item.name+"'";
        let s="mimeType='application/vnd.google-apps.folder' and name='"+"Session 1"+"'";
        drive.files.list({
            "corpora": "drive",
            "driveId": "0AA1g4vGWGsYVUk9PVA",
            "includeItemsFromAllDrives": true,
            "includeTeamDriveItems": true,
            "pageSize": 15,
            "supportsAllDrives": true,
            "supportsTeamDrives": true,
            "q":s
        },function (err, res) {
            if (!err){
                let map=res;
            }
        });
    } else {

    }
}