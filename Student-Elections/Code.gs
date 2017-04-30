var voteBookId = "";
var catalogueBookId = "";
var boothMgmtBooKId = "";
var voteBook = SpreadsheetApp.openById(voteBookId);
var catalogueBook = SpreadsheetApp.openById(catalogueBookId);
var boothMgmtBooK = SpreadsheetApp.openById(boothMgmtBooKId);

var boothMap = {
  'Booth One': 1,
  'Booth Two': 2,
  'Booth Three': 3,
  'Booth Four': 4,
  'Booth Five': 5,
  'Booth Six': 6
};

var workbookMappings = {
  "14" : "students14",
  "15" : "students15",
  "16" : "students16",
  "17" : "students17",
  "18" : "students18",
  "studentEmailIndex" : 0,
  "studentProgramIndex" : 1,
  "studentNameIndex" : 2,
  "studentYearIndex" : 5,
  "isHosteliteIndex" : 3,
  "hostelNameIndex" : 4,
  "candidatureTypeIndex" : 2,
  "candidateNameIndex" : 0,
  "candidateHostelIndex": 4,
  "candidateIdIndex": 1,
  "candidateYearIndex": 5
}

var votingEnabled = true;

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename)
      .getContent();
}

function doGet(e) {
  var template;
  if(votingEnabled) {
    template = HtmlService.createTemplateFromFile('Index.html');
  } else {
    template = HtmlService.createTemplateFromFile('Message.html');
  }
  template.action = ScriptApp.getService().getUrl();
  template.email = Session.getActiveUser().getEmail();
  return template.evaluate().setSandboxMode(HtmlService.SandboxMode.IFRAME);
}

function getAllCandidates() {
  var sheet = catalogueBook.getSheetByName('Candidates');
  return sheet.getDataRange().getValues();
}

function getAllStudentsInYear(sheetName) {
  var sheet = catalogueBook.getSheetByName(sheetName);
  return sheet.getDataRange().getValues();
}

function getStudentYear(email) {
  return email.match(/\d+/g)[0];
}

function getStudentYearString(email) {
  var year = email.match(/\d+/g)[0];
  if(year == 15) {
    return '2nd'
  } else if(year == 16) {
    return '1st'
  }
}

function getElectionMap(allCandidates) {
  var electionMap = {
    sc: {
      isOpen: allCandidates[1][8] == 'Y',
      candidatesToChoose: allCandidates[1][9]
    },
    ssc: {
      isOpen: allCandidates[2][8] == 'Y',
      candidatesToChoose: allCandidates[2][9]
    },
    placements: {
      isOpen: allCandidates[3][8] == 'Y',
      candidatesToChoose: allCandidates[3][9]
    },
    polmad: {
      isOpen: allCandidates[4][8] == 'Y',
      candidatesToChoose: allCandidates[4][9]
    },
    polllm: {
      isOpen: allCandidates[5][8] == 'Y',
      candidatesToChoose: allCandidates[5][9]
    },
    polmae: {
      isOpen: allCandidates[6][8] == 'Y',
      candidatesToChoose: allCandidates[6][9]
    },
    polmpg: {
      isOpen: allCandidates[7][8] == 'Y',
      candidatesToChoose: allCandidates[7][9]
    },
    srcsai1: {
      isOpen: allCandidates[8][8] == 'Y',
      candidatesToChoose: allCandidates[8][9]
    },
    srcsai2: {
      isOpen: allCandidates[9][8] == 'Y',
      candidatesToChoose: allCandidates[9][9]
    },
    srcmetro1: {
      isOpen: allCandidates[10][8] == 'Y',
      candidatesToChoose: allCandidates[10][9]
    },
    srcmetro2: {
      isOpen: allCandidates[11][8] == 'Y',
      candidatesToChoose: allCandidates[11][9]
    }
  };
  return electionMap;
}

