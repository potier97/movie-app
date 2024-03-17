# AMBIENTE DE DESARROLLO
FROM node:18-alpine AS development
# CONTROLAR EL TAMAÑO MAXIMO DE LA IMAGEN NODE
ENV NODE_OPTIONS=--max_old_space_size=8192 
#GENERAR LA RUTA DE TRABAJO
WORKDIR /app
# COPIAR package.json PRIMERO
COPY package.json /app/
# DESACTIVAR LA BARRA DE PROGRESO
RUN npm set progress=false && npm config set depth 0 
# INSTALAR TODAS LAS DEPENDENCIAS
RUN npm install
# COPIAR DE LA CARPETA DEL PROYECTO AL CONTENEDOR
COPY . /app
# CONSTRUIR EL PROYECTO
RUN npm run build

# # AMBIENTE DE PRODUCCION
FROM node:18-alpine AS production
# ENTORNO DE DESARROLLO
ARG ENVIRONMENT_NAME=dev
ENV ENVIRONMENT_NAME $ENVIRONMENT_NAME
# CONTROLAR EL TAMAÑO MAXIMO DE LA IMAGEN NODE
ENV NODE_OPTIONS=--max_old_space_size=8192 
#GENERAR LA RUTA DE TRABAJO
WORKDIR /app
# COPIAR package.json PRIMERO
COPY package.json /app/
#DESACTIVAR LA BARRA DE PROGRESO
RUN npm set progress=false && npm config set depth 0 
# INSTALAR SOLO DEPENDENCIAS DE PRODUCCION
RUN npm install
# RUN npm install -g pm2 ansi-styles rimraf ajv
RUN npm install -g pm2 
# # COPIAR DE AMBIENTE DE DESARROLLO
COPY --from=development /app/dist /app/dist
# # PERMISOS DE EJECUCION
RUN chmod +x -R /app/dist
# # SE COPIA ARCHIVO DE CONFIGURACION DE PM2
COPY config/pm2/process.yml /app/
# # COPIAR ARCHIVOS DE CONFIGURACION DE SUPERVISOR 
CMD ["pm2-runtime", "process.yml", "--only", "spresstest"]
