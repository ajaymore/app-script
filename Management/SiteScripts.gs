var workbook = SpreadsheetApp.openById(websiteMasterWorkbookId);

function addNewOnCampusOrg(request) {
  var pageMeta = JSON.parse(request);
  var site = SitesApp.getSiteByUrl("https://sites.google.com/a/apu.edu.in/placements/");
  var templates = site.getTemplates();
  var template;  
  for(var i in templates) {
    if(templates[i].getTitle() == 'New Oncampus Organization') {
      template = templates[i];
      break;
    }
  }
  
  // create page
  var newPage = site.createPageFromTemplate(pageMeta.title, pageMeta.title.split(' ').join('-').replace(/[^a-zA-Z0-9-]/g, ''), template);
  var orgPage = site.getChildByName(orgParentFolder);
  var newPageChange = site.getChildByName(newPage.getName());
  newPageChange.setParent(orgPage);
  
  // create folder
  var resumeFolder = DriveApp.getFolderById(resumeUploadFolderId);
  resumeFolder.createFolder(pageMeta.title);
  
  // update organizations sheet  
  var organizationSheet = workbook.getSheetByName('organizations');
  var orgLastRow = organizationSheet.getLastRow();
  organizationSheet.getRange(orgLastRow+1, 1, 1, 6).setValues([[orgLastRow, pageMeta.title, newPageChange.getUrl(), 
                                                                pageMeta.location, pageMeta.state, pageMeta.selectedDomainList]]);
  
  // update uploads sheet
  var uploadsSheet = workbook.getSheetByName('uploads');
  var uploadLastRow = uploadsSheet.getLastRow();
  uploadsSheet.getRange(uploadLastRow+1, 1, 1, 3).setValues([[uploadLastRow, pageMeta.title, pageMeta.title]]);
  
  // update coordination sheet
  var coordinationSheet = workbook.getSheetByName('coordination');
  var coordinationLastRow = coordinationSheet.getLastRow();
  coordinationSheet.getRange(coordinationLastRow+1, 1, 1, 2).setValues([[uploadLastRow, pageMeta.title]]);
  
  firebaseLog('new-org', pageMeta);
  
  return JSON.stringify({url: newPageChange.getUrl()});
}

function getDomainList() {
  var allDomains = workbook.getSheetByName('domains');
  return allDomains.getDataRange().getValues();
}