import './styles.scss'

import clsx from 'clsx'

type InputProps = {
  type: string
  placeholder: string
}

import Image from 'next/image'

const Input = ({ type, placeholder }: InputProps) => {
  return (
    <div className='input-wrapper'>
      <input
        placeholder={placeholder}
        type={type}
        className={`${clsx('input')}`}
      />
      <Image className='input__icon' width={15} height={15} src='/icons/search.svg' alt='Search icon' />
    </div>
  )
}

export default Input
