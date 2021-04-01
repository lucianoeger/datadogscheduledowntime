import tl = require('azure-pipelines-task-lib/task');
const axios = require('axios').default;
const moment = require('moment-timezone');

const DD_URL = "https://api.datadoghq.com/api/v1/downtime"
const API_KEY: string = tl.getInput('ddApiKey'); 
const APPLICATION_KEY: string = tl.getInput('ddApplicationKey');
const MONITOR_ID: string = tl.getInput('ddMonitorId');
const MONITOR_TAGS: string = tl.getInput('ddMonitorTags');
const GROUP_SCOPE: string = tl.getInput('ddGroupScope');
const OPTION_DATE: string = tl.getInput('ddOptionDate');
var MINUTES: string = tl.getInput('ddMinutes');
var START: string = tl.getInput('ddStart');
var END: string = tl.getInput('ddEnd');
const TIME_ZONE: string = tl.getInput('ddTimeZone');
const MESSAGE: string = tl.getInput('ddMessage');

async function run() {

    if(OPTION_DATE === "reportminutes")
        END = ((moment().tz(TIME_ZONE)  + parseInt(MINUTES)*60000) / 1000).toString();

    axios({
        method: 'post',
        url: DD_URL,
        headers: {
            'DD-API-KEY': API_KEY,
            'DD-APPLICATION-KEY': APPLICATION_KEY
        },
        data: {
            monitor_id: MONITOR_ID,
            monitor_tags: MONITOR_TAGS !== undefined ? MONITOR_TAGS.split(',') : null,
            scope: GROUP_SCOPE.split(','),
            start: START === "" ? null : parseInt(START),
            end: END === "" ? null : parseInt(END),
            timezone: TIME_ZONE,
            message: MESSAGE
        }
    })
    .then(function(response: any) {
        console.log(response.data);
        tl.setResult(tl.TaskResult.Succeeded,"", true);
    
    })
    .catch(function(error: any) {
        console.log(error.response.data);
        tl.setResult(tl.TaskResult.Failed,"",true);
    });
}

run();