function doGet(e) {
  var template = HtmlService.createTemplateFromFile('Index.html');
  template.action = ScriptApp.getService().getUrl();
  template.email = Session.getActiveUser().getEmail();
  return template.evaluate().setSandboxMode(HtmlService.SandboxMode.IFRAME);
}

function include(filename) {
  return HtmlService.createTemplateFromFile(filename).evaluate().getContent();
}

var settingsWorkbook = SpreadsheetApp.openById("");
var settingsSheet = settingsWorkbook.getSheetByName('settings');
var settings = settingsSheet.getDataRange().getValues();
var studentMasterWorkbookId = settings[1][1];
var websiteMasterWorkbookId = settings[2][1];
var resumeUploadFolderId = settings[3][1];
var orgParentFolder = settings[4][1];