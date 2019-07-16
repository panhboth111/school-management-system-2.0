import React, { useMemo,useState } from "react";
import DisplayTimetableHeader from "../TimetablePicker/DisplayTimetableHeader";
import OdooServerStatusDialog from '../Alert/OdooServerStatusDialog'
import {
  Paper,
  Table,
  TableRow,
  Divider,
  Button,
  TableHead,
  TableBody,
  Box,
} from "@material-ui/core";
import InsertData from "./InsertData";
import {saveTimeTable} from '../../redux/ActionCreator/apiRequest'
import { connect } from 'react-redux'
import moment from 'moment'
import CustomTableCell from '../Table/CustomTableCell'
import tableStyle from '../Table/TableStyle'
import Fade from '@material-ui/core/Fade';
import DefaultAlert from '../../components/Alert/DefaultDialog'
import Report from '@material-ui/icons/Report'


const TimeTable = ({
  header,
  week,
  onDataInsert,
  sessions,
  facultyData,
  selectedFaculty,
  weekStr,
  dispatch,
  odooServerStatus,
  ...rest
}) => {

  const [warning, setWarning] = useState(false)
  const handleCloseWarning = () => setWarning(false)
  const sortedSession = useMemo(
    () =>
      sessions.sort((a, b) => {
        let timeA = [a.slice(0, 5), " ", a.slice(5, 7)].join("");
        let timeB = [b.slice(0, 5), " ", b.slice(5, 7)].join("");
        return (
          new Date(`07/16/1999 ${timeA}`) - new Date(`07/16/1999 ${timeB}`)
        );
      }),
    [sessions]
  );

  const handleSaveTimeTable = () => {
    if(selectedFaculty[weekStr] === undefined) return setWarning(true)
    let { course, batch, semester, group} = header
    let line1 = []
    let line2 = []
    let line3 = []
    let line4 = []
    let line5 = []
    let line6 = []
    let line7 = []
    let data = selectedFaculty[weekStr][course][batch][semester][group]
    for(let day in data){
      for(let entrie of Object.entries(data[day])){
        switch(day.split(' ')[0]){
          case 'Sun':
              line1.push({
                subject: entrie[1].split('~')[0].substring(0, entrie[1].split('~')[0].length -1),
                faculty: entrie[1].split('~')[1].substring(1, entrie[1].split('~')[1].length),
                session: entrie[0]
              })
            break
          case 'Mon':
              line2.push({
                subject: entrie[1].split('~')[0].substring(0, entrie[1].split('~')[0].length -1),
                faculty: entrie[1].split('~')[1].substring(1, entrie[1].split('~')[1].length),
                session: entrie[0]
              })
            break
          case 'Tue':
              line3.push({
                subject: entrie[1].split('~')[0].substring(0, entrie[1].split('~')[0].length -1),
                faculty: entrie[1].split('~')[1].substring(1, entrie[1].split('~')[1].length),
                session: entrie[0]
              })
            break
          case 'Wed':
              line4.push({
                subject: entrie[1].split('~')[0].substring(0, entrie[1].split('~')[0].length -1),
                faculty: entrie[1].split('~')[1].substring(1, entrie[1].split('~')[1].length),
                session: entrie[0]
              })
            break
          case 'Thu':
              line5.push({
                subject: entrie[1].split('~')[0].substring(0, entrie[1].split('~')[0].length -1),
                faculty: entrie[1].split('~')[1].substring(1, entrie[1].split('~')[1].length),
                session: entrie[0]
              })
            break
          case 'Fri':
              line6.push({
                subject: entrie[1].split('~')[0].substring(0, entrie[1].split('~')[0].length -1),
                faculty: entrie[1].split('~')[1].substring(1, entrie[1].split('~')[1].length),
                session: entrie[0]
              })
            break
          case 'Sat':
              line7.push({
                subject: entrie[1].split('~')[0].substring(0, entrie[1].split('~')[0].length -1),
                faculty: entrie[1].split('~')[1].substring(1, entrie[1].split('~')[1].length),
                session: entrie[0]
              })
            break
          default: break
        }
      }
    }
    let res = {
      course,
      batch,
      semester,
      group,
      week: weekStr,
      lines:{line1,line2,line3,line4,line5,line6,line7}
    }
    dispatch(saveTimeTable(res))
  }
  const classes = tableStyle();

  let columns = []
  if(header){
    let {subjectInfo} = rest
    let {course, semester, batch, group} = header
    if(subjectInfo[course][batch][semester][group]['week'].length !== 0){
      let weekIndex = subjectInfo[course][batch][semester][group]['week'].findIndex(e => e.name === weekStr)
      if(weekIndex === -1) weekIndex = 0
      columns = ["Session"];
      for (let i = 1; i < 7; i++) {
        columns.push(
          moment(subjectInfo[course][batch][semester][group]['week'][weekIndex].startDate, 'YYYY-MM-DD')
            .add(i, 'days')
            .utc()
            .format("ddd MM/DD")
      );
    }
    }
  }

  return (
    <>
      {facultyData.length === 0 ? null : (
        <>
          <DisplayTimetableHeader header={header} week={weekStr} />
          <Box
            className={classes.generateTimetable}
            boxShadow={3}
            zIndex="modal"
          >
            <Fade
                in={true}
                style={{ transformOrigin: '0 0 0' }}
                {...(true ? { timeout: 250 } : {})}
              >
            <div className={classes.container}>
              <Paper className={classes.root}>
                <Table className={classes.table}>
                  <TableHead>
                    <TableRow className={classes.row}>
                      {columns.map(cell => (
                        <CustomTableCell align="center" key={cell}>
                          {cell}
                        </CustomTableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {sortedSession.map(row => (
                      <TableRow className={classes.row} key={row}>
                        {columns.map((cell, i) => {
                          return cell === "Session" ? (
                            <CustomTableCell
                              align="center"
                              component="th"
                              scope="row"
                              key={i}
                            >
                              {row}
                            </CustomTableCell>
                          ) : (
                            <CustomTableCell text-align="center" key={i}>
                              <InsertData
                                onChange={onDataInsert}
                                row={row}
                                col={cell}
                                header={header}
                                facultyData={facultyData}
                                selectedFaculty={selectedFaculty}
                                weekStr={weekStr}
                              />
                            </CustomTableCell>
                          );
                        })}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Paper>
            </div>
            </Fade>
            <Divider style={{ marginLeft: 15, marginRight: 15 }} />
            <div className={classes.submitButton}>
              <Button
                size="medium"
                color="primary"
                onClick = {handleSaveTimeTable}
                style={{ marginLeft: 15, marginRight: 15 }}
                variant="contained">
                Save
              </Button>
            </div>
          </Box>
          <OdooServerStatusDialog odooServerStatus={odooServerStatus} />
        </>
      )}
      <DefaultAlert
          icon={<Report style={{width:150, height:150,marginLeft:60, marginRight:60, marginTop:30}} color='secondary'/>}
          onClick={handleCloseWarning}
          detail = "Insufficient Data"
          open={warning}/>
    </>
  );
};
export default connect(state => ({odooServerStatus : state.changePicker.odooServerStatus}))(TimeTable)
