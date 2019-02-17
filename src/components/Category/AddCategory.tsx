import * as React from "react";
import { Redirect } from 'react-router-dom';
import { withStyles, TextField, Button } from '@material-ui/core';
import ICard from '../../types/ICard';
import api from '../../service';

interface MyProps { 
    classes: {
        container: string;
        textField: string;
        title: string;
        button: string;
    };
    history: any;
    location: any;
    match: any;
    staticContext: any;
}

interface MyState { 
    title: string;
    description: string;
    opacity: number;
    saved: boolean;
}

interface iStyles {
    textField : any;
    container: any;
    title: any;
    button: any;
}

const styles : iStyles = {
    container: {
        position: 'relative',
        display: 'block',
        margin: 'auto',
        top: '100px',
        transform: `rotate(${Math.random() * 20 - 10}deg)`,
        width: '200px',
        backgroundColor: '#ff7',
        border: '1px solid rgba(0,0,0,0.4)',  
        padding: '20px',
        boxShadow: '2px 2px 5px 5px rgba(0,0,0,0.15)'  
    },
    title: {
        textAlign: 'center',
        fontFamily: 'cursive',
        fontSize: '30px',
        color: 'white',
        textShadow: '1px 0 1px #000, -1px 0 1px #000, 0 1px 1px #000, 0 -1px 1px #000, 2px 2px 2px rgba(0,0,0,0.5)',
        margin: '0'
    },
    textField: {
        width: '100%'
    },
    button: {
        marginTop: '15px',
        left: '50%',
        transform: 'translateX(-50%)'
    }
}


class Category extends React.Component<MyProps,MyState> {

    public data : ICard;
    public mounted : boolean;

    constructor(props : MyProps) {
        super(props);
        this.state = {
            title: '',
            description: '',
            opacity: 0.5,
            saved: false
        }
        this.mounted = true;
        this.onChange = this.onChange.bind(this);
        this.onClickSave = this.onClickSave.bind(this);
    }

    onChange(ev : React.ChangeEvent<HTMLInputElement>) : void {
        const target = ev.target;
        const newState : MyState = { ...this.state, [target.name]: target.value };
        if (newState.title.trim().length && newState.description.trim().length) {
            newState.opacity = 1;
        } else {
            newState.opacity = 0.5;
        }
        this.setState(newState);
    }

    onClickSave(ev : React.MouseEvent) : void {
        const { title, description} = this.state;
        if (!title.length && !description.length) {
            return alert('You must complete the fields!');
        }
        this.data.title = title;
        this.data.description = description;
        const meta = {
            data: this.data,
            success: (data : ICard) : void => {
                this.setState({ ...this.state, saved: true })
            }
        }

        api('/cards', 'PUT', meta);        
    }


    componentDidMount() : void {
        const id = this.props.match.params.id;
        const meta = {
            success: (data : ICard) : void => {
                this.data = data;
                if (this.mounted) {
                    const newState = { ...this.state, title: data.title, description: data.description };
                    this.setState(newState);
                }
            }
        }

        api('/cards/'+id, 'GET', meta);
    }

    componentWillUnmount(){
        this.mounted = false;
    }

    render() {
        const { classes } = this.props;
        const myStyle = {
            opacity: this.state.opacity
        }

        return (
            <div className={classes.container}>
                { this.state.saved ? <Redirect to="/" /> : null }
                <h2 className={classes.title}> Edit Card </h2>

                <TextField
                    label="Title"
                    value={this.state.title}
                    name="title"
                    type="search"
                    onChange={this.onChange}
                    className={classes.textField}
                    margin="normal"
                />

                <TextField
                    label="Description"
                    value={this.state.description}
                    name="description"
                    type="search"
                    onChange={this.onChange}
                    className={classes.textField}
                    margin="normal"
                />

                <Button 
                    variant="contained" 
                    color="primary" 
                    size="small"
                    className={classes.button}
                    style={myStyle}
                    onClick={this.onClickSave}
                > Save </Button>
            </div>
        );
    }
}


export default withStyles(styles)(Category);