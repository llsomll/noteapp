import { useContext } from 'react'
import AppBarHeightContext from '../context/appBarContext'

export const useAppBarHeight = () => useContext(AppBarHeightContext)