function getCandidateMap() {
  var allCandidates = getAllCandidates();
  var electionMap = getElectionMap(allCandidates);
  var candidateHash = {
    SC: [],
    Placements: [],
    SSC: [],
    SRCSaiOne: [],
    SRCSaiTwo: [],
    SRCMetroOne: [],
    SRCMetroTwo: [],
    MAD: [],
    LLM: [],
    MAE: [],
    MPG: []
  };
  for(var i=1; i<allCandidates.length; i++) {
    var candidatureType = allCandidates[i][workbookMappings.candidatureTypeIndex];
    var candidateName = allCandidates[i][workbookMappings.candidateNameIndex];
    var hostel = allCandidates[i][workbookMappings.candidateHostelIndex];
    var program = allCandidates[i][workbookMappings.candidateIdIndex].replace(/\d+/g, '');
    var year = allCandidates[i][workbookMappings.candidateYearIndex];
    switch(candidatureType) {
      case 'SC' :
        candidateHash.SC.push(candidateName);
        break;
      case 'Placements':
        candidateHash.Placements.push(candidateName);
        break;
      case 'SSC':
        candidateHash.SSC.push(candidateName);        
        break;
      case 'SRC':
        if(hostel == 'Sai PG') {
          if(year === '1st') {
            candidateHash.SRCSaiOne.push(candidateName);
          } else if(year === '2nd') {
            candidateHash.SRCSaiTwo.push(candidateName);
          }
        } else if(hostel == 'Metropolis') {
          if(year === '1st') {
            candidateHash.SRCMetroOne.push(candidateName);
          } else if(year === '2nd') {
            candidateHash.SRCMetroTwo.push(candidateName);
          }
        }
        break;
      case 'POLC':
        if(program == 'MAD') {
          candidateHash.MAD.push(candidateName);
        } else if(program == 'LLM') {
          candidateHash.LLM.push(candidateName);
        } else if(program == 'MAE') {
          candidateHash.MAE.push(candidateName);
        } else if(program == 'MPG') {
          candidateHash.MPG.push(candidateName);
        }
        break;
      default:
        break;
    }
  }
  if(electionMap.sc.candidatesToChoose === 1) {
    candidateHash.SC.push('NOTA');
  } else if(electionMap.sc.candidatesToChoose === 2){
    candidateHash.SC.push('NOTA 1');
    candidateHash.SC.push('NOTA 2')
  }
  if(electionMap.placements.candidatesToChoose === 1) {
    candidateHash.Placements.push('NOTA');
  } else if(electionMap.placements.candidatesToChoose === 2){
    candidateHash.Placements.push('NOTA 1');
    candidateHash.Placements.push('NOTA 2');
  }
  if(electionMap.ssc.candidatesToChoose === 1) {
    candidateHash.SSC.push('NOTA');
  } else if(electionMap.ssc.candidatesToChoose === 2){
    candidateHash.SSC.push('NOTA 1');
    candidateHash.SSC.push('NOTA 2');
  }
  candidateHash.SRCSaiOne.push('NOTA');
  candidateHash.SRCSaiTwo.push('NOTA');
  candidateHash.SRCMetroOne.push('NOTA');
  candidateHash.SRCMetroTwo.push('NOTA');
  candidateHash.MAD.push('NOTA');
  candidateHash.LLM.push('NOTA');
  candidateHash.MAE.push('NOTA');
  candidateHash.MPG.push('NOTA');
  return {
    candidateHash: candidateHash,
    electionMap: electionMap
  };
}

function getVoterEmail(boothName) {
  var boothNum = boothMap[boothName];
  var sheet = boothMgmtBooK.getSheetByName('booth-details');
  var data = sheet.getDataRange().getValues();
  return data[boothNum][1];
}

function validateBooth(request){
  Logger.log(request);
  var r = JSON.parse(request);
  var boothNum = boothMap[r.name];
  var sheet = boothMgmtBooK.getSheetByName('booth-details');
  var data = sheet.getDataRange().getValues();
  return JSON.stringify({validBooth: data[boothNum][3] == r.key});
}

