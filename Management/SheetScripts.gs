function getAllOrganizations() {
  var uploadsSheet = SpreadsheetApp.openById(websiteMasterWorkbookId).getSheetByName('organizations');
  return JSON.stringify(uploadsSheet.getDataRange().getValues());
}

var uploadsSheet = SpreadsheetApp.openById(websiteMasterWorkbookId).getSheetByName('uploads');

function getUploadEntries() {
  return JSON.stringify(uploadsSheet.getDataRange().getValues());
}

function updateEntry(request) {
  var r = JSON.parse(request);
  uploadsSheet.getRange(r.id+1, 4, 1, 2).setValues([[r.deadlineDate, r.deadlineTime]]);
  firebaseLog('communication-update', r);
  return uploadsSheet.getDataRange().getValues();
}

function addEntry(request) {
  var r = JSON.parse(request);
  // create folder
  var resumeFolder = DriveApp.getFolderById(resumeUploadFolderId);
  resumeFolder.createFolder(r.folderName);
  // update sheet
  var uploadLastRow = uploadsSheet.getLastRow();
  uploadsSheet.getRange(uploadLastRow+1, 1, 1, 5).setValues([[uploadLastRow, r.folderName, r.visibleUploadName,
                                                              r.deadlineDate, r.deadlineTime]]);
  
  firebaseLog('communication-new', r);
  return uploadsSheet.getDataRange().getValues();
}

var volunteerSheet = SpreadsheetApp.openById(websiteMasterWorkbookId).getSheetByName('volunteers');
function getAllVolunteers() {
  return JSON.stringify(volunteerSheet.getDataRange().getValues());
}

function addVolunteer(request) {
  var r = JSON.parse(request);
  Logger.log(r);
  if(r.type == 'comm') {
    volunteerSheet.getRange(r.last+2, 3, 1, 1).setValues([[r.email]]);
  } else if(r.type == 'tech') {
    volunteerSheet.getRange(r.last+2, 2, 1, 1).setValues([[r.email]]);
  }
  return JSON.stringify("Success");
}

function getMyRoles(email){
  var volunteerData = volunteerSheet.getDataRange().getValues();
  var roles = {admin: false, techie: false, commie: false};
  var admins = [];
    var techies = [];
    var commies = [];
    var volunteerMap = volunteerData.map(function(item) {
      if (item[0]) {
        admins.push(item[0]);
      }
      if (item[1]) {
        techies.push(item[1]);
      }
      if (item[2]) {
        commies.push(item[2]);
      }
    });
  
  if(admins.indexOf(email) !== -1) {
  roles.admin = true;
  }
  if(techies.indexOf(email) !== -1) {
  roles.techie = true;
  }
  if(commies.indexOf(email) !== -1) {
  roles.commie = true;
  }
  
  return roles;
}

// scripts for coordination
var config = [{
  type: 'text',
  key: 'org_contact',
  placeholder: 'Names, contact details, expected persons...',
  index: 3
}, {
  type: 'input',
  key: 'campus_placement_date',
  placeholder: 'Enter placement Date DD-MM-YYYY format',
  index: 4
}, {
  type: 'text',
  key: 'pickup_details',
  placeholder: 'How many persons, mode of travel etc...',
  index: 5
}, {
  type: 'text',
  key: 'accomodation_details',
  placeholder: 'Accomodation details...',
  index: 6
}, {
  type: 'text',
  key: 'assigned_volunteers',
  placeholder: 'List of volunteers assigned...',
  index: 7
}, {
  type: 'text',
  key: 'venue_details',
  placeholder: 'Venues assigned for interviews, GDs etc...',
  index: 8
}, {
  type: 'text',
  key: 'comments',
  placeholder: 'Comments, Observations, Reminders...',
  index: 9
}, {
  type: 'text',
  key: 'placement_details',
  placeholder: 'Number of students placed, Roles offered etc...',
  index: 10
}];


var coordinationSheet = SpreadsheetApp.openById(websiteMasterWorkbookId).getSheetByName('coordination');
function getOrgCoordinationDetails(request) {
  var r = JSON.parse(request);
  var selectRow = [];
  var allData = coordinationSheet.getDataRange().getValues();
  for(var i=0; i<allData.length; i++){
    if(allData[i][1] === r) {
      selectRow = allData[i];
      break;
    }
  }
  return JSON.stringify({config: config, data: selectRow});
}

function saveOrgCoordinationDetails(request) {
  var r = JSON.parse(request);
  coordinationSheet.getRange(r.updateIndex+1, 3, 1, 8).setValues([r.array]);
  return JSON.stringify({config: config, data: coordinationSheet.getRange(r.updateIndex+1, 1, 1, 10).getValues()[0]});
}