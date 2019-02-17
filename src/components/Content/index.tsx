import * as React from 'react';
import { withStyles } from '@material-ui/core';
import Category from '../Category';
import Dialog from '../Category/Dialog';
import api from '../../service';
import ICard from '../../types/ICard';
import ICategory from '../../types/ICategory';

interface MyProps {
    classes: {
        content: string
    }
}

interface MyState {
    categories : {
        [key: string] : ICategory
    };
    category: ICategory | null;
    open : boolean;
    [key : string] : any;
}

interface IStyles { 
    content: any 
}

const styles : IStyles = {
    content: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        height: '100%',
        padding: '20px',
        justifyContent: 'center'
    }
}

const defaultSettings : ICategory = {
    title: "",
    description: "",
    color: "",
    id: ""
}

class Content extends React.Component<MyProps, MyState> {

    public eventData : object | null;
    public mounted : boolean;

    constructor(props : MyProps) {
        super(props);
        this.state = {
            categories: {},
            category: defaultSettings,
            open: false
        };
        this.mounted = true;
        this.onClickCardDelete = this.onClickCardDelete.bind(this);
        this.onClickCategoryDelete = this.onClickCategoryDelete.bind(this);
        this.onClickOpen = this.onClickOpen.bind(this);
        this.onClickClose = this.onClickClose.bind(this);
        this.onDragStart = this.onDragStart.bind(this);
        this.onDrop = this.onDrop.bind(this);
        // well, easier if we store here the event data at dragStart 
        // then we can get it at onDrop, but that too easy
        // and i use dataTransfer
        this.eventData = null;
    }

    onClickCardDelete(ev : React.MouseEvent<HTMLElement>, card : ICard) : void {
        const state = this.state;
        const meta = {
            success: (data : any) : void => {
                if (!data) { return console.log('Something went wrong!'); }
                const index = state[card.category]
                                .findIndex( (e : ICard) : boolean => card.id == e.id);
                if (index === -1) { return; }
                state[card.category].splice(index, 1);
                this.setState({...state});
            }
        }
        api('/cards/'+card.id, 'DELETE', meta);
    }

    onClickCategoryDelete(ev : React.MouseEvent<HTMLElement>, category : ICard) : void {
        const id = category.id;
        const state = this.state;
        console.log(state);
        
        const meta = {
            success: (data : any) : void => {
                console.log('------')
                //const categories = {...state.categories};
                //if (!data) { return console.log('Something went wrong!'); }
                //if (!categories[id]) { return; }
                //delete categories[id];
                //this.setState({...state, categories, open: false});
            }
        }
        api('/categories/'+id, 'DELETE', meta);
        
    }    

    onClickOpen = (category : ICategory) : void => {
        this.setState({ ...this.state, category: category, open: true });
    };
    
    onClickClose = () => {
        this.setState({ ...this.state, open: false });
    };

    onDragStart(ev : React.DragEvent, e : ICard) : void {
        ev.dataTransfer.setData("card", JSON.stringify(e));
    }
 
    async onDrop(ev : React.DragEvent, category : string) : Promise<void> {
        const data : ICard = JSON.parse(ev.dataTransfer.getData("card"));
        const prevCategory = data.category;
        if (category !== prevCategory) {
            const state = this.state;
            const index = state[prevCategory].findIndex((e : any) : boolean => data.id === e.id);
            if (index === -1) { return console.log('Item not exist'); }
            data.category = category;
            // ------- a lil hard code part for add date if we drop into published category
            if (state.categories[category].title.includes('Publish')) {
                data.publishDate = new Date().toISOString();
            } else {
                data.publishDate = '';
            }
            //------
            const meta = {
                data: data,
                success: (data : any) : void => {
                    if (!data) { return console.log('Something went wrong!'); }
                    state[category].push(data);
                    state[prevCategory].splice(index, 1);
                    this.setState({...state});
                }
            }
            api('/cards/', 'PUT', meta);
        }
    }

    componentDidMount() : void {
        const meta = {
            success: (data : any) : void => {
                const state : any = {};
                const categories : any = {};
                data.categories.forEach( (e : ICategory) : void => { 
                    categories[e.id] = e; 
                    state[e.id] = [];
                } );
        
                data.cards.forEach( (e : ICard) : void => {
                    const category = state[e.category] ? e.category : Object.keys(state)[0];
                    state[category].push(e);
                });

                if (this.mounted) {
                    this.setState({...state, categories });
                }
            }
        }

        api('/', 'GET', meta);
    }

    componentWillUnmount(){
        this.mounted = false;
    }

    render() : React.ReactNode {
        const state : MyState = this.state;
        const categoryKeys : string[] = Object.keys(state.categories);
        return (
            <div className={this.props.classes.content}>
                <Dialog
                    open={state.open}
                    onClickClose={this.onClickClose} 
                    settings={state.category}
                    onClickDelete={this.onClickCategoryDelete}
                />

                {
                    categoryKeys.map( (category) => {
                        return <Category 
                                    key={"cat_"+category} 
                                    items={state[category]} 
                                    settings={state.categories[category]}
                                    onDragStart={this.onDragStart}
                                    onDrop={this.onDrop}
                                    onClickOpen={this.onClickOpen}
                                    onClickDelete={this.onClickCardDelete}
                                />
                        }
                    )
                }
            </div>
        )
    }
}

export default withStyles(styles)(Content);
