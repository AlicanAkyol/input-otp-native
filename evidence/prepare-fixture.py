#!/usr/bin/env python3
"""Copy both source versions into a disposable, existing React Native app."""
from pathlib import Path
import io
import shutil
import subprocess
import sys
import tarfile

repo = Path(__file__).resolve().parents[1]
app = Path(sys.argv[1]).resolve()
if not (app / 'node_modules/react-native/package.json').is_file():
    raise SystemExit('Expected an installed, disposable React Native app')
for directory in ('otpBefore', 'otpAfter'):
    if (app / directory).exists():
        raise SystemExit(f'Refusing to overwrite {directory}')
for directory, revision in (
    ('otpBefore', '89cf179c8841ad1b5a483fbff128f671b4fe9762'),
    ('otpAfter', '5af66bd'),
):
    archive = subprocess.check_output(
        ['git', '-C', str(repo), 'archive', revision, 'src']
    )
    with tarfile.open(fileobj=io.BytesIO(archive)) as tar:
        for member in tar.getmembers():
            if member.isfile() and '.test.' not in member.name:
                target = app / directory / Path(member.name).relative_to('src')
                target.parent.mkdir(parents=True, exist_ok=True)
                target.write_bytes(tar.extractfile(member).read())
shutil.copy2(Path(__file__).with_name('App.tsx'), app / 'OTPLayoutFixture.tsx')
print('Import OTPLayoutFixture as the app root. The existing App.tsx was not overwritten.')
