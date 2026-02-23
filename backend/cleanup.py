import os
import shutil

# Directories and files to move to backup
LEGACY_ITEMS = [
    'config', 'controllers', 'middleware', 'models', 'routes', 'utils',
    'server.js', 'package.json', 'package-lock.json', '.dockerignore', 'Dockerfile', 'render.yaml'
]

# Destination for legacy files
BACKUP_DIR = 'node_backup'

def cleanup():
    if not os.path.exists(BACKUP_DIR):
        os.makedirs(BACKUP_DIR)
        print(f"Created {BACKUP_DIR}")

    for item in LEGACY_ITEMS:
        if os.path.exists(item):
            try:
                # If it's a directory, use shutil.move
                # If it's a file, use os.rename or shutil.move
                dest = os.path.join(BACKUP_DIR, item)
                if os.path.isdir(item):
                    if os.path.exists(dest):
                        shutil.rmtree(dest)
                    shutil.move(item, dest)
                else:
                    shutil.move(item, dest)
                print(f"Moved {item} to {BACKUP_DIR}")
            except Exception as e:
                print(f"Error moving {item}: {e}")
        else:
            print(f"Item {item} not found, skipping.")

if __name__ == "__main__":
    cleanup()
