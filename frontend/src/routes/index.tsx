import { createFileRoute, useNavigate } from '@tanstack/react-router'
// import { getCurrentUserId } from '../utils/auth'
// import { useReadUser } from '../api/api-client/user'
import DashboardPage from '../components/pages/DashboardPage'
import { useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAuthenticated) {
      navigate({ to: '/login', search: { redirect: '/' } });
    }
  }, [isAuthenticated, navigate])

  if (!isAuthenticated) return null

  return <DashboardPage />
}

// function App() {
//   const userId = getCurrentUserId(); // get the ID from the token

//   const {
//     data,
//     // status,
//     isSuccess,
//     isLoading,
//     isError,
//   } = useReadUser(userId ?? '', {
//     query: {
//       enabled: !!userId, // only fetch if ID exists
//     },
//   });

//   return (
//     <div className="App">
//       <header className="App-header">
//         <div>
//           <p>This is My note app</p>
//         </div>
//         {isLoading && <p>Loading user...</p>}
//         {isError && <p>Could not load user</p>}
//         {isSuccess && <div>Welcome, {data.first_name}</div>}
//       </header>
//     </div>
//   );
// }
