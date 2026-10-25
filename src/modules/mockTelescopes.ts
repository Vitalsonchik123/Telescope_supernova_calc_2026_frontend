// src/modules/mockTelescopes.ts

// Импортируем локальные картинки (имена строго как в папке assets)
import ztfImg from '../assets/ztf_image.jpg';
import panstarrsImg from '../assets/panstarrs_image.jpg';
import lsstImg from '../assets/lsst_image.jpg';
import tessImg from '../assets/tess_image.jpg';
import gaiaImg from '../assets/gaia_image.jpg';
import keckImg from '../assets/keck_image.jpg';

// Импортируем локальные видео
import ztfVid from '../assets/ztf_video.mp4';
import panstarrsVid from '../assets/panstarrs_video.mp4';
import lsstVid from '../assets/lsst_video.mp4';
import tessVid from '../assets/tess_video.mp4';
import gaiaVid from '../assets/gaia_video.mp4';
import keckVid from '../assets/keck_video.mp4';

export interface Telescope {
  id: number;
  name: string;
  aperture_cm: number;
  fov_deg: number;
  imageUrl: string;
  videoUrl: string;
  likes: number;
  description: string;
}

export const mockTelescopes: Telescope[] = [
  {
    id: 1,
    name: 'ZTF',
    aperture_cm: 122,
    fov_deg: 47,
    imageUrl: ztfImg,
    videoUrl: ztfVid,
    likes: 6,
    description: 'Широкоугольный обзорный телескоп Паломарской обсерватории.',
  },
  {
    id: 2,
    name: 'Pan-STARRS',
    aperture_cm: 180,
    fov_deg: 7,
    imageUrl: panstarrsImg,
    videoUrl: panstarrsVid,
    likes: 4,
    description: 'Панорамный обзорный телескоп на Гавайях.',
  },
  {
    id: 3,
    name: 'LSST (Обсерватория Веры Рубин)',
    aperture_cm: 840,
    fov_deg: 10,
    imageUrl: lsstImg,
    videoUrl: lsstVid,
    likes: 8,
    description: 'Мощнейший обзорный телескоп в Чили.',
  },
  {
    id: 4,
    name: 'TESS',
    aperture_cm: 10,
    fov_deg: 24,
    imageUrl: tessImg,
    videoUrl: tessVid,
    likes: 2,
    description: 'Космический телескоп для поиска экзопланет.',
  },
  {
    id: 5,
    name: 'Gaia',
    aperture_cm: 145,
    fov_deg: 1,
    imageUrl: gaiaImg,
    videoUrl: gaiaVid,
    likes: 5,
    description: 'Астрометрический космический телескоп.',
  },
  {
    id: 6,
    name: 'Keck II',
    aperture_cm: 1000,
    fov_deg: 1,
    imageUrl: keckImg,
    videoUrl: keckVid,
    likes: 0,
    description: 'Один из крупнейших оптических телескопов в мире.',
  },
];
