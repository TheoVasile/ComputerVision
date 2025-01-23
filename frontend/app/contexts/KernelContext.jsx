import { createContext } from "react";

const KernelContext = createContext({
    rows: 3, 
    setRows: ()=>{}, 
    cols: 3, 
    setCols: ()=>{}, 
    gridValues: [], 
    setGridValus: () => {}});

export default KernelContext;