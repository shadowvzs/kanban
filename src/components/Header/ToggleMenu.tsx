import * as React from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Fade from '@material-ui/core/Fade';
import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core';

interface MyProps {
    classes: {
        link: string
    }
}

interface MyState {
    anchorEl?: HTMLElement|null;
}

interface MyStyle {
    link : object
}


const styles = {
    link: {
        textDecoration: 'none',
        color: 'rgba(0, 0, 0, 0.87)'
    }
}

class ToggleMenu extends React.Component  <MyProps, MyState> {

    constructor(props: MyProps) {
        super(props);

        this.state = {
            anchorEl: null,
        };
    }

    handleClick = (event: React.MouseEvent<HTMLElement,MouseEvent>) : void => {
        this.setState({ anchorEl: event.currentTarget });
    };

    handleClose = () : void => {
        console.log(this.state);
        this.setState({ anchorEl: null });
    };

    render() {
        const { anchorEl } = this.state;
        const open = Boolean(anchorEl);
        return (
            <div>
                <Button
                    aria-owns={open ? 'fade-menu' : undefined}
                    aria-haspopup="true"
                    onClick={this.handleClick}
                >
                    Menu
                </Button>
                <Menu
                    id="fade-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={this.handleClose}
                    TransitionComponent={Fade}
                >
                
                    <MenuItem onClick={this.handleClose}>
                        <Link to={`/`} className={this.props.classes.link}> Home </Link>
                    </MenuItem>

                    <MenuItem onClick={this.handleClose}>
                        <Link to={`/add-card`} className={this.props.classes.link}> New Card </Link>
                    </MenuItem>

                    <MenuItem onClick={this.handleClose}>
                        <Link to={`/add-column`} className={this.props.classes.link}> New Column </Link>
                    </MenuItem>   

                </Menu>
            </div>
        );
    }
}

export default withStyles(styles)(ToggleMenu);