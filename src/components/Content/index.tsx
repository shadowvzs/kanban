import * as React from 'react';
import { withStyles } from '@material-ui/core';
import Card from '../Card';

interface MyProps {
    classes : any
}

interface MyState {
    open : object[],
    progress : object[]
    published : object[]
}

const data = {
    categories: ['open', 'progress','published'],
    items: [
        {
            id: 'xcvbnm1',
            title: 'test1',
            description: 'something',
            publishDate: '2018-02-14 18:22:11.00Z',
            category: 'open'
        },
        {
            id: 'xcvbnm2',
            title: 'test2',
            description: 'nevermind',
            publishDate: '2018-03-16 11:22:11.00Z',
            category: 'progress'
        },
        {
            id: 'xcvbnm3',
            title: 'test3',
            description: 'looong',
            publishDate: '2018-04-21 17:22:11.00Z',
            category: 'open'
        },
    ]
}

const styles : any = {
    container: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        height: '100%',
        padding: '20px',
        justifyContent: 'center'
    },
    open: {
        backgroundColor: 'rgba(255, 255, 0, 0.87)',
        flex: '0.3',
        padding: '20px',
        margin: '0 20px',
        border: '1px solid rgba(0, 0, 0, 0.5)'
    }
}

class Content extends React.PureComponent<MyProps, MyState> {
    constructor(props : MyProps) {
        super(props);
        this.state = {
            open: [],
            progress: [],
            published: []
        };
    }

    componentDidMount() {
        const state : any = {};
        
        data.categories.forEach( (e : string) : any => state[e] = []);

        data.items.forEach(e => {
            const category = state[e.category] ? e.category : Object.keys(state)[0];
            state[category].push(e);
        });
        console.log(state);
        this.setState = {...state};
    }

    render() {
        const  { open, progress, published } = this.state;
        return (
            <div className={this.props.classes.container}>
                <div className={this.props.classes.open}>
                    { open.map( (e : any) : any => <Card {...e} />) }
                </div>

                <div className={this.props.classes.open}>
                    { progress.map( (e : any) : any => <Card {...e} />) }
                </div>

                <div className={this.props.classes.open}>
                    { published.map( (e : any) : any => <Card {...e} />) }
                </div>
            </div>
        )
    }
}

export default withStyles(styles)(Content);

