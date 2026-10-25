import VideoGallery3D from './VideoGallery3D';

// Fuente actual de los videos de la galería: configuración local, no conectada al panel.
const videoData = [
  { src: '/videos/CDISFRUTA1.mp4', img: '/img/cdisfruta_03.webp', alt: 'Miniatura del video Auténtico sabor de Ubaté', title: 'Auténtico sabor de Ubaté' },
  { src: '/videos/CDISFRUTA2.mp4', img: '/img/cdisfruta_01.webp', alt: 'Miniatura del video De Ubaté para el mundo', title: 'De Ubaté para el mundo' },
  { src: '/videos/CDISFRUTA4.mp4', img: '/img/cdisfruta_05.webp', alt: 'Miniatura del video Ideal para cualquier momento', title: 'Ideal para cualquier momento' },
];

export default function Videos() {
  return <VideoGallery3D videos={videoData} title="nuestra pasión" />;
}
