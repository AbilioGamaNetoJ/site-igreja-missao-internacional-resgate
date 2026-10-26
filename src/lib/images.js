const LOCAL_WIDTHS = [480, 768, 1280, 1920];
const LOCAL_IMAGE = /^(.*)\.webp$/;

const nearestLocalWidth = (width) => LOCAL_WIDTHS.find((candidate) => candidate >= width) ?? LOCAL_WIDTHS.at(-1);

const supabaseObject = (source) => {
  if (!source || !source.startsWith('http')) return null;

  try {
    const url = new URL(source);
    const match = url.pathname.match(/\/storage\/v1\/object\/public\/([^/]+)\/(.+)$/);
    if (!match) return null;
    return { origin: url.origin, bucket: match[1], path: match[2] };
  } catch {
    return null;
  }
};

const remoteImageUrl = (source, { width, height, aspectRatio, quality = 72, resize = 'cover' }) => {
  const object = supabaseObject(source);
  if (!object) return source;

  const params = new URLSearchParams({
    width: String(Math.round(width)),
    quality: String(quality),
    format: 'webp',
  });
  const computedHeight = height ?? (aspectRatio ? Math.round(width / aspectRatio) : null);
  if (computedHeight) params.set('height', String(computedHeight));
  if (resize) params.set('resize', resize);

  return `${object.origin}/storage/v1/render/image/public/${object.bucket}/${object.path}?${params}`;
};

export const imageUrl = (source, options = {}) => {
  if (!source) return source;

  if (supabaseObject(source)) return remoteImageUrl(source, { width: 1280, ...options });

  const match = source.match(LOCAL_IMAGE);
  if (!match) return source;

  return `${match[1]}-${nearestLocalWidth(options.width ?? 1280)}.webp`;
};

export const imageSrcSet = (source, options = {}) => {
  if (!source) return undefined;

  const widths = options.widths ?? LOCAL_WIDTHS;
  if (supabaseObject(source)) {
    return widths
      .map((width) => `${remoteImageUrl(source, { ...options, width })} ${width}w`)
      .join(', ');
  }

  const match = source.match(LOCAL_IMAGE);
  if (!match) return undefined;

  return widths.map((width) => `${match[1]}-${width}.webp ${width}w`).join(', ');
};
