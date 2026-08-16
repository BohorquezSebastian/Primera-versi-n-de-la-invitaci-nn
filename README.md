# Invitación de boda · Fernando y Sonia

Versión estática preparada para GitHub Pages. Incluye la apertura animada del
sobre, pétalos, fotografía principal, música ambiental, cuenta regresiva, mapa,
calendario, paleta nocturna interactiva, llave Bre-B copiable y formulario de
confirmación por WhatsApp.

## Cambiar la canción

Guarda el archivo de audio autorizado con el nombre `cancion-boda.mp3` dentro
de `public/audio`. No es necesario cambiar el código: al volver a publicar, la
invitación usará esa canción. Mientras el archivo no exista, sonará la melodía
provisional `boda-suave.mp3`.

## Probar en el computador

```bash
npm install
npm run dev
```

## Publicar en GitHub Pages

1. Sube todos los archivos de este proyecto a la rama `main`.
2. En GitHub abre **Settings → Pages**.
3. En **Build and deployment → Source**, selecciona **GitHub Actions**.
4. Abre la pestaña **Actions** y espera a que finalice el proceso
   “Publicar invitación en GitHub Pages”.
5. El enlace público aparecerá en **Settings → Pages**.

Cada cambio enviado posteriormente a `main` volverá a publicar el sitio.

## Reemplazar una versión anterior del repositorio

No elimines la carpeta completa porque contiene el historial oculto `.git`.
Desde la carpeta del proyecto ejecuta `git rm -r .`, copia allí el contenido
de esta versión y después ejecuta:

```bash
npm install
npm run build
git add .
git commit -m "Adaptar invitación para GitHub Pages y WhatsApp"
git push origin main
```

## WhatsApp

Las confirmaciones se preparan para el número colombiano `573045933820`.
El invitado debe revisar el mensaje y tocar **Enviar** en WhatsApp.
