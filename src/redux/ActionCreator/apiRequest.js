import {
    REQUEST_STUDENTS_SUCCESS,
    REQUEST_FAILED,
    REQUEST_ATTENDANCE_LINE_SUCCESS,
    REQUEST_ATTENDANCE_LINE_PENDING,
    REQUEST_ATTENDANCE_LINE_FAILED,
    TOGGLE_DIALOG,
    REQUEST_SUBJECT_DATA,
    PRINT_ATTENDANCE_REPORT,
    SET_REPORT_B64,
    GET_SESSION_DATA,
    SET_USER_IDENTITY,
    SET_FACULTY_TIMETABLE
} from '../../constants/env'
import {odooRequest, odooPrintReport} from '../api'
// Helper functino

// group data based on batch name
const groupByBatch = (data) =>  {
    let res = {}
    data.forEach(e => {
        let batch = e.batch_id[1]
        if(batch in res){
            res[batch].push(e)
        }else {
            res[batch] = [e]
        }
    })
    return res
}

// Make request to odoo using xmlrpc or fetch request


// request student data
export const requestStudent= () => (dispatch) => {
    odooRequest('op.student', 'search_read', ['name', 'last_name', 'roll_number', 'batch_id'])
    .then(data => {
        dispatch({type: REQUEST_STUDENTS_SUCCESS, payload:groupByBatch(data)})
    })
    .catch(err => dispatch({type: REQUEST_FAILED, data:err}))
}
// request subejct data

// export const requestSubject= () => (dispatch) => {
//     odooRequest('op.subject', 'search_read', ['name','id', 'batch_id', 'semester_id', 'class_id', 'code'])
//     .then(data => {
//         dispatch({type: REQUEST_SUBJECT_SUCCESS, payload:groupByBatch(data)})
//     })
//     .catch(err => dispatch({type: REQUEST_FAILED, payload:err}))
// }

// request session data 
// export const requestSession = () => (dispatch) => {
//     odooRequest('op.period', 'search_read', ['name', 'sequence'])
//     .then(data => {
//         dispatch({type: REQUEST_SESSION_SUCCESS, payload:data})
//     })
//     .catch(err => dispatch({type: REQUEST_FAILED, payload:err}))
// }
// request facility data 
// export const requestFaculty = () => (dispatch) => {
//     odooRequest('op.faculty', 'search_read', ['name', 'id'])
//     .then(data => {
//         dispatch({type: REQUEST_FACULTY_SUCCESS, payload:data})
//     })
//     .catch(err => dispatch({type: REQUEST_FAILED, payload:err}))
// }
// request course 
// export const requestCourse = () => (dispatch) => {
//     odooRequest('op.course', 'search_read', ['name', 'id'])
//     .then(data => {
//         dispatch({type: REQUEST_COURSE_SUCCESS, payload:data})
//     })
//     .catch(err => dispatch({type: REQUEST_FAILED, payload:err}))
// }
// request semester 
// export const requestSemester = () => (dispatch) => {
//     odooRequest('op.semester', 'search_read', ['name', 'id', 'batch_id', 'class_id'])
//     .then(data => {
//         dispatch({type: REQUEST_SEMESTER_SUCCESS, payload:groupByBatch(data)})
//     })
//     .catch(err => dispatch({type: REQUEST_FAILED, payload:err}))
// }

// request group data
// export const requestGroup = () => (dispatch) => {
//     odooRequest('op.class', 'search_read', ['name', 'id'])
//     .then(data => {
//         dispatch({type: REQUEST_GROUP_SUCCESS, payload:data})
//     })
//     .catch(err => dispatch({type: REQUEST_FAILED, payload:err}))
// }

export const createAttendanceSheet= (data) => (dispatch) => {
    fetch('http://192.168.7.240:8008/create-attendance-sheet',{
        method: 'post',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({
            params : data
        })
       })
    .then(response => response.json())
    .then(data => dispatch({type: TOGGLE_DIALOG, payload: data}))
    .catch(err => dispatch({type: TOGGLE_DIALOG, payload: err}))
}

export const getAttendanceLine = () => (dispatch) => {
    dispatch({type: REQUEST_ATTENDANCE_LINE_PENDING})
    fetch('http://192.168.7.240:8008/get-attendance-line')
    .then(res => res.json())
    .then( data => dispatch({type: REQUEST_ATTENDANCE_LINE_SUCCESS, payload:data.data}))
    .catch(err => dispatch({type:REQUEST_ATTENDANCE_LINE_FAILED, payload:err}))
}

export const getSubjectData = () => (dispatch) => {
    fetch('http://192.168.7.240:8008/get-subject-data')
    .then(res => res.json())
    .then(data => dispatch({type:REQUEST_SUBJECT_DATA, payload:data}))
    .catch( err => console.log(err))
}

export const getSessionData = () => (dispatch) => {
    fetch('http://192.168.7.240:8008/get-session-data')
    .then(res => res.json())
    .then(data => dispatch({type:GET_SESSION_DATA, payload:data}))
    .catch( err => console.log(err))
}

export const printAttendanceReport = () => (dispatch) => {
    odooPrintReport('sms2.attendance_report_qweb', ['10/10/2019', '10/11/2019'])
    .then(value =>{
        const b64 = value.result
        dispatch({type:PRINT_ATTENDANCE_REPORT, payload:b64})
        dispatch({type:SET_REPORT_B64, payload:b64})
    })
    .catch(err => console.log(err))
}
export const saveTimeTable = (data) => (dispatch) => {
    fetch('http://192.168.7.240:8008/create-timetable',{
        method: 'post',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({
            params : data
        })
       })
    .then(response => response.json())
    .then(data => dispatch({type: TOGGLE_DIALOG, payload: data}))
    .catch(err => dispatch({type: TOGGLE_DIALOG, payload: err}))
}

export const requestUserIdentity = (data) => (dispatch) => {
    fetch('http://192.168.7.240:8008/get-user-identity',{
        method: 'post',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({
            params : data
        })
       })
    .then(response => response.json())
    .then(data => dispatch({type: SET_USER_IDENTITY, payload:JSON.parse(data.result)}))
    .catch(err => console.log(err));
}

export const requestFacultyTimeTable = (data) => (dispatch) => {
    console.log('data',data);
    fetch('http://192.168.7.240:8008/get-faculty-timetable',{
        method: 'post',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({
            params : data
        })
       })
    .then(response => response.json())
    .then(data => dispatch({type: SET_FACULTY_TIMETABLE, payload:JSON.parse(data.result)}))
    .catch(err => console.log(err));
}