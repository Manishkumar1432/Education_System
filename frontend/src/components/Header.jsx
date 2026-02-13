import { useAuth } from '../context/AuthContext'

export default function Header({ onMenu }) {
  const { user, logout, theme, setTheme } = useAuth()

  return (
    <header className="flex items-center justify-between p-4 bg-yellow-400 shadow">
      {/* Left section */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenu}
          className="text-black text-xl hover:scale-110 transition"
        >
          ☰
        </button>
        <h1 className="text-lg font-semibold text-black">
          Edu Platform
        </h1>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="px-3 py-1 rounded bg-yellow-300 text-black hover:bg-yellow-200 transition"
        >
          {theme === 'dark' ? 'Light' : 'Dark'}
        </button>

        {user ? (
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-black">
              {user.name}
            </span>
            <button
              onClick={logout}
              className="text-sm font-medium text-red-600 hover:underline"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="text-sm text-black">
            Not signed in
          </div>
        )}
      </div>
    </header>
  )
}
