var boothWorkbookId = '1J8JL4Q70BPU8Hbhhe6cE5nk1LzDqkIlsTCumVDA4N5E';
var boothWorkbook = SpreadsheetApp.openById(boothWorkbookId);

function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('APU Elections')
      .addItem('Booth Mgmt', 'openDialog')
      .addToUi();
}

function openDialog() {
  var html = HtmlService.createTemplateFromFile('Index').evaluate();
  SpreadsheetApp.getUi() // Or DocumentApp or FormApp.
      .showModalDialog(html, 'APU Elections 2016');
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename)
      .getContent();
}

function setStatus(request) {
  var sheet = boothWorkbook.getSheetByName('booth-details');
  var data = sheet.getDataRange().getValues();
  var r = JSON.parse(request);
  sheet.getRange(3, 7, 1, 1).setValues([[r.data[0]]]);
  var voteStatus = sheet.getRange(3, 8, 1, 1).getValues();
  if(voteStatus == 'Voted Already') {
    return JSON.stringify({update: 'failed', message: 'You have voted Already.'});
  }
  var output;
  switch(r.booth) {
    case 'Booth One':
      output = sheet.getRange(2, 2, 1, 2).setValues([r.data]);
      break;
    case 'Booth Two':
      output = sheet.getRange(3, 2, 1, 2).setValues([r.data]);
      break;
    case 'Booth Three':
      output = sheet.getRange(4, 2, 1, 2).setValues([r.data]);
      break;
    case 'Booth Four':
      output = sheet.getRange(5, 2, 1, 2).setValues([r.data]);
      break;
    case 'Booth Five':
      output = sheet.getRange(6, 2, 1, 2).setValues([r.data]);
      break;
    case 'Booth Six':
      output = sheet.getRange(7, 2, 1, 2).setValues([r.data]);
      break;
  }
  if(output.getValues()) {
    return JSON.stringify({update: 'success'});
  } else {
    return JSON.stringify({update: 'failed'});
  }
}

function refreshStatus() {
  var sheet = boothWorkbook.getSheetByName('booth-details');
  var data = sheet.getDataRange().getValues();
  var response = {
    BoothOne: {
      email: data[1][1],
      status: data[1][2]
    },
    BoothTwo: {
      email: data[2][1],
      status: data[2][2]
    },
    BoothThree: {
      email: data[3][1],
      status: data[3][2]
    },
    BoothFour: {
      email: data[4][1],
      status: data[4][2]
    },
    BoothFive: {
      email: data[5][1],
      status: data[5][2]
    },
    BoothSix: {
      email: data[6][1],
      status: data[6][2]
    }
  };
  return JSON.stringify(response);  
}