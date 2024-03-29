import React from "react";
import GenerateReportHeadPicker from "./GenerateReportHeadPicker";
import GenerateReportTable from "./GenerateReportTable";
import AttendanceReportDailog from './AttendanceReportDialog'
import {connect} from 'react-redux'
import Typography from '@material-ui/core/Typography'
import LinearProgress from '@material-ui/core/LinearProgress'

function GenerateReport  (props)  {
    return <div data-test='div1'
            style={{
                marginLeft: 'auto',
                marginRight: 'auto',
                width: '100%',
                maxWidth: 1400,
               }}
          >
        <div style={{width:'300px', margin:'auto', marginBottom:10, marginTop:10}}><Typography variant='h4'><b>Generate Report</b></Typography></div>
        <GenerateReportHeadPicker {...props} />
        {props.requestPadding ? <LinearProgress /> : null}
        <GenerateReportTable {...props}/>
        <AttendanceReportDailog {...props}/>
    </div>
}
export default connect(state => ({
    endDate: state.changePicker.endDate,
    startDate: state.changePicker.startDate,
    printReportLoading: state.changePicker.printReportLoading,
    batch: state.changePicker.batch,
    group: state.changePicker.group,
    semester: state.changePicker.semester,
    course: state.changePicker.course,
    attendanceReportData: state.initData.attendanceReportData,
    studentData : state.initData.studentData,
    subjectInfo : state.initData.subjectInfo,
    requestPadding: state.initData.requestAttendanceLinePending
}))(GenerateReport)
