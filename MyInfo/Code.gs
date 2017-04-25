var studentMasterWorkbookId = "";
var workbook = SpreadsheetApp.openById(studentMasterWorkbookId);
var masterSheet = workbook.getSheetByName('students');
var cvUploadFolderId = '';

function doGet(e) {
    var template = HtmlService.createTemplateFromFile('Index.html');
    template.action = ScriptApp.getService().getUrl();
    template.email = Session.getActiveUser().getEmail();
    return template.evaluate().setSandboxMode(HtmlService.SandboxMode.IFRAME);
}

function include(filename) {
    return HtmlService.createTemplateFromFile(filename).evaluate().getContent();
}

function fetchMyDetails() {
    var allStudents = masterSheet.getDataRange().getValues();
    var email = Session.getActiveUser().getEmail();
    for (var i = 0; i < allStudents.length; i++) {
        if (allStudents[i][6] == email) {
            return JSON.stringify({
                status: 'success',
                data: {
                    email: Session.getActiveUser().getEmail(),
                    admissionId: allStudents[i][0],
                    program: allStudents[i][1],
                    section: allStudents[i][2],
                    name: allStudents[i][5],
                    cvUploaded: allStudents[i][7]
                }
            });
            break;
        }
    }
    return JSON.stringify({ status: 'fail', data: '' });
}

var access_token = "";
var access_token_legacy = "";
var baseUrl = 'https://apuplacementsandroid.firebaseio.com/';
var baseUrlLegacy = 'https://placementsapu.firebaseio.com/';

function firebaseLog(node, request) {
    var urlQueue = baseUrl + node + '.json?auth=' + access_token;
    request.dateVal = new Date();
    request.author = Session.getActiveUser().getEmail();
    var strRequest = JSON.stringify(request);
    var options = {
        'method': 'post',
        'payload': JSON.stringify({ data: strRequest })
    };
    var response = UrlFetchApp.fetch(urlQueue, options);
}

function uploadCV(data, request, fileName) {
    var cvUploadFolder = DriveApp.getFolderById(cvUploadFolderId);
    var r = JSON.parse(request);

    var programFolder = createFolderIfNotExists(cvUploadFolder, r.program);
    var sectionFolder = createFolderIfNotExists(programFolder, 'section' + r.section);

    var email = Session.getActiveUser().getEmail();
    var fileWriteName = email.substr(0, email.length - 11) + '_CV';
    fileWriteName = fileWriteName + fileName.substr(fileName.lastIndexOf('.'))
    var contentType = data.substring(5, data.indexOf(';')),
        bytes = Utilities.base64Decode(data.substr(data.indexOf('base64,') + 7)),
        blob = Utilities.newBlob(bytes, contentType, fileWriteName);

    var doc = ifFileExistsOverwrite(sectionFolder, fileWriteName, blob);
    doc.setName(fileWriteName);

    var allStudents = masterSheet.getDataRange().getValues();
    var email = Session.getActiveUser().getEmail();
    for (var i = 0; i < allStudents.length; i++) {
        if (allStudents[i][6] == email) {
            masterSheet.getRange(i + 1, 8, 1, 1).setValues([['Yes']]);
            break;
        }
    }

    r.fileName = fileName;
    firebaseLog('my-cv', r);

    return doc.getName();
}

function ifFileExistsOverwrite(sectionFolder, fileName, fileBlob) {
    var allFilesByName = sectionFolder.getFilesByName(fileName);

    if (allFilesByName.hasNext()) {
        var thisFile = allFilesByName.next();
        thisFile.setTrashed(true);
        return sectionFolder.createFile(fileBlob);
    } else {
        return sectionFolder.createFile(fileBlob);
    }
}

function createFolderIfNotExists(parent, folderName) {
    var folderMap = getChildFolderObject(parent);
    if (!folderMap.hasOwnProperty(folderName)) {
        return parent.createFolder(folderName);
    } else {
        return DriveApp.getFolderById(folderMap[folderName]);
    }
}

function getChildFolderObject(parent) {

    var childFolders = parent.getFolders();
    var childFolderObject = {};

    while (childFolders.hasNext()) {

        var childFolder = childFolders.next();
        childFolderObject[childFolder.getName()] = childFolder.getId();

    }

    return childFolderObject;

}

function getChildFolders(parent) {

    var childFolders = parent.getFolders();
    var list = [];

    while (childFolders.hasNext()) {

        var childFolder = childFolders.next();
        list.push({ name: childFolder.getName(), id: childFolder.getId() });

        // For recursive action
        /* var files = childFolder.getFiles();    
        while (files.hasNext()) {      
          // Print list of files inside the folder
          Logger.log(files.next().getName());      
        }    
        getChildFolders(childFolder); */

    }

    return list;

}