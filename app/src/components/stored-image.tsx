import { Image, ImageStyle } from 'expo-image';
import { useEffect, useState } from 'react';
import { StyleProp } from 'react-native';

import { fileUrl } from '@/utils/files';

/** Zeigt Bilder an, auch wenn sie als "idb:…"-Verweis gespeichert sind (Web). */
export function StoredImage({ uri, style }: { uri: string; style?: StyleProp<ImageStyle> }) {
  const [src, setSrc] = useState(uri.startsWith('idb:') ? '' : uri);
  useEffect(() => {
    if (!uri.startsWith('idb:')) return setSrc(uri);
    let url = '';
    let alive = true;
    fileUrl(uri).then((u) => {
      url = u;
      if (alive) setSrc(u);
    });
    return () => {
      alive = false;
      if (url.startsWith('blob:')) URL.revokeObjectURL(url);
    };
  }, [uri]);
  return <Image source={src ? { uri: src } : undefined} style={style} contentFit="cover" />;
}
