import * as React from 'react';
import { 
    Button, 
    TextField,
    Dialog,
    DialogActions, 
    DialogContent, 
    DialogContentText,
    DialogTitle,
} from '@material-ui/core';

import ICategory from '../../types/ICategory';

interface MyProps {
    settings: ICategory;
    open : boolean;
    onClickClose : any;
    onClickDelete: any;
    onClickSave: any;
}

interface MyState {
    id: string;
    title: string;
    description: string;
    color: string;
}

class MyDialog extends React.PureComponent<MyProps,MyState> {
    
    public fields : string[];

    constructor(props: MyProps) {
        super(props);
        this.state = {
            id: props.settings.id,
            title: props.settings.title,
            description: props.settings.description,
            color: props.settings.color
        };
        this.fields = ['title', 'description', 'publishDate'];
        this.onChange = this.onChange.bind(this);
        this.onSave = this.onSave.bind(this);
    }

    onChange(ev : React.ChangeEvent<HTMLInputElement>) : void {
        const target = ev.target;
        const newState : MyState = { ...this.state, [target.name]: target.value };
        this.setState(newState);
    }

    onSave(ev : React.MouseEvent) : void {
        const { title, description} = this.state;
        if (!title.length && !description.length) {
            return alert('You must complete the fields!');
        }        
        this.props.onClickSave(ev, this.state);
    }

    componentWillReceiveProps(nextProps : MyProps) {
        // don't need to set state if dialog not opened
        if (!nextProps.open) { return; }
        const fields : string[] = ['id', 'color', 'title', 'description'];
        const newData : any = {};
        const state : any = this.state;
        fields.forEach((e : string) : void  => {
            const setting : string = nextProps.settings[e];
            if (setting && setting !== state[e]) {
                newData[e] = nextProps.settings[e];
            }
        });
       
        if (Object.keys(newData).length) {
            this.setState({ ...this.state, ...newData });
        }
    }

    render() {
        const state = this.state;
        const { open, onClickClose, onClickDelete } = this.props;
        return (
            <Dialog
                open={open}
                onClose={onClickClose}
                aria-labelledby="form-dialog-title"
            >
                <DialogTitle id="form-dialog-title">{state.title}</DialogTitle>
                
                <DialogContent>
                    <DialogContentText>
                        You can do few modification here...
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
                        onClick={this.onSave} 
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
                        onClick={ (ev : React.MouseEvent) : void => { onClickDelete(ev, this.state.id) }} 
                    >
                        Delete
                    </Button>                    

                </DialogActions>
            </Dialog>
        )
    }
}

export default MyDialog;

