const TODAY = new Date();
const TD = [TODAY.getFullYear(), TODAY.getMonth(), TODAY.getDate()];
const DAYS = [ "sun", "mon", "tue", "wed", "thu", "fri", "sat" ];
const MONTHS = [
  ["Jan", 31],
  ["Feb", 28, 29],
  ["Mar", 31],
  ["Apr", 30],
  ["May", 31],
  ["Jun", 30],
  ["Jul", 31],
  ["Aug", 31],
  ["Sep", 30],
  ["Oct", 31],
  ["Nov", 30],
  ["Dec", 31]
];

/* because i am lazy */
const MT = {
  "Jan" : 0,
  "Feb" : 1,
  "Mar" : 2,
  "Apr" : 3,
  "May" : 4,
  "Jun" : 5,
  "Jul" : 6,
  "Aug" : 7,
  "Sep" : 8,
  "Oct" : 9,
  "Nov" : 10,
  "Dec" : 11
}
/* ah i have current, nevermind */

const divs = [
  /* 0 */   '<div>',
  /* 1 */   '</div>',
  /* 2 */   '<div class="cal-row">',
];

const cls = [
  /* 0 */   'cal-normal',
  /* 1 */   'cal-today',
  /* 2 */   'cal-other-month',
  /* 3 */   'cal-unusable',
  /* 4 */   'cal-selected'
];

var current;
var interval = [null, null];

/* always reset it at 1 */
var ct = 0;


//-----------------------------------------------------------------------//
document.addEventListener('DOMContentLoaded', buildHeader, false);
//-----------------------------------------------------------------------//

function prev(){
  init(new Date(current[0], current[1] - 1));
}

function next(){
  init(new Date(current[0], current[1] + 1));
}

function select(event){
    let d;
    let temp;

    let dID = event.target.id.toString().slice(1);

    if(dID < current[3]){
      temp = info(new Date(current[0], current[1] - 1));
    }
    else if(dID > (current[3] + current[2] - 1)){
      temp = info(new Date(current[0], current[1] + 1));
    }
    else{
      temp = info(new Date(current[0], current[1]));
    }

    d = [temp[0], temp[1], parseInt(event.target.textContent)];

    if(comp(d, TD) === 1){
      d = TD;
    }

    if(ct === 0){
      interval[0] = d;

      if(interval[1] !== null){
        interval[1] = null;
      }

      init(new Date(current[0], current[1]));
      document.getElementById("c" + dID).classList.toggle(cls[4]);
    }
    else{
      interval[1] = d;

      if(comp(interval[0], interval[1]) === 1){
        let temp2 = interval[0];
        interval[0] = interval[1];
        interval[1] = temp2;
      }

      ct = -1;
      init(new Date(current[0], current[1]));
    }

    ct++;
}

function init(date){
  let curr = info(date);
  let temp = info(new Date(curr[0], curr[1] - 1));

    current = curr;
    updateLabel(curr[0], curr[1]);

  let html = '';

  let y = temp[2] - (curr[3] - 1);

  /* start to keep track where this month start */
  let start = 0;
  /* counter to keep track of rows */
  let counter = 0;

  html += divs[2];

  /* building dates of previous month */
  for(let i = y; i <= temp[2]; i++){
    html += divs[0] + i + divs[1];
    start++;
    counter++;
  }

  /* end to keep track where this month ends */
  let end = counter + curr[2];

  /* building dates of current month */
  for(let i = 1; i <= curr[2]; i++){
    if(counter % 7 === 0){
      html += divs[1] + divs[2];
    }
    html += divs[0] + i + divs[1];
    counter++;
  }

  y = 1;

  /* building dates of next month */
  for(let i = end + 1; i < 42; i++){
    if(counter % 7 === 0){
      html += divs[1] + divs[2];
    }
    html += divs[0] + y + divs[1];
    counter++;
    y++;
  }

  html += divs[0] + y + divs[1] + divs[1];

  let dates = document.getElementById("calendar-dates");
  dates.innerHTML = html;

  addClasses(start, end, curr[0], curr[1]);
}

