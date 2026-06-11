import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

type outLetProps ={
    children:React.ReactNode
}

const OutletLayout = ({children}:outLetProps) => {
  return (
    <>
    <Navbar/>
    {children}
    <Footer/>
    </>
  
  )
}

export default OutletLayout