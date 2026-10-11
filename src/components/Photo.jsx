/** Lazy, responsive <img> from an entry in src/images.js. */
export default function Photo({ img, sizes = "100vw", className = "size-full object-cover", ...rest }) {
  return (
    <img
      src={img.src}
      srcSet={img.srcSet}
      sizes={img.srcSet ? sizes : undefined}
      width={img.width}
      height={img.height}
      alt={img.alt}
      loading="lazy"
      decoding="async"
      className={className}
      {...rest}
    />
  );
}