function addClasses(start, end, year, month){
  let query = "#calendar #calendar-dates .cal-row div";
  let node = document.querySelectorAll(query);

  let divId = 0;

  /* add classes for dates of prev month */
  for(let i = 0; i < start; i++){
    let x = parseInt(node[i].textContent);
    let temp = info(new Date(year, month - 1));
    let d = [temp[0], temp[1], x];

    if(comp(d, TD) === 1){
      node[i].classList.add(cls[3]);
    }
    else if(isIn(d)){
      node[i].classList.toggle(cls[4])
    }
    else
    {
      if(comp(d, TD) === 0){
        node[i].classList.add(cls[1])
      }
      else{
        node[i].classList.add(cls[2])
      }
    }

    node[i].id = "c" + divId;
    divId++;
  }

  for(let i = start; i < end; i++){
    let x = parseInt(node[i].textContent);
    let temp = info(new Date(year, month));
    let d = [temp[0], temp[1], x];

    if(comp(d, TD) === 1){
      node[i].classList.add(cls[3]);
    }
    else if(isIn(d)){
      node[i].classList.toggle(cls[4])
    }
    else
    {
      if(comp(d, TD) === 0){
        node[i].classList.add(cls[1])
      }
      else{
        node[i].classList.add(cls[0])
      }
    }

    node[i].id = "c" + divId;
    divId++;
  }

  for(let i = end; i < 42; i++){
    let x = parseInt(node[i].textContent);
    let temp = info(new Date(year, month + 1));
    let d = [temp[0], temp[1], x];

    if(comp(d, TD) === 1){
      node[i].classList.add(cls[3]);
    }
    else if(isIn(d)){
      node[i].classList.toggle(cls[4])
    }
    else
    {
      if(comp(d, TD) === 0){
        node[i].classList.add(cls[1])
      }
      else{
        node[i].classList.add(cls[2])
      }
    }

    node[i].id = "c" + divId;
    divId++;
  }

}

function updateLabel(y, m){
  let label = document.getElementById('cal-label');
  label.innerHTML = MONTHS[m][0] + "  " + y;
}

function buildHeader(){
  let calendar = document.getElementById("calendar");
  let html = '';

  html += '<div class="calendar-header">';
  html += '   <div class="cal-button" id="cal-prev"> &lang; </div>';
  html += '   <div id="cal-label"> Dec 1994 </div>';
  html += '   <div class="cal-button" id="cal-next"> &rang; </div>';
  html += '</div>';

  html += '<div class="calendar-days">';
    for(let i = 0; i < 7; i++){
      html += '<div>' + DAYS[i] + '</div>';
    }
  html += '</div>';

  html += '<div id="calendar-dates">';
  html += '</div>';

  calendar.innerHTML = html;

  init(TODAY);

  document.getElementById('cal-prev').addEventListener("click", prev);
  document.getElementById('cal-next').addEventListener("click", next);
  document.getElementById('calendar-dates').addEventListener("click", select);
}

function info(date){
  let year = date.getFullYear();
  let month = date.getMonth();
  let days = MONTHS[month][isLeap(year, month)];
  let first = new Date(year, month, 1).getDay();

  return [year, month, days, first];
}

function isLeap(year, month){
  if(month !== 1){
    return 1;
  }
  if(year % 4 === 0){
    if(year % 100 === 0){
      if(year % 400 === 0){
        return 2;
      } else {
        return 1;
      }
    } else {
      return 2;
    }
  } else {
    return 1;
  }
}

function comp(d1, d2){
  if(d1[0] === d2[0]){
    if(d1[1] === d2[1]){
      if(d1[2] < d2[2]){
        return -1;
      }
      else if(d1[2] > d2[2]){
        return 1;
      }
      else{
        return 0;
      }
    }
    else if(d1[1] < d2[1]){
      return -1;
    }
    else{
      return 1;
    }
  }
  else if(d1[0] < d2[0]){
    return -1;
  }
  else{
    return 1;
  }

  return 10;
}

function isIn(d){
  if(interval[0] === null || interval[1] === null){
    return false;
  }

  let a = (comp(d, interval[0]) === 1 || comp(d, interval[0]) === 0);
  let b = (comp(d, interval[1]) === -1 || comp(d, interval[1]) === 0);

  if(a && b){
    return true;
  }
  else{
    return false;
  }
}
