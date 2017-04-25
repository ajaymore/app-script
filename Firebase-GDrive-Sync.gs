var cvUploadFolderId = "";

function firebaseGdriveSyncApp() {
  var urlQueue = 'https://placementsapu.firebaseio.com/gdrive-queue.json';
  var response = UrlFetchApp.fetch(urlQueue);
  var files = JSON.parse(response.getContentText());
  var cvUploadFolder = DriveApp.getFolderById(cvUploadFolderId);
  var allKeys = Object.keys(files);
  for(var i=0; i<allKeys.length; i++){
    var key = allKeys[i];
    var program = files[key].program;
    var section = files[key].section;
    var programFolder = createFolderIfNotExists(cvUploadFolder, program);
    var sectionFolder = createFolderIfNotExists(programFolder, section);
    var fileName = files[key].fileName;
    var downloadUrl = files[key].downloadURL;
    var firebaseResponse = UrlFetchApp.fetch(downloadUrl);
    var fileBlob = firebaseResponse.getBlob();  
    var doc = ifFileExistsOverwrite(sectionFolder, fileName, fileBlob);
    doc.setName(fileName);    
    var url = 'https://placementsapu.firebaseio.com/gdrive-queue/' + key +'.json';
    var deleteResponse = UrlFetchApp.fetch(url, {method: 'DELETE'});
  }
}

function ifFileExistsOverwrite(sectionFolder, fileName, fileBlob) {
  var allFilesByName = sectionFolder.getFilesByName(fileName);

  if(allFilesByName.hasNext()){
    var thisFile = allFilesByName.next();
    thisFile.setTrashed(true);
    return sectionFolder.createFile(fileBlob);
  } else {
    return sectionFolder.createFile(fileBlob);
  }
}

function createFolderIfNotExists(parent, folderName) {
  var folderMap = getChildFolderObject(parent);
  if(!folderMap.hasOwnProperty(folderName)){
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
    list.push({name: childFolder.getName(), id: childFolder.getId()});
    
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