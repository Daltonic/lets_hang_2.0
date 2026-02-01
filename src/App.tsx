import { RecoilRoot } from 'recoil';
// import { UserForm } from './components/UserForm';
// import { TaskForm } from './components/TaskForm';
// import { UsersList } from './components/UsersList';
// import { TasksList } from './components/TasksList';
// import { TestComponent } from './components/TestComponent';
import { ErrorBoundary } from './components/ErrorBoundary';
import EventCreator from './components/EventCreator';

function App() {
  return (
    <ErrorBoundary>
      <RecoilRoot>
        {/* <div className="min-h-screen bg-gray-50 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Letshang App</h1>
              <p className="text-lg text-gray-600">React + Vite + TypeScript + Tailwind CSS + Recoil + SQLite3</p>
            </div>
            
            <TestComponent />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <UserForm />
                <UsersList />
              </div>
              <div className="space-y-6">
                <TaskForm />
                <TasksList />
              </div>
            </div>
          </div>
        </div> */}
        <EventCreator />
      </RecoilRoot>
    </ErrorBoundary>
  );
}

export default App;
