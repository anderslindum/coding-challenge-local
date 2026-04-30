import React from 'react'
import { Sidebar } from './views/sidebar'
import { SalesConnnectorProvider } from '../context/sales-connector'
import { DashBoardView } from './dashboard'
import { SalesContextProvider } from '../context/sales-context'

export default () => (
    <React.StrictMode>
        <Sidebar />
        <SalesConnnectorProvider>
            <SalesContextProvider>
                <DashBoardView />
            </SalesContextProvider>
        </SalesConnnectorProvider>
    </React.StrictMode>
)
