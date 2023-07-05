#! /usr/bin/env node --experimental-specifier-resolution=node
import importLocal from 'import-local'
import core from './cli'

if (importLocal(import.meta.url)) {
  console.log('Using local version of this package.')
} else {
  core()
}
