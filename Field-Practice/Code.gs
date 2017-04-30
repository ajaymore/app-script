var masterDataSheetId = "10crYHrlykOjN0X3q7-D88HEri09nfWFn1rCphb5xZzc";
var workbook = SpreadsheetApp.openById(masterDataSheetId);

function doGet(e) {
  var template = HtmlService.createTemplateFromFile('Index.html');
  template.action = ScriptApp.getService().getUrl();
  template.email = Session.getActiveUser().getEmail();
  return template.evaluate().setSandboxMode(HtmlService.SandboxMode.IFRAME);
}

function include(filename) {
  return HtmlService.createTemplateFromFile(filename).evaluate().getContent();
}

function getData() {
  var schoolSheet = workbook.getSheetByName('schools');
  var schoolData = schoolSheet.getDataRange().getValues()
  var mappedOp = schoolData.map(function(item, key){
    var coordinates = item[5] ? item[5].split(',') : null;
    return {
      schoolName: item[1],
      associatedSince: item[2],
      board: item[3],
      address: item[4],
      coordinates: coordinates ? {lat: parseFloat(coordinates[0]), lng: parseFloat(coordinates[1])} : null
    }
  });
  return mappedOp;
}