
import {atom} from 'jotai'
import {PageKey} from '../Models/pages'
import {localStorageKeys} from '../config'

export const pageAtom = atom<PageKey>(localStorage.getItem(localStorageKeys.prevPage) as PageKey ?? 'home')
