import _ from 'lodash';


const A = ()=>{
    console.log(_.defaults({ 'a': 1 }, { 'a': 3, 'b': 2 }));
}

export default A;

