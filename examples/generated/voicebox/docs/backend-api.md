# Backend API Components

![Backend Components](embed:voicebox-backend-components)

## Container Purpose

The backend API is the operational core of Voicebox. It runs locally as a Tauri sidecar or as a standalone FastAPI server, and it also serves the built SPA in Docker and web deployments when frontend assets are present.

## Internal Structure

### Route Layer

`backend/routes/__init__.py` registers domain routers for health, profiles, channels, generations, history, transcription, stories, effects, audio, models, tasks, and CUDA management. This reflects an HTTP boundary organized by feature domains.

### Service Layer

`backend/services/` contains the business workflows. Repository evidence shows generation orchestration in `generation.py`, serialized GPU-safe execution in `task_queue.py`, and additional domain services for profiles, history, tasks, transcription, and CUDA handling.

### Engine Adapter Layer

`backend/backends/` provides protocol-based adapters and model registries for TTS and STT engines such as Qwen, Chatterbox, LuxTTS, TADA, Kokoro, MLX, and PyTorch-backed implementations. This keeps the API and service layers engine-agnostic.

### Persistence Layer

`backend/database/` contains SQLAlchemy models, session management, migrations, and seed logic. The backend startup path initializes the database and stores state under the configured data directory.

## Architectural Characteristics

- Route handlers are intentionally thin and delegate to services.
- Generation work is queued serially to avoid GPU contention.
- Model loading and inference are abstracted behind backend protocols.
- The backend owns persistence, task recovery, and frontend asset mounting for web-style deployments.