import React from "react";
import PropTypes from "prop-types";
import deburr from "lodash/deburr";
import Downshift from "downshift";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import MenuItem from "@material-ui/core/MenuItem";
import InputAdornment from '@material-ui/core/InputAdornment'


function renderInput(inputProps) {
  const { InputProps, classes, ref,label, ...other } = inputProps;
  return (
    <TextField
      // disabled={readonly}
      multiline
      variant='outlined'
      InputProps={{
        inputRef: ref,
        startAdornment: <InputAdornment position="start"><b>{label}</b></InputAdornment>,
        classes: {
          root: classes.inputRoot,
          input: classes.inputInput
        },
        ...InputProps
      }}
      {...other}
    />
  );
}

function renderSuggestion(suggestionProps) {
  const {
    suggestion,
    index,
    itemProps,
    highlightedIndex,
    selectedItem,
    rest,
    selectedFaculty
  } = suggestionProps
  let selectedFacultyArray = []
  let isBusy = false
   if('col' in rest && Object.keys(selectedFaculty).length !== 0){
    let {row, col, weekStr} = rest
    for(let course in selectedFaculty['res'][weekStr]){
      for(let batch in selectedFaculty['res'][weekStr][course]){
        for(let semester in selectedFaculty['res'][weekStr][course][batch]){
          for(let group in selectedFaculty['res'][weekStr][course][batch][semester]){
            if(col in selectedFaculty['res'][weekStr][course][batch][semester][group]){
              if(row in selectedFaculty['res'][weekStr][course][batch][semester][group][col]){
                selectedFacultyArray.push(selectedFaculty['res'][weekStr][course][batch][semester][group][col][row])
              }
            }
          }
        }
      }
    }

    if(selectedFacultyArray.length !== 0){
        selectedFacultyArray.forEach(e=> {
          if(!e) return
          if(!isBusy){
            if(selectedItem){
              selectedFacultyArray.forEach(e => isBusy = selectedItem.includes(e.split('(')[1]))
            } else{
              isBusy = suggestion.label.includes(e.split('(')[1])
            }
          }
        })
      }
  }

  const isHighlighted = highlightedIndex === index;
  const isSelected = (selectedItem || "").indexOf(suggestion.label) > -1;
  return (
    <MenuItem
      {...itemProps}
      key={suggestion.label}
      selected={isHighlighted}
      disabled={isBusy}
      component="div"
      style={{
        fontWeight: isSelected ? 500 : 400
      }}
    >
      {suggestion.label}
    </MenuItem>
  );
}

function getSuggestions(value, { showEmpty = false } = {}, suggestions) {
  const inputValue = deburr(value.trim()).toLowerCase();
  const inputLength = inputValue.length;
  return inputLength === 0 && !showEmpty
    ? []
    : suggestions.filter(suggestion => suggestion.label.toLowerCase().includes(inputValue));
}

const useStyles = makeStyles(theme => ({
    root: {
      flexGrow: 1,
    },
    container: {
      flexGrow: 1,
      position: "relative"
    },
    paper: {
      position: "absolute",
      zIndex: 999,
      marginTop: theme.spacing(1),
      left: 0,
      right: 0,
      width:400,
      boxShadow: theme.shadows[5]
    },
    inputRoot: {
      flexWrap: "wrap"
    },
    inputInput: {
      width: "auto",
      flexGrow: 1,
    },
    divider: {
      height: theme.spacing(2)
    }
  })
);

function AutoComplete({suggestions, value=null, onChange, label, selectedFaculty, ...rest}) {

  const classes = useStyles();
  return  <Downshift onChange={onChange} selectedItem={value}>
      {downshift => {
        const {onBlur, onChange, onFocus, ...inputProps} = downshift.getInputProps({
          onChange: event => {
            if (event.target.value === "") {
              downshift.clearSelection()
            }
          },
          onFocus: downshift.openMenu,
        })
        return <div className={classes.container}>
          {
            renderInput({
              fullWidth:true,
              classes,
              InputLabelProps: downshift.getLabelProps({shrink:true}),
              InputProps: {onBlur, onChange, onFocus},
              inputProps,
              label,
              // readonly: rest.disabled
            })
          }
          <div {...downshift.getMenuProps()}>
                {downshift.isOpen ? (
                  <Paper className={classes.paper} square onClick={()=>downshift.isOpen =false}>
                    {getSuggestions(downshift.inputValue, { showEmpty: true }, suggestions.map(e=>({label:e}))).map(
                      (suggestion, index) =>
                        renderSuggestion({
                          suggestion,
                          index,
                          itemProps: downshift.getItemProps({ item: suggestion.label }),
                          highlightedIndex: downshift.highlightedIndex,
                          selectedItem: value,
                          selectedFaculty,
                          rest
                        })
                    )}
                  </Paper>
                ) : null}
              </div>
        </div>
      }}
    </Downshift>
}

export default AutoComplete
renderSuggestion.propTypes = {
  highlightedIndex: PropTypes.number,
  index: PropTypes.number,
  itemProps: PropTypes.object,
  selectedItem: PropTypes.string,
  suggestion: PropTypes.shape({ label: PropTypes.string }).isRequired
};