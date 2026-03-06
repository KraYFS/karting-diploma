import './styles.scss'

type InfoPointProps = {
  text?: string
}

const InfoPoint = ({ text }: InfoPointProps) => {
  return (
    <div >
      <svg className='line' viewBox='0 0 300 120'>
        <polyline className='line__path' points='260,80 200,20 0,20' />
        <circle cx='260' cy='80' r='4' className='line__dot' />
      </svg>
      {text}
    </div>
  )
}

export default InfoPoint
