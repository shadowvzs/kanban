import * as React from 'react';
import { withStyles, Typography } from '@material-ui/core';
import ToggleManu from './ToggleMenu';



interface MyPorps { 
    classes: {
        header: string
    }
}

interface IStyles { 
    header: any,
}

const styles : IStyles = {
    header: {
        borderBottom: '1px solid rgba(0,0,0,0.5)',
        display: 'flex',
        justifyContent: 'space-between',
        padding: '0 20px'
    }
}

function Header(props : MyPorps) {
    return (
        <div className={props.classes.header}>
            <Typography variant="h6" color="inherit">
                Kanban Cards
            </Typography>
            <ToggleManu />
        </div>
    )
}


export default withStyles(styles)(Header);