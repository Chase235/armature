#!/usr/bin/env python3
"""
Mobbin Export Ingestion Pipeline

Parses Mobbin Pro ZIP exports into a searchable local reference library.
Extracts screenshots, metadata, and creates an index for design reference.

Usage:
    python3 ingest-mobbin.py <path-to-zip-or-directory> [--output <output-dir>]
    python3 ingest-mobbin.py ~/Downloads/mobbin-export.zip
    python3 ingest-mobbin.py ~/Downloads/mobbin-screens/ --output references/mobbin/
    python3 ingest-mobbin.py --list                      # List indexed apps
    python3 ingest-mobbin.py --search "onboarding"       # Search index
"""

import argparse
import json
import os
import re
import sys
import zipfile
import shutil
from datetime import datetime
from pathlib import Path


def slugify(text):
    """Convert text to a filesystem-safe slug."""
    text = text.lower().strip()
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[\s_]+', '-', text)
    text = re.sub(r'-+', '-', text)
    return text.strip('-')


def extract_metadata_from_filename(filename):
    """Extract app name, screen name, and tags from Mobbin export filenames."""
    stem = Path(filename).stem
    parts = stem.split(' - ')

    metadata = {
        'filename': filename,
        'app_name': parts[0].strip() if len(parts) > 0 else 'Unknown',
        'screen_name': parts[1].strip() if len(parts) > 1 else stem,
        'tags': [],
        'platform': 'unknown'
    }

    # Detect platform from filename hints
    lower = stem.lower()
    if any(kw in lower for kw in ['ios', 'iphone', 'ipad']):
        metadata['platform'] = 'ios'
    elif any(kw in lower for kw in ['android', 'material']):
        metadata['platform'] = 'android'
    elif any(kw in lower for kw in ['web', 'desktop', 'browser']):
        metadata['platform'] = 'web'

    # Extract tags from parenthetical hints
    tag_match = re.findall(r'\(([^)]+)\)', stem)
    for tag_group in tag_match:
        metadata['tags'].extend([t.strip().lower() for t in tag_group.split(',')])

    return metadata


def extract_metadata_from_json(json_path):
    """Parse Mobbin's metadata JSON if present."""
    try:
        with open(json_path, 'r') as f:
            data = json.load(f)

        # Handle various Mobbin export JSON formats
        if isinstance(data, list):
            return [normalize_metadata(item) for item in data]
        elif isinstance(data, dict):
            if 'screens' in data:
                return [normalize_metadata(s) for s in data['screens']]
            else:
                return [normalize_metadata(data)]
    except (json.JSONDecodeError, KeyError):
        return []

    return []


def normalize_metadata(item):
    """Normalize metadata from various Mobbin JSON formats."""
    return {
        'app_name': item.get('appName', item.get('app_name', item.get('app', 'Unknown'))),
        'screen_name': item.get('screenName', item.get('screen_name', item.get('name', 'Unknown'))),
        'tags': item.get('tags', item.get('labels', [])),
        'platform': item.get('platform', 'unknown'),
        'category': item.get('category', item.get('pattern', '')),
        'description': item.get('description', ''),
        'url': item.get('url', item.get('mobileUrl', '')),
        'flow': item.get('flow', item.get('flowName', '')),
    }


