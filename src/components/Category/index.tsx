import * as React from 'react';
import { withStyles } from '@material-ui/core';
import Card from '../Card';

import ICategory from '../../types/ICategory';

interface MyProps {
    classes : {
        container: string,
        title: string
    };
    settings: ICategory;
    onDragStart: object;
    onClickDelete: object;
    onClickOpen: any;
    onDrop: any;
    items: object[]
}

interface IStyles { 
    container: any,
    title: any
}

const styles : IStyles = {
    container: {
        backgroundColor: 'rgba(255, 255, 0, 0.87)',
        flex: '0.3',
        paddingBottom: '20px',
        margin: '0 20px',
        border: '1px solid rgba(0, 0, 0, 0.5)',
        borderRadius: '8px',
        textAlign: 'center',
        boxShadow: '4px 4px 4px 4px rgba(0, 0, 0, 0.5)'

    },
    title: {
        color: 'white',
        textAlign: 'center',
        fontFamily: 'cursive',
        padding: '5px 0',
        margin: '0 0 20px 0',
        borderBottom: '1px solid #000',
        background: 'linear-gradient(to bottom, #777, #aaa, #777)',
        textShadow: '1px 0 1px #000, -1px 0 1px #000, 0 1px 1px #000, 0 -1px 1px #000, 4px 4px 4px rgba(0,0,0,0.5)'
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
                onClick={(ev : React.MouseEvent) : any => { onClickOpen(settings); } }
            >{settings.title}</h2>
            {
                items.map( (item : any) : any => {
                    return <Card 
                        key={"card_"+item.id} 
                        backgroundColor={backgroundColor}
                        item={item}
                        onClickDelete={props.onClickDelete}
                        onDragStart={props.onDragStart} 
                    />
                })
            }
        </div>
    )
}

export default withStyles(styles)(Category);

