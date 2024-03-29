import React, {useState} from 'react'
import {Paper,
    Table,
    TableBody,
    TableHead,
    TableRow,
} from "@material-ui/core";
import CustomTableCell from '../../Table/CustomTableCell'
import tableStyle from '../../Table/TableStyle'
import moment from 'moment'
import AutoComplete from '../../Picker/AutoComplete'
import OdooServerStatusDialog from '../../Alert/OdooServerStatusDialog'
import {connect} from 'react-redux'



export default connect(state=>({odooServerStatus : state.changePicker.odooServerStatus}))(({currentWeek, editTT, editMode, dispatch, odooServerStatus, ...rest}) => {

    const {subjectInfo, course, batch, semester, group} = rest

    const [data, setData] = useState({})

    const header = ['Session']
    if(currentWeek.startDate){
        for (let i = 1; i < 7; i++) {
            header.push(
              moment(currentWeek.startDate, 'YYYY-MM-DD')
                .add(i, 'days')
                .utc()
                .format("ddd MM/DD"))
        }
    }

    const sortSession = (a, b) => moment(a.split('-')[0], 'h:mma') - moment(b.split('-')[0], 'h:mma')

    const getHandler = (session,i) =>  (value) => {
        if(session in editTT.data){
            editTT.data[session][i] = value
        }else{
            let temp = {}
            temp[i] =value
            editTT.data[session] = temp
        }
        setData({...editTT})
    }
    let columns = []
    for(let i =1 ; i <header.length; i++)
    {
        columns.push(i)
    }
    let sessions = subjectInfo[course][batch][semester][group]['session']
    let faculties = [];
    try {
        for (let e of subjectInfo[course][batch][semester][group]['subjects']) {
            if (e.faculty) {
            faculties.push(`${e.subject} ~ ${e.faculty}`);
            }
        }
    } catch {}
    const classes = tableStyle()

    return (
        <>
                <Paper className={classes.subRoot}>
                    <Table className={classes.table}>
                        <TableHead>
                                <TableRow className={classes.row}>
                                    {
                                        header.map(item => (
                                            <CustomTableCell align='center' multiline={"true"} key={item}>
                                                {item}
                                            </CustomTableCell>
                                        ))
                                    }
                                </TableRow>
                        </TableHead>
                        <TableBody>
                            {editTT.data !== undefined ?
                                sessions.sort(sortSession).map(session => {
                                    return <TableRow className={classes.row} key={session}>
                                        <CustomTableCell align="center">
                                            {session}
                                        </CustomTableCell>
                                        {
                                        columns.map(i => {
                                            return <CustomTableCell align='center' multiline={"true"} key={i}>

                                                {
                                                            session in editTT.data ?
                                                                editMode ? <AutoComplete value={i+1 in editTT.data[session] ? editTT.data[session][i+1]:null} onChange={getHandler(session, i+1)} suggestions={faculties}/>
                                                                :i+1 in editTT.data[session] ? editTT.data[session][i+1]
                                                                    :null

                                                            : editMode ? <AutoComplete value={null} onChange={getHandler(session, i+1)} suggestions={faculties}/>
                                                                :null
                                                }
                                            </CustomTableCell>

                                        })
                                    }
                                    </TableRow>
                                }):null
                            }
                        </TableBody>
                    </Table>
                </Paper>
                <OdooServerStatusDialog odooServerStatus={odooServerStatus}/>
        </>
    )

})