def ingest_zip(zip_path, output_dir):
    """Extract and index a Mobbin ZIP export."""
    output_dir = Path(output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)

    screens_dir = output_dir / 'screens'
    screens_dir.mkdir(exist_ok=True)

    index = {
        'ingested_at': datetime.now().isoformat(),
        'source': str(zip_path),
        'apps': {},
        'screens': []
    }

    with zipfile.ZipFile(zip_path, 'r') as zf:
        # Check for metadata JSON files first
        json_files = [f for f in zf.namelist() if f.endswith('.json')]
        json_metadata = {}

        for jf in json_files:
            with zf.open(jf) as f:
                try:
                    parsed = json.loads(f.read())
                    entries = extract_metadata_from_json_data(parsed)
                    for entry in entries:
                        key = entry.get('screen_name', '') or entry.get('filename', '')
                        if key:
                            json_metadata[key] = entry
                except (json.JSONDecodeError, Exception):
                    pass

        # Process image files
        image_extensions = {'.png', '.jpg', '.jpeg', '.webp'}
        image_files = [f for f in zf.namelist()
                       if Path(f).suffix.lower() in image_extensions
                       and not f.startswith('__MACOSX')]

        for img_file in image_files:
            filename = Path(img_file).name

            # Try JSON metadata first, fall back to filename parsing
            metadata = json_metadata.get(Path(img_file).stem, None)
            if not metadata:
                metadata = extract_metadata_from_filename(filename)

            # Extract image
            app_slug = slugify(metadata.get('app_name', 'unknown'))
            app_dir = screens_dir / app_slug
            app_dir.mkdir(exist_ok=True)

            target_path = app_dir / filename
            with zf.open(img_file) as src, open(target_path, 'wb') as dst:
                dst.write(src.read())

            # Add to index
            screen_entry = {
                **metadata,
                'local_path': str(target_path.relative_to(output_dir)),
                'app_slug': app_slug
            }
            index['screens'].append(screen_entry)

            # Track apps
            app_name = metadata.get('app_name', 'Unknown')
            if app_name not in index['apps']:
                index['apps'][app_name] = {
                    'slug': app_slug,
                    'platform': metadata.get('platform', 'unknown'),
                    'screen_count': 0,
                    'tags': set()
                }
            index['apps'][app_name]['screen_count'] += 1
            index['apps'][app_name]['tags'].update(metadata.get('tags', []))

    # Convert sets to lists for JSON serialization
    for app_data in index['apps'].values():
        app_data['tags'] = sorted(list(app_data['tags']))

    # Write index
    index_path = output_dir / 'index.json'
    with open(index_path, 'w') as f:
        json.dump(index, f, indent=2)

    return index


def extract_metadata_from_json_data(data):
    """Parse metadata from JSON data (already loaded)."""
    if isinstance(data, list):
        return [normalize_metadata(item) for item in data]
    elif isinstance(data, dict):
        if 'screens' in data:
            return [normalize_metadata(s) for s in data['screens']]
        return [normalize_metadata(data)]
    return []


def ingest_directory(dir_path, output_dir):
    """Index a directory of screenshots (for manual drops)."""
    dir_path = Path(dir_path)
    output_dir = Path(output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)

    screens_dir = output_dir / 'screens'
    screens_dir.mkdir(exist_ok=True)

    index_path = output_dir / 'index.json'

    # Load existing index if present
    if index_path.exists():
        with open(index_path, 'r') as f:
            index = json.load(f)
    else:
        index = {
            'ingested_at': datetime.now().isoformat(),
            'source': str(dir_path),
            'apps': {},
            'screens': []
        }

    # Check for metadata JSON
    json_files = list(dir_path.glob('*.json'))
    json_metadata = {}
    for jf in json_files:
        try:
            with open(jf, 'r') as f:
                data = json.load(f)
                entries = extract_metadata_from_json_data(data)
                for entry in entries:
                    key = entry.get('screen_name', '')
                    if key:
                        json_metadata[key] = entry
        except (json.JSONDecodeError, Exception):
            pass

    # Process images
    image_extensions = {'.png', '.jpg', '.jpeg', '.webp'}
    existing_paths = {s['local_path'] for s in index['screens']}

    for img_file in sorted(dir_path.iterdir()):
        if img_file.suffix.lower() not in image_extensions:
            continue

        metadata = json_metadata.get(img_file.stem, None)
        if not metadata:
            metadata = extract_metadata_from_filename(img_file.name)

        app_slug = slugify(metadata.get('app_name', 'unknown'))
        app_dir = screens_dir / app_slug
        app_dir.mkdir(exist_ok=True)

        target_path = app_dir / img_file.name
        rel_path = str(target_path.relative_to(output_dir))

        if rel_path in existing_paths:
            continue

        shutil.copy2(img_file, target_path)

        screen_entry = {
            **metadata,
            'local_path': rel_path,
            'app_slug': app_slug
        }
        index['screens'].append(screen_entry)

        app_name = metadata.get('app_name', 'Unknown')
        if app_name not in index['apps']:
            index['apps'][app_name] = {
                'slug': app_slug,
                'platform': metadata.get('platform', 'unknown'),
                'screen_count': 0,
                'tags': []
            }
        index['apps'][app_name]['screen_count'] += 1
        tags = set(index['apps'][app_name].get('tags', []))
        tags.update(metadata.get('tags', []))
        index['apps'][app_name]['tags'] = sorted(list(tags))

    index['ingested_at'] = datetime.now().isoformat()

    with open(index_path, 'w') as f:
        json.dump(index, f, indent=2)

    return index


