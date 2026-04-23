import { useTheme } from '../context/ThemeContext'
import './Sidebar.css'
import avatarImage from '../assets/avatar.jpg'

function Sidebar() {
  const { theme, toggleTheme } = useTheme()

  return (
    <aside className="sidebar">
      <div className="sidebar__logo">
        <span className="sidebar__logo-text">F</span>
      </div>
      <div className="sidebar__bottom">
        <button
          className="sidebar__theme-btn"
          onClick={toggleTheme}
          aria-label="Toggle theme"
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
        <div className="sidebar__avatar">
          <img src={avatarImage} alt="User avatar" />
        </div>
      </div>
    </aside>
  )
}

export default Sidebar