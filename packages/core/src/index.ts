#! /usr/bin/env node
import importLocal from 'import-local'
import { log } from '@solkatt-one/utils'
import core from './cli'

if (importLocal(import.meta.url)) {
	console.log('Using local version of this package.')
} else {
	console.log('debug cli')
	log.default.info('cli', 'cli')
	core()
}