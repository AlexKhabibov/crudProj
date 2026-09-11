import { RouterProvider } from "react-router-dom"
import { routerConfig, StoreProvider } from "./providers"

function App() {

  return (
    <>
      <StoreProvider>
        <RouterProvider router={routerConfig} />
      </StoreProvider>
    </>
  )
}

export default App