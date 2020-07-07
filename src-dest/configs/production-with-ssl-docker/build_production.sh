#!/bin/bash

# quit if fail
set -e

if ! [ -x "$(command -v docker-compose)" ]; then
  echo 'Error: docker-compose is not installed.' >&2
  exit 1
fi

# =====================================================================
# ================= Config parsing starts         =====================
# =====================================================================
function jsonval {
	temp=`echo $1 | sed 's/\\\\\//\//g' | sed 's/[{}]//g' | awk -v k="text" '{n=split($0,a,","); for (i=1; i<=n; i++) print a[i]}' | sed 's/\"\:\"/\|/g' | sed 's/[\,]/ /g' | sed 's/\"//g' | grep -w $2`
	# | sed -e 's/^ *//g' -e 's/ *$//g
	temp=${temp##*|}
	# remove double quotes
  temp="${temp//\"}"
  # remove single quotes
  temp="${temp//\'}"
  echo "$temp"
}
#dockerized-config.json | getJsonVal "['text']"
JSON_CONF=$(cat "dockerized-config.json")
PUBLIC_URL_ROW=$(jsonval "$JSON_CONF" "publicUrl")
HOSTNAME=$(echo $PUBLIC_URL_ROW | cut -d"/" -f3)
EMAIL=$(echo $(jsonval "$JSON_CONF" "ssl_email") | cut -d":" -f2)
STAGING=$(echo $(jsonval "$JSON_CONF" "ssl_staging") | cut -d":" -f2)

echo "PUBLIC_URL: $PUBLIC_URL_ROW (expecting format https://example.com)"
echo "HOSTNAME: $HOSTNAME  (expecting format example.com)"
echo "EMAIL: $EMAIL (expecting valid email)"
echo "STAGING: $STAGING (expecting 0 or 1)"

# =====================================================================
# ================= Config parsing ends           =====================
# =====================================================================

# =====================================================================
# ================= Certificate generation starts =====================
# =====================================================================
domains=($HOSTNAME)
rsa_key_size=4096
data_path="./var-pryv/certbot"

function create_new_ssl() {

	if [ ! -e "$data_path/conf/options-ssl-nginx.conf" ] || [ ! -e "$data_path/conf/ssl-dhparams.pem" ]; then
	  echo "### Downloading recommended TLS parameters ..."
	  mkdir -p "$data_path/conf"
	  curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot-nginx/certbot_nginx/_internal/tls_configs/options-ssl-nginx.conf > "$data_path/conf/options-ssl-nginx.conf"
	  curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot/certbot/ssl-dhparams.pem > "$data_path/conf/ssl-dhparams.pem"
	  echo
	fi

	echo "### Creating dummy certificate for $domains ..."
	path="/etc/letsencrypt/live/$domains"
	mkdir -p "$data_path/conf/live/$domains"
	ls $data_path/conf/live/$domains
	echo
	HOSTNAME=$HOSTNAME docker-compose -f docker-compose.yml run --rm --entrypoint "\
	  openssl req -x509 -nodes -newkey rsa:2048 -days 1\
		-keyout '$path/privkey.pem' \
		-out '$path/fullchain.pem' \
		-subj '/CN=localhost'" open-pryv-certbot
	echo


	echo "### Starting nginx ..."
	echo "HOSTNAME=$HOSTNAME docker-compose -f docker-compose.yml up --force-recreate -d open-pryv-nginx"
	HOSTNAME=$HOSTNAME docker-compose -f docker-compose.yml up --force-recreate -d open-pryv-nginx
	echo

	echo "### Deleting dummy certificate for $domains ..."
	HOSTNAME=$HOSTNAME docker-compose -f docker-compose.yml run --rm --entrypoint "\
	  rm -Rf /etc/letsencrypt/live/$domains && \
	  rm -Rf /etc/letsencrypt/archive/$domains && \
	  rm -Rf /etc/letsencrypt/renewal/$domains.conf" open-pryv-certbot
	echo


	echo "### Requesting Let's Encrypt certificate for $domains ..."
	#Join $domains to -d args
	domain_args=""
	for domain in "${domains[@]}"; do
	  domain_args="$domain_args -d $domain"
	done

	# Select appropriate email arg
	case "$EMAIL" in
	  "") email_arg="--register-unsafely-without-email" ;;
	  *) email_arg="--email $EMAIL" ;;
	esac

	# Enable staging mode if needed
	if [ $STAGING != "0" ]; then staging_arg="--staging"; fi
	echo 'certbot certonly --webroot -w /var/www/certbot $staging_arg $email_arg $domain_args --rsa-key-size $rsa_key_size --agree-tos --force-renewal" open-pryv-certbot'

	HOSTNAME=$HOSTNAME docker-compose -f docker-compose.yml run --rm --entrypoint "\
	  certbot certonly --webroot -w /var/www/certbot \
		$staging_arg \
		$email_arg \
		$domain_args \
		--rsa-key-size $rsa_key_size \
		--agree-tos \
		--force-renewal" open-pryv-certbot
	echo

	echo "### Reloading nginx ..."
	HOSTNAME=$HOSTNAME docker-compose -f docker-compose.yml exec open-pryv-nginx nginx -s reload
}

if [ -d "$data_path" ]; then
  read -p "Existing data found in $data_path (this is root path because letsencrypt will create only link to this dir). Continue and replace existing certificate? (y/N) " decision
  if [ "$decision" == "Y" ] | [ "$decision" == "y" ]; then
    create_new_ssl;
  fi
else
  echo "Certificates does not exists in $data_path/conf/live/$HOSTNAME so we are creating ones"
  mkdir -p "$data_path/conf/live/$HOSTNAME"
  create_new_ssl;
fi

# =====================================================================
# ================= Certificate generation ends   =====================
# =====================================================================

HOSTNAME=$HOSTNAME docker-compose -f docker-compose.yml up
