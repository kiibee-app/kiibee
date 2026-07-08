#!/usr/bin/env python3
"""
Database backup script for Kiibee.
Creates a PostgreSQL database backup and saves it locally with timestamp.
"""

import os
import subprocess
import sys
from datetime import datetime

def load_env_file():
    """Load environment variables from .env file."""
    env_path = os.path.join(os.path.dirname(__file__), '.env')
    if os.path.exists(env_path):
        with open(env_path, 'r') as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#') and '=' in line:
                    key, value = line.split('=', 1)
                    key = key.strip()
                    value = value.strip().strip('"').strip("'")
                    if key not in os.environ:
                        os.environ[key] = value

def get_database_url():
    """Get DATABASE_URL from environment."""
    load_env_file()
    db_url = os.getenv('DATABASE_URL')
    if not db_url:
        raise ValueError("DATABASE_URL environment variable is not set")
    return db_url

def parse_database_url(db_url):
    """Parse DATABASE_URL into components for pg_dump."""
    if not db_url.startswith(('postgresql://', 'postgres://')):
        raise ValueError("Invalid DATABASE_URL format")
    
    conn_str = db_url.replace('postgresql://', '').replace('postgres://', '')
    
    user_pass, rest = conn_str.split('@', 1)
    user, password = user_pass.split(':', 1)
    
    host_db = rest.split('?', 1)[0]
    
    if '/' in host_db:
        host_port, database = host_db.split('/', 1)
        if ':' in host_port:
            host, port = host_port.split(':', 1)
        else:
            host = host_port
            port = '5432'
    else:
        host = host_db
        port = '5432'
        database = ''
    
    return {
        'user': user,
        'password': password,
        'host': host,
        'port': port,
        'database': database
    }

def create_backup():
    """Create a database backup using pg_dump."""
    try:
        # Get database URL
        db_url = get_database_url()
        
        # Parse database URL
        db_config = parse_database_url(db_url)
        
        # Generate backup filename
        timestamp = datetime.now().strftime('%Y%m%d-%H%M%S')
        backup_dir = os.path.join(os.path.dirname(__file__), 'backups')
        os.makedirs(backup_dir, exist_ok=True)
        backup_file = os.path.join(backup_dir, f'kiibee-db-{timestamp}.sql')
        
        # Set environment variables for pg_dump
        env = os.environ.copy()
        env['PGPASSWORD'] = db_config['password']
        
        # Build pg_dump command
        pg_dump_path = '/opt/homebrew/opt/postgresql@16/bin/pg_dump'
        
        cmd = [
            pg_dump_path,
            '-h', db_config['host'],
            '-p', db_config['port'],
            '-U', db_config['user'],
            '-d', db_config['database'],
            '-F', 'c',
            '--no-owner',
            '--no-acl',
            '-f', backup_file,
            '--verbose'
        ]
        
        print(f"Starting database backup...")
        print(f"Database: {db_config['database']}")
        print(f"Host: {db_config['host']}:{db_config['port']}")
        print(f"Backup file: {backup_file}")
        
        # Execute pg_dump
        result = subprocess.run(
            cmd,
            env=env,
            capture_output=True,
            text=True
        )
        
        if result.returncode != 0:
            print(f"Backup failed: {result.stderr}")
            sys.exit(1)
        
        # Check file size
        file_size = os.path.getsize(backup_file)
        print(f"Backup completed successfully!")
        print(f"Backup saved to: {backup_file}")
        print(f"File size: {file_size / 1024:.2f} KB")
        
        return backup_file
        
    except ValueError as e:
        print(f"Configuration error: {e}")
        sys.exit(1)
    except FileNotFoundError:
        print("Error: pg_dump not found. Please ensure PostgreSQL client tools are installed.")
        sys.exit(1)
    except Exception as e:
        print(f"Backup failed: {e}")
        sys.exit(1)

if __name__ == '__main__':
    create_backup()
