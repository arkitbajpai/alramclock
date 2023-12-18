let displayElement = document.querySelector(".display");
const hourInputField = document.getElementById("hourInput");
const minuteInputField = document.getElementById("minuteInput");
const activeAlarmsContainer = document.querySelector(".activeAlarms");
const setAlarmButton = document.getElementById("set");
let alarmsList = [];

let startingHour = 0,
  startingMinute = 0,
  alarmCounter = 0;

// Append zeroes for single digit
const addZeroIfNeeded = (value) => (value < 10 ? "0" + value : value);

// Search for value in object
const findObject = (parameter, value) => {
  let alarmObject,
    objIndex,
    exists = false;
  alarmsList.forEach((alarm, index) => {
    if (alarm[parameter] == value) {
      exists = true;
      alarmObject = alarm;
      objIndex = index;
      return false;
    }
  });
  return [exists, alarmObject, objIndex];
};

// Display Time
function showTimer() {
  let currentDate = new Date();
  let [hours, minutes, seconds] = [
    addZeroIfNeeded(currentDate.getHours()),
    addZeroIfNeeded(currentDate.getMinutes()),
    addZeroIfNeeded(currentDate.getSeconds()),
  ];

  // Display time
  displayElement.innerHTML = `${hours}:${minutes}:${seconds}`;

  // Check for active alarms
  alarmsList.forEach((alarm, index) => {
    if (alarm.isActive) {
      if (`${alarm.alarmHour}:${alarm.alarmMinute}` === `${hours}:${minutes}`) {
        alert("The time is up alram is on!!");
        alarm.isActive=false;
      }
    }
  });
}

const validateInput = (inputValue) => {
  inputValue = parseInt(inputValue);
  if(inputValue>60)
  alert("The time is always below 60");
  if (inputValue < 10) {
    inputValue = addZeroIfNeeded(inputValue);
  }
  return inputValue;
};

hourInputField.addEventListener("input", () => {
  hourInputField.value = validateInput(hourInputField.value);
});

minuteInputField.addEventListener("input", () => {
  minuteInputField.value = validateInput(minuteInputField.value);
});

// Create alarm div
const createAlarmDiv = (alarmObj) => {
  const { id, alarmHour, alarmMinute } = alarmObj;

  let alarmDiv = document.createElement("div");
  alarmDiv.classList.add("alarm");
  alarmDiv.setAttribute("data-id", id);
  alarmDiv.innerHTML = `<span>${alarmHour}: ${alarmMinute}</span>`;

  let checkbox = document.createElement("input");
  checkbox.setAttribute("type", "checkbox");
  checkbox.addEventListener("click", (e) => {
    if (e.target.checked) {
      activateAlarm(e);
    } else {
      deactivateAlarm(e);
    }
  });
  alarmDiv.appendChild(checkbox);

  let deleteButton = document.createElement("button");
  deleteButton.innerHTML = `<i class="fa-solid fa-trash-can"></i>`;
  deleteButton.classList.add("deleteButton");
  deleteButton.addEventListener("click", (e) => removeAlarm(e));
  alarmDiv.appendChild(deleteButton);

  activeAlarmsContainer.appendChild(alarmDiv);
};

// Set Alarm
setAlarmButton.addEventListener("click", () => {
  alarmCounter += 1;

  let alarmObj = {};
  alarmObj.id = `${alarmCounter}_${hourInputField.value}_${minuteInputField.value}`;
  alarmObj.alarmHour = hourInputField.value;
  alarmObj.alarmMinute = minuteInputField.value;
  alarmObj.isActive = false;

  alarmsList.push(alarmObj);
  createAlarmDiv(alarmObj);
  hourInputField.value = addZeroIfNeeded(startingHour);
  minuteInputField.value = addZeroIfNeeded(startingMinute);
});

// Activate Alarm
const activateAlarm = (e) => {
  let searchId = e.target.parentElement.getAttribute("data-id");
  let [exists, obj, index] = findObject("id", searchId);
  if (exists) {
    alarmsList[index].isActive = true;
  }
};

// Deactivate Alarm
const deactivateAlarm = (e) => {
  let searchId = e.target.parentElement.getAttribute("data-id");
  let [exists, obj, index] = findObject("id", searchId);
  if (exists) {
    alarmsList[index].isActive = false;
    alarmAudio.pause();
  }
};

// Remove Alarm
const removeAlarm = (e) => {
  let searchId = e.target.parentElement.parentElement.getAttribute("data-id");
  let [exists, obj, index] = findObject("id", searchId);
  if (exists) {
    e.target.parentElement.parentElement.remove();
    alarmsList.splice(index, 1);
  }
};

window.onload = () => {
  setInterval(showTimer);
  startingHour = 0;
  startingMinute = 0;
  alarmCounter = 0;
  alarmsList = [];
  hourInputField.value = addZeroIfNeeded(startingHour);
  minuteInputField.value = addZeroIfNeeded(startingMinute);
};
