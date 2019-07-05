import React, {useState, useEffect} from 'react'
import {Paper,
    Table,
    TableBody,
    TableHead,
    TableRow,
} from "@material-ui/core";
import CustomTableCell from '../Table/CustomTableCell'
import tableStyle from '../Table/TableStyle'
import moment from 'moment'



export default ({week, editTT, ...rest})=> {

    const header = ['Session']
    if(week.startDate){
        for (let i = 1; i <= 7; i++) {
            header.push(
              moment(week.startDate, 'YYYY-MM-DD')
                .add(i, 'days')
                .utc()
                .format("ddd MM/DD"))
        }
    }


    const classes = tableStyle()
    return (
        <div className={classes.container}>
                <Paper className={classes.root}>
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
                            {Object.keys(editTT).map(session => {
                                if(session === 'header') return null
                                const temp = []
                                for(let i =0; i < 7; i++){
                                    temp.push(<CustomTableCell align="center" key={i} >
                                    { i+1 in editTT[session] ? editTT[session][i+1] : null}
                                    </CustomTableCell>)
                                }
                                return <TableRow className={classes.row} key={session}>
                                        <CustomTableCell align="center">
                                            {session}
                                        </CustomTableCell>
                                        {temp}
                                </TableRow>
                            })}
                        </TableBody>
                    </Table>
                </Paper>
            </div>
    )
}