import { ThemedLayoutV2, ThemedTitleV2 } from '@refinedev/antd'
import React from 'react'
import Header from './header'

const Layout = ({ children }: React.PropsWithChildren) => {
  return (
    <ThemedLayoutV2
        Header={Header}
        Title={(titleprops) => <ThemedTitleV2 {...titleprops} text="HUBIN ADMIN"/>}
    >
        {children}
    </ThemedLayoutV2>
  )
}

export default Layout