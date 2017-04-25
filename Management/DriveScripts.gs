function getResumeList(folderName) {
  Logger.log(folderName);
  var resumeFolder = DriveApp.getFolderById(resumeUploadFolderId);
  var orgFolderIterator = resumeFolder.getFoldersByName(JSON.parse(folderName));
  var orgFolder;  
  while (orgFolderIterator.hasNext()) {    
    orgFolder = orgFolderIterator.next();
  }
  
  var files = orgFolder.getFiles();
  var applicants = [];
  while (files.hasNext()) {
    var file = files.next();
    var str = file.getName();
    applicants.push(str.substring(0, str.lastIndexOf('.')-7) + '@apu.edu.in');    
  }
  
  return JSON.stringify(applicants);
}