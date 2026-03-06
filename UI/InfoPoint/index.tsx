import './styles.scss'

const InfoPoint = () => {
  return (
    <svg className='line' viewBox='0 0 300 120'>
      <polyline className='line-path' points='260,80 200,20 0,20' />
      <circle cx='260' cy='80' r='4' className='line-dot' />
    </svg>
  )
}

export default InfoPoint
