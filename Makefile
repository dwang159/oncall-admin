all: serve

serve:
	gunicorn --reload --access-logfile=- -b '0.0.0.0:16652' --worker-class gevent \
		-e CONFIG=./configs/config.dev.yaml oncall_admin.gunicorn:application
