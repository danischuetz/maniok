# Background Processing

![Container View](embed:paperless-containers)

Background processing is modeled as one container because the repository implements several cooperating long-running processes that are packaged and supervised together in the same application image.

## Runtime Roles

- Celery worker executes long-running tasks from `documents.tasks` and `paperless_mail.tasks`.
- Celery beat schedules recurring work such as mail polling and maintenance jobs.
- The `document_consumer` management command watches the consumption directory and submits ingestion work.
- Flower is present as an optional operational service when enabled.

## Processing Responsibilities

- Consume files from watched folders and email attachments.
- Perform OCR, parsing, barcode handling, workflow triggering, and archive generation.
- Train classifiers, update search and LLM indexes, and run maintenance or sanity checks.
- Interact with Redis, the relational database, document storage, and optional parsing and AI services.

## Evidence

- `docker/rootfs/etc/s6-overlay/s6-rc.d/svc-worker/run` starts Celery workers.
- `docker/rootfs/etc/s6-overlay/s6-rc.d/svc-scheduler/run` starts Celery beat.
- `docker/rootfs/etc/s6-overlay/s6-rc.d/svc-consumer/run` starts `manage.py document_consumer`.
- `src/documents/tasks.py` and `src/paperless_mail/tasks.py` define the main task entry points.