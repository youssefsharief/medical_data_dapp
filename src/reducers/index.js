import { combineReducers } from 'redux'
import { doctorsStore } from './doctorStore';
import { ethStore } from './ethStore';
import { documentStore } from './documentStore';
import { layoutStore } from './layoutStore';
import { identityStore } from './identityStore';

export default combineReducers({ doctorsStore, ethStore, documentStore, layoutStore, identityStore })
