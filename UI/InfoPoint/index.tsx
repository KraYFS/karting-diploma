import './styles.scss'

type InfoPointProps = {
  text?: string
}

const InfoPoint = ({ text }: InfoPointProps) => {
  return (
    <div className='info-point'>
      <svg className='info-point__line' viewBox='0 0 300 120'>
        <polyline className='info-point__line-path' points='260,80 200,20 0,20' />
        <circle cx='260' cy='80' r='4' className='info-point__line-dot' />
      </svg>
      <div className='info-point__text'>{text}</div>
    </div>
  )
}

export default InfoPoint
