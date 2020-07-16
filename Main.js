const milestones_sheet = SpreadsheetApp.getActive().getSheetByName("Milestones");
const commitment_sheet = SpreadsheetApp.getActive().getSheetByName("Commitment");
const timeframes = [
  {start: date("07/01/2020"), end: date("08/01/2020")},
  {start: date("08/01/2020"), end: date("09/01/2020")},
  {start: date("09/01/2020"), end: date("10/01/2020")},
  {start: date("10/01/2020"), end: date("11/01/2020")},
  {start: date("11/01/2020"), end: date("12/01/2020")},
  {start: date("12/01/2020"), end: date("01/01/2021")}
];
const progress_cell = commitment_sheet.getRange("C1");

function onEdit(e) {
  var name = e.source.getActiveSheet().getName();
  if (name == "Commitment") commitment_main();
}

function commitment_main() {
  commitment_sheet.getRange("A3:H99").clear();
  progress_cell
    .setBackground("#ffd966") // light yellow 1
    .setValue("Building... ");

  const person = commitment_sheet.getRange("B1").getValue();
  const milestones = milestones_sheet.getRange("A2:A99")
    .getValues().flat().filter(x => x != "");
  const projects = milestones_sheet.getRange("B2:B99")
    .getValues().flat().filter(x => x != "");
  const personCol = milestones_sheet.getRange(1, 5, 1, 99)
    .getValues()[0].findIndex(p => p == person) + 5;

  for (i = 0; i < milestones.length; i++) {
    const row = i + 2;
    const milestone = milestones[i];
    const project = projects[i];
    const commitment = milestones_sheet.getRange(row, personCol).getValue();
    const timeframe = {
      start: milestones_sheet.getRange(row, 3).getValue(),
      end: milestones_sheet.getRange(row, 4).getValue()
    };

    if (commitment != "") {
      insert_milestone(person, milestone, project, timeframe, commitment);
    }
  }

  progress_cell.clear();
}

var milestones_num = 0;
function insert_milestone(person, milestone, project,
    milestone_timeframe, commitment) {
  milestones_num += 1;
  const milestone_row = milestones_num + 2;
  style_milestone(milestone_row);

  commitment_sheet.getRange(milestone_row, 1).setValue(milestone);
  commitment_sheet.getRange(milestone_row, 2).setValue(project);

  var start = null;
  var end = null;
  for (j = 0; j < timeframes.length; j++) {
    if (overlaps(milestone_timeframe, timeframes[j])) {
      if (start == null) start = j;
      end = j;
    }
  }
  commitment_sheet.getRange(milestone_row, start + 3, 1, end - start + 1)
    .setValue(commitment)
    .mergeAcross()
    .setHorizontalAlignment("center")
    .setBackground("#d9d2e9"); // light purple 3
}

// Check if two timeframes overlap
// See https://stackoverflow.com/a/3269471
function overlaps(tf1, tf2) {
  return tf1.start < tf2.end && tf2.start < tf1.end;
}

function date(str) { return new Date(Date.parse(str)); }

function style_milestone(milestone_row) {
  // Milestone & Project name background color: light green 3
  // See https://yagisanatode.com/2019/08/06/google-apps-script-hexadecimal-color-codes-for-google-docs-sheets-and-slides-standart-palette/
  commitment_sheet.getRange(milestone_row, 1, 1, 2).setBackground("#d9ead3");

  // Borders
  commitment_sheet.getRange(milestone_row, 1, 1, 8)
    .setBorder(true, true, true, true, true, true);

  // Time frames bg color: light yellow 3
  commitment_sheet.getRange(milestone_row, 3, 1, 6)
    .setBackground("#fff2cc");
}
