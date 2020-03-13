import { combineReducers } from 'redux'
import {doctorsStore} from './doctorStore';
import {ethStore} from './ethStore';

export default combineReducers({  doctorsStore  , ethStore })
