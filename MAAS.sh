#!/bin/bash
#
#	Autor: Lucas Sargeiro
#
#	Titulo: Micelio As A Service
#
#	Description: Torna o Micelio um serviço
#	inicializando ele junto com o sistema
#

# Declarações
SERVICE_FILE="micelio.service"
SERVICE_SOURCE="/var/www/node/micelio/${SERVICE_FILE}"
SERVICE_DEST="/etc/systemd/system/${SERVICE_FILE}"

FOREVER_SOURCE="/usr/local/lib/node_modules/forever/bin/forever"
FOREVER_DEST="/usr/bin/forever"

MICELIO_LOG_DIR="/var/www/node/micelio/MicelioLogs"

# Cria a pasta de Logs do Sistema
mkdir $MICELIO_LOG_DIR


# Cria o link simbolico do Forever
ln -s $FOREVER_SOURCE $FOREVER_DEST  


# Copia o serviço para a pasta do SystemD
cp $SERVICE_SOURCE $SERVICE_DEST
# Da permissão para o arquivo do serviço
chmod 777 $SERVICE_DEST


# Habilita o serviço para iniciar com o sistema
systemctl enable $SERVICE_FILE
# Inicia o serviço
systemctl start $SERVICE_FILE