import { AppDispatch, RootState } from '@/store/store'
import { useSelector } from 'react-redux'
import { TypedUseSelectorHook, useDispatch } from 'react-redux'

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// для комфортной работы с типами, чтобы не писать каждый раз при забирании стейта одно и то же