function checkIfFormReady(request) {
  Logger.log(request);
  var r = JSON.parse(request);
  var boothNum = boothMap[r.name];
  var sheet = boothMgmtBooK.getSheetByName('booth-details');
  var data = sheet.getDataRange().getValues();
  var boothRow = data[boothNum];
  var output = {formReady: false, wrongBooth: false};
  if(boothRow[3] !== r.key) {
    output.wrongBooth = true;
  }else if(boothRow[2] == 'Occupied') {
    output.formReady = true;
  }
  return JSON.stringify(output);
}

// boothDetails
function getStudentDetails(request) {
  Logger.log(request);
  var boothDetails = JSON.parse(request);
  var userEmail = getVoterEmail(boothDetails.name);
  var year = getStudentYear(userEmail);
  var allStudentsInYear = getAllStudentsInYear(workbookMappings["" + year]);
  var student = {
    "name" : '',
    "program" : '',
    "isHostelite" : false,
    "hostel" : '',
    "candidates" : {
    },
    "email": userEmail,
    "year": ''
  }
  for(var i=0; i<allStudentsInYear.length; i++) {
    if(allStudentsInYear[i][workbookMappings.studentEmailIndex] == userEmail) {
      var studentInfo = allStudentsInYear[i];
      student.name = studentInfo[workbookMappings.studentNameIndex];
      student.program = studentInfo[workbookMappings.studentProgramIndex];
      student.isHostelite = studentInfo[workbookMappings.isHosteliteIndex] === 'Y' ? true : false;
      student.hostel = studentInfo[workbookMappings.hostelNameIndex];
      student.year = studentInfo[workbookMappings.studentYearIndex];;
      var candidateMap = getCandidateMap().candidateHash;
      var electionMap = getCandidateMap().electionMap;
      var electionSettings = {};
      electionSettings.sc = electionMap.sc;
      electionSettings.ssc = electionMap.ssc;
      electionSettings.placements = electionMap.placements;
      student.candidates.SSC = candidateMap.SSC;
      student.candidates.SC = candidateMap.SC;
      student.candidates.Placements = candidateMap.Placements;  
      if(student.program == 'MAD') {
        student.candidates.program = candidateMap.MAD;
        electionSettings.program = electionMap.polmad;
      } else if(student.program == 'LLM') {
        student.candidates.program = candidateMap.LLM;
        electionSettings.program = electionMap.polllm;
      } else if(student.program == 'MAE') {
        student.candidates.program = candidateMap.MAE;
        electionSettings.program = electionMap.polmae;
      } else if(student.program == 'MPG') {
        student.candidates.program = candidateMap.MPG;
        electionSettings.program = electionMap.polmpg;
      }
      if(student.isHostelite && student.hostel === 'Sai PG') {
        if(student.year == '1st') {
          student.candidates.residence = candidateMap.SRCSaiOne;
          electionSettings.residence = electionMap.srcsai1;
        }else if(student.year == '2nd') {
          student.candidates.residence = candidateMap.SRCSaiTwo;
          electionSettings.residence = electionMap.srcsai2;
        }        
      } else if(student.isHostelite && student.hostel === 'Metropolis') {
        if(student.year == '1st') {
          student.candidates.residence = candidateMap.SRCMetroOne;
          electionSettings.residence = electionMap.srcmetro1;
        }else if(student.year == '2nd') {
          student.candidates.residence = candidateMap.SRCMetroTwo;
          electionSettings.residence = electionMap.srcmetro2;
        }
      } else {
          electionSettings.residence = {"isOpen":false,"candidatesToChoose":0};
      }
      break;
    }
  }
  return JSON.stringify({student: student, electionSettings: electionSettings});
}

