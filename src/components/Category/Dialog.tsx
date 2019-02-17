import * as React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { withStyles } from '@material-ui/core';

import ICategory from '../../types/ICategory';

interface MyProps {
    classes : {

    },
    settings: any;//ICategory;
    open : boolean;
    onClickClose : any;
    onClickDelete: any;

}

interface MyState {
    title: string;
    description: string;
    color: string;
}

interface IStyles { 

}

const styles : IStyles = {

}

class MyDialog extends React.PureComponent<MyProps,MyState> {
    
    constructor(props: MyProps) {
        super(props);
        this.state = {
            title: props.settings.title,
            description: props.settings.description,
            color: props.settings.color
        };
        this.onChange = this.onChange.bind(this);
    }

    onChange(ev : React.ChangeEvent<HTMLInputElement>) : void {
        const target = ev.target;
        const newState : MyState = { ...this.state, [target.name]: target.value };
        this.setState(newState);
    }

    componentWillReceiveProps(nextProps : MyProps) {
        const fields : string[] = ['color', 'title', 'description'];
        const newData : any = {};
        const state : any = this.state;
        fields.forEach((e : string) : void  => {
            if (nextProps.settings[e] !== state[e]) {
                newData[e] = nextProps.settings[e];
            }
        });
        if (Object.keys(newData).length) {
            this.setState({ ...this.state, ...newData });
        }
    }

    render() {
        const state = this.state;
        const { settings, open, onClickClose, onClickDelete } = this.props;
        return (
            <Dialog
                open={open}
                onClose={onClickClose}
                aria-labelledby="form-dialog-title"
            >
                <DialogTitle id="form-dialog-title">{settings.title}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        To subscribe to this website, please enter your email address here. We will send
                        updates occasionally.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        name="title"
                        label="Title"
                        type="text"
                        value={state.title}
                        onChange={this.onChange}
                        fullWidth
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        name="description"
                        label="Description"
                        type="text"
                        value={state.description}
                        onChange={this.onChange}
                        fullWidth
                    />                
                    <TextField
                        autoFocus
                        margin="dense"
                        name="color"
                        label="Color"
                        type="color"
                        value={state.color}
                        onChange={this.onChange}
                        fullWidth
                    />                
                </DialogContent>
                <DialogActions>
                    <Button 
                        variant="contained"
                        color="primary" 
                        size="small" 
                        onClick={onClickClose} 
                    >
                        Save
                    </Button>            
                    <Button 
                        variant="contained"
                        color="primary" 
                        size="small"                 
                        onClick={onClickClose} 
                    >
                        Cancel
                    </Button>
                    <Button 
                        variant="contained"
                        color="secondary" 
                        size="small"                 
                        onClick={onClickDelete} 
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }
}

export default withStyles(styles)(MyDialog);

