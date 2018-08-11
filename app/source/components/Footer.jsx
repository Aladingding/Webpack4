import React from 'react'
import { Link, Router,Switch, Route, HashRouter } from 'react-router-dom'
const DOMFooter = ()=>(
    <div className={'footer'}>
        footer area
    </div>
)

class Footer extends React.Component{
    constructor() {
        super();
        this._setState = this._setState.bind(this);
    }
    componentDidMount(){
    }
    _setState(state,fn){
    }
    render(){
        return <Switch>
            <Route path="/book" component={DOMFooter}/>
        </Switch>
    }
}




export default Footer