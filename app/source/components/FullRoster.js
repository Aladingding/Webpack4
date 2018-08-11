import React from 'react'
import PlayerAPI from './api.js'
import { Link, Router,Switch, Route, HashRouter } from 'react-router-dom'

// The FullRoster iterates over all of the players and creates
// a link to their profile page.

import Loadable from 'react-loadable';
import Player   from "./Player";

const Loading = ()=>(<div>Loading...</div>)
// const Footer = Loadable({loader: () => import('./Footer.jsx'),loading:Loading});
// const User = Loadable({loader: () => import('./User.jsx'),loading:Loading});

const FullRoster = () => {
    const dynamicImport = ()=>{
        console.log()
        import('./AsynicJs.js').then( fn => {
            console.log(fn,'fn')
            fn.writeSome('yes you got it')
        })
    }
    return <div>
        <ul>
            {
                PlayerAPI.all().map(p => (
                    <li key={p.number}>
                        <Link to={`/roster/${p.number}`}>{p.name}</Link>
                    </li>
                ))
            }
        </ul>
        {/*<Link to={`/user`}>按需加载</Link>*/}
        <aside onClick={dynamicImport}>按需加载</aside>
        {/*<Route path="/user/:username" component={User}/>*/}
    </div>
}

export default FullRoster

// <Link to={`/roster/${p.number}` component={Roster} }>{p.name}</Link>