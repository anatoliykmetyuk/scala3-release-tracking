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
  progress_cell
    .setBackground("#ffd966") // light yellow 1
    .setValue("Building... ");

  const person = commitment_sheet.getRange("B1").getValue();
  const milestones = milestones_sheet.getRange("A2:A99").getValues().flat().filter(x => x != "");
  const projects = milestones_sheet.getRange("B2:B99").getValues().flat();
  const personCol = milestones_sheet.getRange(1, 5, 1, 99).getValues()[0].findIndex(p => p == person) + 5;
  const commitments = milestones_sheet.getRange(2, personCol, 98, 1).getValues().flat();
  const timeframes = milestones_sheet.getRange("C2:D99").getValues();

  const milestones_count = commitments.filter(x => x != "").length;
  style_commitments(milestones_count);

  for (i = 0; i < milestones.length; i++) {
    const milestone = milestones[i];
    const project = projects[i];
    const commitment = commitments[i];
    const timeframe = {
      start: timeframes[i][0],
      end: timeframes[i][1]
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

  commitment_sheet.getRange(milestone_row, 1, 1, 2).setValues([[milestone, project]]);

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
    .setVerticalAlignment("middle")
    .setBackground("#d9d2e9"); // light purple 3
}

// Check if two timeframes overlap
// See https://stackoverflow.com/a/3269471
function overlaps(tf1, tf2) {
  return tf1.start < tf2.end && tf2.start < tf1.end;
}

function date(str) { return new Date(Date.parse(str)); }

function style_commitments(milestones_count) {
  // Clear formatting
  commitment_sheet.getRange("A3:H99").clear();

  // Milestone & Project name background color: light green 3
  // See https://yagisanatode.com/2019/08/06/google-apps-script-hexadecimal-color-codes-for-google-docs-sheets-and-slides-standart-palette/
  commitment_sheet
    .getRange(3, 1, milestones_count, 2)
    .setWrap(true)
    .setWrapStrategy(SpreadsheetApp.WrapStrategy.WRAP)
    .setVerticalAlignment("middle")
    .setBackground("#d9ead3");

  // Borders
  commitment_sheet
    .getRange(3, 1, milestones_count, 8)
    .setBorder(true, true, true, true, true, true);

  // Time frames bg color: light yellow 3
  commitment_sheet
    .getRange(3, 3, milestones_count, 6)
    .setBackground("#fff2cc");
}
