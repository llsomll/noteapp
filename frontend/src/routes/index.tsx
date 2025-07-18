import { createFileRoute } from '@tanstack/react-router'
import { getCurrentUserId } from '../utils/auth'
import { useReadUser } from '../api/api-client/user'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  const userId = getCurrentUserId(); // get the ID from the token

  const {
    data,
    // status,
    isSuccess,
    isLoading,
    isError,
  } = useReadUser(userId ?? '', {
    query: {
      enabled: !!userId, // only fetch if ID exists
    },
  });

  return (
    <div className="App">
      <header className="App-header">
        <div>
          <p>This is My note app</p>
        </div>
        {isLoading && <p>Loading user...</p>}
        {isError && <p>Could not load user</p>}
        {isSuccess && <div>Welcome, {data.first_name}</div>}
      </header>
    </div>
  );
}
