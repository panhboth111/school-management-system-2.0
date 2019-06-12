import React from "react";
import {connect} from 'react-redux'
import { withStyles } from "@material-ui/core/styles";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
} from "@material-ui/core"
import { PRINT_ATTENDANCE_REPORT} from '../../constants/env'


const styles = theme => ({
  root: {
    textAlign: "center",
    width: '100%',
    height: '100%'
  },
  dialogPaper: {
    minHeight: '80vh',
    maxHeight: '80vh',
  },
  dialogContent: {
    height: '700px',
  },
  icon: {
    width: 150,
    height: 150,
    marginTop: 10,
    marginLeft: 100,
    marginBottom: 20,
    marginRight: 100
  },
  button: {
    marginRight: 40
  }
});

const AttendanceReportDialog = ({classes,report,dispatch, b64}) =>{
var link = React.createElement('a', {download:'file.pdf', href:'data:application/octet-stream;base64,' + b64}, 'Download');
let obj = React.createElement('embed', {style:{width:'100%', height:'100%'},type:'application/pdf', src:'data:application/pdf;base64,' + report})
return (
    <Dialog
        fullWidth={true}
        maxWidth='sm'
        disableEscapeKeyDown
        classes={{paper: classes.dialogPaper}}
        open={ report? true  :false}
        className={classes.root}>
        <DialogContent className={classes.dialogContent}>{obj}</DialogContent>
        <DialogActions>
            <Button
                className={classes.button}
                onClick={()=> dispatch({type:PRINT_ATTENDANCE_REPORT, payload:false})}
                size="large"
                variant="outlined"
                color="primary">
                    {link}
            </Button>
        </DialogActions>
    </Dialog>)
}  
export default connect(state=>({report:state.initData.report, b64: state.initData.b64Report}))(withStyles(styles)(AttendanceReportDialog))