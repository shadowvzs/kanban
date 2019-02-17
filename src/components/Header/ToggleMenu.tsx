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
        this.setState({ anchorEl: null });
    };

    render() {
        const { anchorEl } = this.state;
        const open = Boolean(anchorEl);
        const ToHome = () => <Link to={`/home`} className={this.props.classes.link} />
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
                    <Link to={`/`} className={this.props.classes.link}>
                        <MenuItem onClick={this.handleClose}>
                            Home
                        </MenuItem>
                    </Link>

                    <Link to={`/add`} className={this.props.classes.link}>
                        <MenuItem onClick={this.handleClose}>
                            New Card
                        </MenuItem>
                    </Link>

                    <Link to={`/category`} className={this.props.classes.link}>
                        <MenuItem onClick={this.handleClose}>
                            Category
                        </MenuItem>
                    </Link>

                </Menu>
            </div>
        );
    }
}

export default withStyles(styles)(ToggleMenu);