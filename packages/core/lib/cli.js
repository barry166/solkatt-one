import importLocal from 'import-local';
if (importLocal(import.meta.url)) {
    console.log('Using local version of this package');
}
else {
}