def search_index(output_dir, query):
    """Search the ingested reference index."""
    index_path = Path(output_dir) / 'index.json'
    if not index_path.exists():
        print("No index found. Run ingest first.")
        return

    with open(index_path, 'r') as f:
        index = json.load(f)

    query_lower = query.lower()
    results = []

    for screen in index['screens']:
        score = 0
        searchable = ' '.join([
            screen.get('app_name', ''),
            screen.get('screen_name', ''),
            screen.get('category', ''),
            screen.get('description', ''),
            screen.get('flow', ''),
            ' '.join(screen.get('tags', []))
        ]).lower()

        for term in query_lower.split():
            if term in searchable:
                score += 1

        if score > 0:
            results.append((score, screen))

    results.sort(key=lambda x: x[0], reverse=True)

    if not results:
        print(f"No results for '{query}'")
        return

    print(f"\n{'='*60}")
    print(f"  Results for: {query}")
    print(f"  {len(results)} matches")
    print(f"{'='*60}\n")

    for score, screen in results[:20]:
        tags = ', '.join(screen.get('tags', [])[:5])
        print(f"  [{screen.get('app_name', '?')}] {screen.get('screen_name', '?')}")
        if screen.get('category'):
            print(f"    Category: {screen['category']}")
        if tags:
            print(f"    Tags: {tags}")
        print(f"    Path: {screen.get('local_path', '?')}")
        print()


def list_apps(output_dir):
    """List all indexed apps."""
    index_path = Path(output_dir) / 'index.json'
    if not index_path.exists():
        print("No index found. Run ingest first.")
        return

    with open(index_path, 'r') as f:
        index = json.load(f)

    print(f"\n{'='*60}")
    print(f"  Indexed Reference Library")
    print(f"  {len(index['apps'])} apps, {len(index['screens'])} screens")
    print(f"  Last updated: {index.get('ingested_at', 'unknown')}")
    print(f"{'='*60}\n")

    for app_name, data in sorted(index['apps'].items()):
        tags = ', '.join(data.get('tags', [])[:5])
        print(f"  {app_name} ({data['screen_count']} screens) [{data.get('platform', '?')}]")
        if tags:
            print(f"    Tags: {tags}")
    print()


def main():
    parser = argparse.ArgumentParser(description='Mobbin Export Ingestion Pipeline')
    parser.add_argument('source', nargs='?', help='Path to ZIP file or directory of screenshots')
    parser.add_argument('--output', '-o', default=None,
                        help='Output directory (default: references/mobbin/)')
    parser.add_argument('--list', '-l', action='store_true',
                        help='List indexed apps')
    parser.add_argument('--search', '-s', type=str,
                        help='Search the index')

    args = parser.parse_args()

    # Determine output directory
    script_dir = Path(__file__).parent.parent
    output_dir = Path(args.output) if args.output else script_dir / 'references' / 'mobbin'

    if args.list:
        list_apps(output_dir)
        return

    if args.search:
        search_index(output_dir, args.search)
        return

    if not args.source:
        parser.print_help()
        return

    source = Path(args.source)
    if not source.exists():
        print(f"Error: {source} does not exist")
        sys.exit(1)

    if source.suffix.lower() == '.zip':
        print(f"Ingesting ZIP: {source}")
        index = ingest_zip(source, output_dir)
    elif source.is_dir():
        print(f"Ingesting directory: {source}")
        index = ingest_directory(source, output_dir)
    else:
        print(f"Error: {source} is not a ZIP file or directory")
        sys.exit(1)

    print(f"\nIngested {len(index['screens'])} screens from {len(index['apps'])} apps")
    print(f"Index: {output_dir / 'index.json'}")
    print(f"Screens: {output_dir / 'screens'}/")


if __name__ == '__main__':
    main()
