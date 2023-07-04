#! /usr/bin/env node
import importLocal from 'import-local'
import core from './cli'

if (importLocal(__filename)) {
  console.log('Using local version of this package.')
} else {
  core()
}
