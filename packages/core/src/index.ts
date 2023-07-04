#! /usr/bin/env node
import importLocal from 'import-local'
import { log } from '@solkatt-one/utils'
import core from './cli'

if (importLocal(__filename)) {
  console.log('Using local version of this package.')
} else {
  console.log('debug cli')
  log.info('cli', 'cli')
  core()
}
