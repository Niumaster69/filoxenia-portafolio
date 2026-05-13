CARPETA DE VIDEO — FILOXENIA
=============================

Coloca aquí el archivo de video de sustentación.

NOMBRE ESPERADO POR EL PORTAFOLIO:
    filoxenia-sustentacion.mp4

FORMATO RECOMENDADO:
    - Contenedor: MP4 (H.264 + AAC)
    - Resolución: 1920x1080 (1080p) o 1280x720 (720p)
    - Tamaño orientativo: < 200 MB para una carga ágil

OPCIONES:

1) USAR UN MP4 LOCAL
   - Copia tu archivo aquí y renómbralo a "filoxenia-sustentacion.mp4".
   - No hace falta tocar el HTML.

2) USAR YOUTUBE EN VEZ DE MP4 LOCAL
   - Sube el video a YouTube.
   - En index.html, en el botón #videoLauncher,
     reemplaza data-video-src por data-video-embed con la URL embed:
         data-video-embed="https://www.youtube.com/embed/TU_VIDEO_ID"
     (puedes dejar también data-video-src; data-video-embed tiene prioridad).

3) USAR UN NOMBRE DISTINTO
   - Cambia el valor de data-video-src en index.html para que apunte a tu archivo.

NOTA: Si subes el sitio a un hosting (GitHub Pages, Netlify, Vercel...),
recuerda que los videos grandes pueden exceder los límites del servicio.
Considera comprimir el archivo (HandBrake) o usar YouTube si pesa mucho.
