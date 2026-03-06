import './styles.scss'

import Image from 'next/image'

import Input from '@/UI/Input/Input'

import { navLinks } from '../../constants/HeaderNavLinks'

const Header = () => {
  return (
    <header className='header'>
      <div className='container'>
        <nav className='header__nav'>
          {navLinks.map(({ id, label, href, type, src = '', alt = '' }) => {
            return type === 'link' ? (
              <a className='header__nav-link' key={id} href={href}>
                {label}
              </a>
            ) : (
              <Image loading='eager' key={id} width={50} height={50} src={src} alt={alt} />
            )
          })}
          <Input type='text' placeholder='Search' />
        </nav>
      </div>
    </header>
  )
}

export default Header
