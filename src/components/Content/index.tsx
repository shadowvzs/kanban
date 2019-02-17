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


interface ISelf {
    [index : string] : any;
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
            open: false,
            fields: []
        };
        const self : ISelf = this;
        this.mounted = true;
        // lets bind everythings
        [
            'onClickCardDelete',
            'onClickCategoryDelete',
            'onClickCategorySave',
            'onClickOpen',
            'onClickClose',
            'onDragStart',
            'onDrop'
        ].forEach((e :string) : void => { self[e] = self[e].bind(self); } );
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

    onClickCategoryDelete(ev : React.MouseEvent<HTMLElement>, category_id : string) : void {
        const state = { ...this.state };

        const meta = {
            success: (data : any) : void => {
                if (!data) { return console.log('Something went wrong!'); }
                const categories = {...state.categories};
                delete categories[category_id];
                const category_keys = Object.keys(categories);
                if (category_keys[0]) {
                    // lets move the cards from deleted category to the first category
                    state[category_id].forEach((card : ICard) : void => {
                        // update category on cards
                        card.category = category_keys[0];
                    });
                    // copy cards from deleted category t the first category
                    state[category_keys[0]].push(...state[category_id]);
                    delete state[category_id];
                }
                this.setState({...state, categories, open: false});
            }
        }
        api('/categories/'+category_id, 'DELETE', meta);
    }    

    onClickOpen = (ev : React.MouseEvent<HTMLElement>, category : ICategory) : void => {
        this.setState({ ...this.state, category: category, open: true });
    };
    
    onClickClose = () => {
        this.setState({ ...this.state, open: false });
    };

    onDragStart(ev : React.DragEvent, e : ICard) : void {
        ev.dataTransfer.setData("card", JSON.stringify(e));
    }
 
    onClickCategorySave(ev : React.MouseEvent, category : ICategory) : void {

        const meta = {
            data: category,
            success: (data : ICategory) : void => {
                const categories = { ...this.state.categories, [category.id] : category };
                this.setState({ ...this.state, categories, open: false })
            }
        }

        api('/categories', 'PUT', meta);        
    }

    async onDrop(ev : React.DragEvent, category : string) : Promise<void> {
        const data : ICard = JSON.parse(ev.dataTransfer.getData("card"));
        const prevCategory = data.category;
        if (category !== prevCategory) {
            const state = this.state;
            const index = state[prevCategory].findIndex((e : any) : boolean => data.id === e.id);
            console.log(data,state[prevCategory])
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
                    onClickSave={this.onClickCategorySave}
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
                                    onClickDeleteCard={this.onClickCardDelete}
                                />
                        }
                    )
                }
            </div>
        )
    }
}

export default withStyles(styles)(Content);
