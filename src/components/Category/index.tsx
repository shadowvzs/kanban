import * as React from 'react';
import { withStyles, Button } from '@material-ui/core';
import Card from '../Card';

import ICategory from '../../types/ICategory';

interface MyProps {
    classes : {
        container: string;
        title: string;
        edit: string;
    };
    settings: ICategory;
    onDragStart: object;
    onClickDeleteCard: any;
    onClickOpen: any;
    onDrop: any;
    items: object[];
}

interface IStyles { 
    container: any;
    title: any;
    edit: any;
}

const styles : IStyles = {
    container: {
        position: 'relative',
        backgroundColor: 'rgba(255, 255, 0, 0.87)',
        flex: '0.3',
        paddingBottom: '20px',
        margin: '0 20px',
        border: '1px solid rgba(0, 0, 0, 0.5)',
        borderRadius: '8px',
        textAlign: 'center',
        boxShadow: '4px 4px 4px 4px rgba(0, 0, 0, 0.5)',
        '& > .actions': {
            pointerEvents: 'none',
            opacity: '0',
            transition: '0.3s'
        },
        '&:hover > .actions': {
            pointerEvents: 'auto',
            opacity: '0.8'
        }

    },
    title: {
        color: 'white',
        textAlign: 'center',
        cursor: 'pointer',
        fontFamily: 'cursive',
        padding: '5px 0',
        margin: '0 0 20px 0',
        borderBottom: '1px solid #000',
        background: 'linear-gradient(to bottom, #777, #aaa, #777)',
        textShadow: '1px 0 1px #000, -1px 0 1px #000, 0 1px 1px #000, 0 -1px 1px #000, 4px 4px 4px rgba(0,0,0,0.5)',
        borderRadius: '8px 8px 0 0',
    },
    edit: {
        position: 'absolute',
        top: '1px',
        left: '5px',
        minWidth: '32px',
        fontSize: '1rem'
    }
}

function Category(props: MyProps) {

    const { settings, items, onClickOpen } = props;
    const backgroundColor = {
        backgroundColor: settings.color
    }

    return (
        <div 
            className={props.classes.container} 
            style={backgroundColor}
            onDragOver={ (ev : React.DragEvent<HTMLDivElement>) : void => ev.preventDefault() }
            onDrop={ (e : React.DragEvent<HTMLDivElement>) : void => props.onDrop(e, settings.id) }
        >

            <h2 
                className={props.classes.title}
                 title={settings.description}
            >{settings.title}</h2>

            <Button 
                className={props.classes.edit + " actions"}
                variant="contained" 
                color="primary" 
                size="small"
                onClick={(ev : React.MouseEvent<HTMLDivElement>) : any => { onClickOpen(ev, settings); } }
            >&#9881;</Button>

            {
                items.map( (item : any) : any => {
                    return <Card 
                        key={"card_"+item.id} 
                        backgroundColor={backgroundColor}
                        item={item}
                        onClickDelete={props.onClickDeleteCard}
                        onDragStart={props.onDragStart} 
                    />
                })
            }
        </div>
    )
}

export default withStyles(styles)(Category);

