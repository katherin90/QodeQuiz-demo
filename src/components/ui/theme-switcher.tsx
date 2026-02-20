'use client'
import React from 'react'


const ThemeSwitcher:React.FC = () => {
    const [checked, setChecked] = React.useState(false)
    React.useEffect(() => {
    try {
      const saved = localStorage.getItem('theme')
      if (saved === 'light') setChecked(true)
      if (saved === 'dark') setChecked(false)
    } catch {}
  }, [])

  const onChange = (nextChecked: boolean) => {
    setChecked(nextChecked)

    try {
      localStorage.setItem(
        'theme',
        nextChecked ? 'light' : 'dark'
      )
    } catch {}
  }

    return (
        <div className='mt-9'>
            <span className='pr-4'>&lt; Theme = "{checked ? 'Light':'Dark'}"|</span>
            <label> 
              <input type='checkbox' checked={checked} onChange={(e) => onChange(e.target.checked)} className="opacity-0 hidden pointer-events-none" data-theme/>
              <span className='gradientText toggleBtn'>Toggle</span>
              <div className='themToggleHint'>
                <span>Click to switch theme</span>
              </div>
            </label>
        </div>
    )
}

export default ThemeSwitcher