function updateMyChoices(request) {
  Logger.log(request);
  var r = JSON.parse(request);
  var boothDetails = JSON.parse(r.boothDetails);
  var clientChoices = r.clientChoice;
  var userEmail = getVoterEmail(boothDetails.name);
  var year = getStudentYear(userEmail);
  var allStudentsInYear = getAllStudentsInYear(workbookMappings["" + year]);
  for(var i=0; i<allStudentsInYear.length; i++) {
    if(allStudentsInYear[i][workbookMappings.studentEmailIndex] == userEmail) {

      var studentInfo = allStudentsInYear[i];
      var name = studentInfo[workbookMappings.studentNameIndex];
      var program = studentInfo[workbookMappings.studentProgramIndex];
      var isHostelite = studentInfo[workbookMappings.isHosteliteIndex] === 'Y' ? true : false;
      var hostel = studentInfo[workbookMappings.hostelNameIndex];
      
      var sheet, lastRow;
      //voted entry
      var genGuid = Utilities.getUuid();
      
      var allEntries = [];
      //placements
      var placementsEntries = clientChoices.placements;
      for (var i = 0; i < placementsEntries.length; i++) {
        allEntries.push([placementsEntries[i], 'placements', genGuid]);
      }
      
      //club entries
      var clubEntries = clientChoices.sc;
      for (var i = 0; i < clubEntries.length; i++) {
        allEntries.push([clubEntries[i], 'clubs', genGuid]);
      }
      
      //ssc entries
      var sscEntries = clientChoices.ssc;
      for (var i = 0; i < sscEntries.length; i++) {
        allEntries.push([sscEntries[i], 'ssc', genGuid]);
      }
      
      //program entries
      var programEntry = [];
      if (program === 'MAD') {
        programEntry = [clientChoices.program[0], 'MAD', genGuid];
      } else if (program == 'LLM') {
        programEntry = [clientChoices.program[0], 'LLM', genGuid];
      } else if (program == 'MAE') {
        programEntry = [clientChoices.program[0], 'MAE', genGuid];
      } else if (program == 'MPG') {
        programEntry = [clientChoices.program[0], 'MPG', genGuid];
      }
      if(clientChoices.program.length > 0) {
        allEntries.push(programEntry);
      }
      
      
      //hostel entries
      var hostelEntry = [];
      if (isHostelite && hostel === 'Sai PG') {
        if (year == 15) {
          hostelEntry = [clientChoices.residence[0], 'Sai PG-15', genGuid];
        } else if (year == 16) {
          hostelEntry = [clientChoices.residence[0], 'Sai PG-16', genGuid];
        }
      } else if (isHostelite && hostel === 'Metropolis') {
        if (year == 15) {
          hostelEntry = [clientChoices.residence[0], 'Metropolis-15', genGuid];
        } else if (year == 16) {
          hostelEntry = [clientChoices.residence[0], 'Metropolis-16', genGuid];
        }
      }
      if(hostelEntry.length > 0 && clientChoices.residence.length > 0) {
        allEntries.push(hostelEntry);
      }

      sheet = voteBook.getSheetByName(boothDetails.name);
      lastRow = sheet.getLastRow();
      sheet.getRange(lastRow + 1, 1, allEntries.length, 3).setValues(allEntries);
      
      var votedEntry = [userEmail, new Date()];
      sheet = boothMgmtBooK.getSheetByName('vote-entries');  
      lastRow = sheet.getLastRow();
      sheet.getRange(lastRow+1, 1, 1, 2).setValues([votedEntry]);
      var boothNum = parseInt(boothMap[boothDetails.name]);
      sheet = boothMgmtBooK.getSheetByName('booth-details');
      sheet.getRange(boothNum+1, 3, 1, 1).setValues([['Voted']]);
      
// send Email and response
//      var emailRows = '';
//      for(var i=0; i<allEntries.length; i++) {
//        emailRows = emailRows + '<tr>' + 
//          '<td>' + allEntries[i][0] + '</td>' + 
//            '<td>' + allEntries[i][1] + '</td>' + 
//              '<td>' + allEntries[i][2] + '</td>' + 
//          '</tr>'
//      }
//      MailApp.sendEmail({
//        to: 'ajay.more15@apu.edu.in',
//        subject: "Thank you for voting to APU Elections 2016",
//        htmlBody: "<p>Your Choices as below:</p>" + 
//        "<table><tbody><tr><th>Candidate</th><th>Constituency</th><th>ID</th></tr>" + 
//        emailRows + 
//        "</tbody></table>"
//      });
      break;
    }
  }  
  return JSON.stringify({votedAlready: true});
}