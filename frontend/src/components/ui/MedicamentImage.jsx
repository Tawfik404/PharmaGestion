import defaultMedicamentImage from '../../../default_med.png'
import './MedicamentImage.css'

export default function MedicamentImage({
  src,
  alt,
  size = 'md',
  className = '',
  imgClassName = '',
}) {
  return (
    <div className={`medicament-image medicament-image--${size} ${className}`.trim()}>
      <img
        key={src || defaultMedicamentImage}
        className={`medicament-image__img ${imgClassName}`.trim()}
        src={src || defaultMedicamentImage}
        alt={alt}
        loading="lazy"
        onError={(event) => {
          event.currentTarget.onerror = null
          event.currentTarget.src = defaultMedicamentImage
        }}
      />
    </div>
  )
}
